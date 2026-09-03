import { NextResponse } from "next/server";

import { dequeueCampaign } from "@/lib/queue";
import { sendCampaignChunk } from "@/lib/sendCampaignChunk";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";

const CHUNK_SIZE = 25;

export async function GET() {
  return processCampaignQueue();
}

export async function POST() {
  return processCampaignQueue();
}

async function processCampaignQueue() {
  try {
    await connectDB();

    const job = await dequeueCampaign();

    if (!job?.campaignId) {
      return NextResponse.json({
        success: true,
        processed: false,
        message: "No queued campaigns",
      });
    }

    const campaign = await Campaign.findById(job.campaignId);

    if (!campaign) {
      console.warn("Queued campaign not found in MongoDB for job", job.campaignId);
      return NextResponse.json({
        success: true,
        processed: false,
        message: `Campaign not found for queued job: ${job.campaignId}`,
      });
    }

    campaign.status = "sending";
    campaign.queuedAt = campaign.queuedAt || new Date();
    await campaign.save();

    const totalRecipients = Number(campaign.totalRecipients || 0);
    const nextTotalRecipients = totalRecipients || (await Contact.countDocuments({ status: "active" }));

    if (nextTotalRecipients === 0) {
      await Campaign.findByIdAndUpdate(campaign._id, {
        $set: {
          status: "failed",
          sentAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        processed: false,
        message: "No active contacts found",
      });
    }

    if (campaign.totalRecipients !== nextTotalRecipients) {
      campaign.totalRecipients = nextTotalRecipients;
      await campaign.save();
    }

    const lastProcessed = Number(campaign.lastProcessed || 0);
    const contacts = await Contact.find({ status: "active" })
      .sort({ createdAt: 1, _id: 1 })
      .skip(lastProcessed)
      .limit(CHUNK_SIZE)
      .lean();

    if (contacts.length === 0) {
      const finalStatus = Number(campaign.sentCount || 0) >= nextTotalRecipients ? "sent" : "failed";

      await Campaign.findByIdAndUpdate(campaign._id, {
        $set: {
          status: finalStatus,
          sentAt: finalStatus === "sent" ? new Date() : campaign.sentAt || null,
        },
      });

      return NextResponse.json({
        success: true,
        processed: false,
        message: "No further contacts to process",
      });
    }

    const chunkResult = await sendCampaignChunk(
      {
        _id: String(campaign._id),
        subject: campaign.subject,
        content: campaign.content,
      },
      contacts
    );

    const updatedSentCount = Number(campaign.sentCount || 0) + chunkResult.sentCount;
    const updatedBounceCount = Number(campaign.bounceCount || 0) + chunkResult.bounceCount;
    const updatedLastProcessed = lastProcessed + contacts.length;
    const updatedFailedEmails = [
      ...(campaign.failedEmails || []),
      ...chunkResult.failedEmails,
    ];

    const hasMoreContacts = updatedLastProcessed < nextTotalRecipients;
    const allFailed = chunkResult.allFailed || (updatedSentCount === 0 && updatedBounceCount > 0);
    const finalStatus = allFailed ? "failed" : hasMoreContacts ? "sending" : "sent";

    await Campaign.findByIdAndUpdate(campaign._id, {
      $set: {
        status: finalStatus,
        sentCount: updatedSentCount,
        bounceCount: updatedBounceCount,
        lastProcessed: updatedLastProcessed,
        failedEmails: updatedFailedEmails,
        sentAt: finalStatus === "sent" ? new Date() : finalStatus === "failed" ? new Date() : campaign.sentAt || null,
      },
    });

   if (hasMoreContacts && !allFailed) {
  await enqueueCampaign(campaign._id.toString());

  fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/process-campaigns`,
    {
      method: "POST",
    }
  ).catch(console.error);
}

    return NextResponse.json({
      success: true,
      processed: true,
      campaignId: campaign._id.toString(),
      chunkSize: contacts.length,
      sentCount: chunkResult.sentCount,
      bounceCount: chunkResult.bounceCount,
      remaining: Math.max(nextTotalRecipients - updatedLastProcessed, 0),
      status: finalStatus,
      error: allFailed ? chunkResult.lastError || "SMTP delivery failed for all recipients" : null,
    });
  } catch (error) {
    console.error("❌ Campaign processing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process campaign queue",
      },
      { status: 500 }
    );
  }
}

async function enqueueCampaign(campaignId: string) {
  const { enqueueCampaign: addToQueue } = await import("@/lib/queue");
  await addToQueue(campaignId);
}
