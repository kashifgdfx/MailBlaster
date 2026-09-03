import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const totalRecipients = Number(campaign.totalRecipients || 0);
    const sentCount = Number(campaign.sentCount || 0);
    const bounceCount = Number(campaign.bounceCount || 0);
    const remaining = Math.max(totalRecipients - sentCount, 0);
    const progressPercentage = totalRecipients > 0 ? Math.round((sentCount / totalRecipients) * 100) : 0;

    return NextResponse.json({
      status: campaign.status,
      totalRecipients,
      sentCount,
      bounceCount,
      remaining,
      progressPercentage,
    });
  } catch (error) {
    console.error("Failed to fetch campaign progress:", error);
    return NextResponse.json({ error: "Failed to fetch campaign progress" }, { status: 500 });
  }
}
