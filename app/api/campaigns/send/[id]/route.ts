import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";
import { transporter } from "@/lib/mailer";
import { getSettings } from "@/lib/getSettings";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🚀 Campaign Send API Hit");

  try {
    await connectDB();

    const { id } = await params;

    console.log("Campaign ID:", id);

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    

    if (campaign.isDeleted === true) {
      return NextResponse.json(
        { error: "Archived campaigns cannot be sent" },
        { status: 400 }
      );
    }

    console.log("Campaign Found:", {
      title: campaign.title,
      subject: campaign.subject,
      targetSegment: campaign.targetSegment,
    });

    campaign.status = "sending";
    await campaign.save();

    const settings = await getSettings();
    const fromAddress = settings
      ? `"${settings.senderName}" <${settings.senderEmail}>`
      : process.env.EMAIL_USER;
    console.log("Settings:", settings);
    console.log("From Address:", fromAddress);
    const companyName = settings?.companyName || "";



    const contacts = await Contact.find({
      status: "active",
    });

    console.log("Total Contacts Found:", contacts.length);

    console.log(
      "Emails:",
      contacts.map((c) => c.email)
    );

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: "No active contacts found" },
        { status: 400 }
      );
    }

    let sentCount = 0;
    let bounceCount = 0;
    const failedEmails: { email: string; reason: string; date: Date }[] = [];
    const batchSize = 5;

    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);

      console.log(
        `🚀 Sending Batch ${Math.floor(i / batchSize) + 1}`
      );

      for (const contact of batch) {
        try {
          console.log(
            `📨 Sending email to: ${contact.email}`
          );

          const currentDate = new Date();

          const personalizedContent = (campaign.content || "")
            .replace(/{{name}}/g, contact.name || "Subscriber")
            .replace(/{{company}}/g, companyName);

          const footer = `
        <hr style="margin-top:30px;border:none;border-top:1px solid #e5e7eb">
        <p style="font-size:12px;color:#6b7280;text-align:center">
          This email was sent on ${currentDate.toLocaleString()}
        </p>
      `;

          const wrappedHtml = `
        <div style="max-width:700px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#1f2937;background:#ffffff;padding:20px">
          ${personalizedContent}
          ${footer}
        </div>
      `;

          const appUrl = (
            process.env.APP_URL ||
            `${req.nextUrl.protocol}//${req.nextUrl.host}`
          ).replace(/\/$/, "");

          const trackingPixel = `
        <img
          src="${appUrl}/api/track/open?campaignId=${campaign._id}"
          width="1"
          height="1"
          style="display:none"
          alt=""
        />
      `;

          const htmlWithTracking =
            wrappedHtml + trackingPixel;

          await transporter.sendMail({
            from: fromAddress,
            to: contact.email,
            subject: campaign.subject,
            html: htmlWithTracking,
            headers: {
              Date: currentDate.toUTCString(),
              "X-Mailer": "EmailBlaster Pro",
              "X-Priority": "3",
            },
          });

          sentCount++;

          // Random delay between emails (2-7 sec)
          const emailDelay =
            Math.floor(Math.random() * 5000) + 2000;

          console.log(
            `⏳ Waiting ${Math.round(
              emailDelay / 1000
            )}s before next email`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, emailDelay)
          );
        } catch (error: any) {
          console.error(
            `❌ FAILED: ${contact.email}`,
            error
          );

          bounceCount++;

          failedEmails.push({
            email: contact.email,
            reason:
              error?.message || "Unknown error",
            date: new Date(),
          });
        }
      }

      // Random delay between batches (15-45 sec)
      if (i + batchSize < contacts.length) {
        const batchDelay =
          Math.floor(Math.random() * 30000) + 15000;

        console.log(
          `⏳ Batch complete. Waiting ${Math.round(
            batchDelay / 1000
          )}s before next batch`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, batchDelay)
        );
      }
    }
    await Campaign.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "sent",
          totalRecipients: contacts.length,
          sentCount,
          bounceCount,
          failedEmails,
          sentAt: new Date(),
        },
      },
      { new: true }
    );

    console.log("Campaign Completed");
    console.log("Recipients:", contacts.length);
    console.log("Sent:", sentCount);
    console.log(
      "Failed:",
      contacts.length - sentCount
    );

    return NextResponse.json({
      success: true,
      campaignId: campaign._id,
      totalRecipients: contacts.length,
      sentCount,
      bounceCount,
      failedCount: contacts.length - sentCount,
    });
  } catch (error) {
    console.error(
      "❌ Campaign Send Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to send campaign",
      },
      {
        status: 500,
      }
    );
  }
}