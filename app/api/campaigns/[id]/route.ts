import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const campaign = await Campaign.findById(id).select("isDeleted");

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.isDeleted === true) {
      return NextResponse.json(
        { error: "Campaign already archived" },
        { status: 400 }
      );
    }

    const archived = await Campaign.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!archived || archived.isDeleted !== true) {
      return NextResponse.json(
        { error: "Failed to archive campaign" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Campaign archived successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
