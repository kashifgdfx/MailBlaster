import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  await connectDB();

  const settings = await Settings.findOne();

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(body);
  } else {
    settings = await Settings.findByIdAndUpdate(
      settings._id,
      body,
      { new: true }
    );
  }

  return NextResponse.json(settings);
}