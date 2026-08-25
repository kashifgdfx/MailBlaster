import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const campaign = await Campaign.create(body);

    return NextResponse.json(campaign);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const archived = new URL(req.url).searchParams.get("archived") === "true";
    const campaigns = await Campaign.find(
      archived
        ? { isDeleted: true }
        : {
            $or: [
              { isDeleted: false },
              { isDeleted: { $exists: false } },
            ],
          }
    ).sort({ createdAt: -1 });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}