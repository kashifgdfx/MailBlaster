import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { ids } = await req.json();

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid ids" },
        { status: 400 }
      );
    }

    const result = await Contact.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete contacts" },
      { status: 500 }
    );
  }
}