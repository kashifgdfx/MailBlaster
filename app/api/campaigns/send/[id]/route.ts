import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { enqueueCampaign } from "@/lib/queue";
import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
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

    if (["queued", "sending"].includes(campaign.status)) {
      return NextResponse.json(
        { error: "Campaign is already queued or sending" },
        { status: 400 }
      );
    }

    if (campaign.status === "sent") {
      return NextResponse.json(
        { error: "Campaign has already been sent" },
        { status: 400 }
      );
    }

    const totalRecipients = await Contact.countDocuments({ status: "active" });

    if (totalRecipients === 0) {
      return NextResponse.json(
        { error: "No active contacts found" },
        { status: 400 }
      );
    }

    campaign.status = "queued";
    campaign.totalRecipients = totalRecipients;
    campaign.lastProcessed = 0;
    campaign.queuedAt = new Date();
    campaign.sentAt = null;
    campaign.sentCount = 0;
    campaign.bounceCount = 0;
    campaign.set("failedEmails", []);
    await campaign.save();

    await enqueueCampaign(campaign._id.toString());

    return NextResponse.json({
      success: true,
      campaignId: campaign._id,
      totalRecipients,
      message: "Campaign queued successfully",
    });
  } catch (error) {
    console.error("? Campaign queue error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to queue campaign";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
