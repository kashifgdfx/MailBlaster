import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET() {
  console.log("🚀 BOUNCE CHECK STARTED");

  await connectDB();

  const client = new ImapFlow({
    host: "imap.hostinger.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  try {
    await client.connect();
    console.log("✅ IMAP CONNECTED");

    const mailbox = await client.mailboxOpen("INBOX");

    console.log(`📬 TOTAL EMAILS: ${mailbox.exists}`);

    let bounceFound = 0;

    const latestCampaign = await Campaign.findOne({
      status: "sent",
    }).sort({ sentAt: -1 });

    if (!latestCampaign) {
      await client.logout();

      return NextResponse.json({
        success: false,
        message: "No sent campaign found",
      });
    }

    for await (const msg of client.fetch("1:*", {
      uid: true,
      source: true,
      envelope: true,
      flags: true,
    })) {
      try {
        const uid = String(msg.uid);

        // Already processed bounce skip
        if (
          latestCampaign.processedBounceIds?.includes(uid)
        ) {
          continue;
        }

        // Already seen email skip
        if (msg.flags?.has("\\Seen")) {
          continue;
        }

        const parsed = await simpleParser(msg.source);

        const from = parsed.from?.text || "";
        const subject = parsed.subject || "";
        const text = parsed.text || "";

        console.log("FROM:", from);
        console.log("SUBJECT:", subject);

        const isBounce =
          from.includes("MAILER-DAEMON") ||
          from.includes("Mail Delivery System") ||
          subject.includes("Undelivered") ||
          subject.includes("Delivery Status Notification") ||
          subject.includes("Returned mail") ||
          text.includes("could not be delivered") ||
          text.includes("delivery failed") ||
          text.includes("recipient address rejected");

        if (!isBounce) {
          continue;
        }

        bounceFound++;

        console.log("🚨 BOUNCE FOUND");

        const emailMatch = text.match(
          /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
        );

        const bouncedEmail =
          emailMatch?.find(
            (email) => email !== process.env.EMAIL_USER
          ) || "unknown";

        await Campaign.findByIdAndUpdate(
          latestCampaign._id,
          {
            $inc: {
              bounceCount: 1,
            },
            $push: {
              processedBounceIds: uid,
              failedEmails: {
                email: bouncedEmail,
                reason: subject,
                date: new Date(),
              },
            },
          }
        );

        // Mark email as processed
        await client.messageFlagsAdd(
          msg.uid,
          ["\\Seen"]
        );

        console.log(
          `❌ Bounce Added: ${bouncedEmail}`
        );
      } catch (err) {
        console.error(
          "Message Parse Error:",
          err
        );
      }
    }

    await client.logout();

    return NextResponse.json({
      success: true,
      totalEmails: mailbox.exists,
      bounceFound,
      campaignId: latestCampaign._id,
    });
  } catch (err) {
    console.error(
      "❌ BOUNCE SCAN ERROR:",
      err
    );

    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : String(err),
      },
      {
        status: 500,
      }
    );
  }
}