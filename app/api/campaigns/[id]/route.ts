import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const permanent =
      searchParams.get("permanent") === "true";

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // PERMANENT DELETE
    if (permanent) {
      await Campaign.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: "Campaign permanently deleted",
      });
    }

    // ARCHIVE
    if (campaign.isDeleted === true) {
      return NextResponse.json(
        { error: "Campaign already archived" },
        { status: 400 }
      );
    }

    await Campaign.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Campaign archived successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to process campaign",
      },
      {
        status: 500,
      }
    );
  }
}