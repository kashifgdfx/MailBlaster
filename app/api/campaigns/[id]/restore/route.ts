import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function PATCH(
  req: Request,
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

    await Campaign.findByIdAndUpdate(id, {
      $set: {
        isDeleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Campaign restored successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to restore campaign",
      },
      {
        status: 500,
      }
    );
  }
}