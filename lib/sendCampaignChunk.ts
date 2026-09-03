import { connectDB } from "@/lib/mongodb";
import { transporter } from "@/lib/mailer";
import { getSettings } from "@/lib/getSettings";
import Campaign from "@/models/Campaign";

export type FailedEmailEntry = {
  email: string;
  reason: string;
  date: Date;
};

export type CampaignContact = {
  _id?: string;
  email: string;
  name?: string;
};

export async function sendCampaignChunk(
  campaign: {
    _id: string;
    subject: string;
    content?: string;
  },
  contacts: CampaignContact[]
) {
  await connectDB();

  const settings = await getSettings();
  const fromAddress = settings
    ? `"${settings.senderName}" <${settings.senderEmail}>`
    : process.env.EMAIL_USER;
  const companyName = settings?.companyName || "";
  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

  let sentCount = 0;
  let bounceCount = 0;
  const failedEmails: FailedEmailEntry[] = [];
  let lastError: string | null = null;

  for (const contact of contacts) {
    try {
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

      const trackingPixel = `
        <img
          src="${appUrl}/api/track/open?campaignId=${campaign._id}"
          width="1"
          height="1"
          style="display:none"
          alt=""
        />
      `;

      await transporter.sendMail({
        from: fromAddress,
        to: contact.email,
        subject: campaign.subject,
        html: wrappedHtml + trackingPixel,
        headers: {
          Date: currentDate.toUTCString(),
          "X-Mailer": "EmailBlaster Pro",
          "X-Priority": "3",
        },
      });

      sentCount += 1;
    } catch (error: any) {
      bounceCount += 1;
      const reason = error?.message || "Unknown error";
      lastError = reason;
      failedEmails.push({
        email: contact.email,
        reason,
        date: new Date(),
      });
    }
  }

  await Campaign.findByIdAndUpdate(
    campaign._id,
    {
      $set: {
        failedEmails: failedEmails,
      },
      $inc: {
        sentCount: sentCount,
        bounceCount: bounceCount,
      },
    },
    { new: true }
  );

  return {
    sentCount,
    bounceCount,
    failedEmails,
    lastError,
    allFailed: sentCount === 0 && failedEmails.length > 0,
  };
}
