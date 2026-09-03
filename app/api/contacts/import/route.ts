import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "CSV file required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const contacts: any[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer)
        .pipe(csv())
        .on("data", (row) => {
          contacts.push({
            name: row.name || "",
            email: row.email?.trim().toLowerCase(),
            status: "active",
          });
        })
        .on("end", () => resolve())
        .on("error", reject);
    });

    const validContacts = contacts.filter(
      (c) => c.email && c.email.includes("@")
    );

    let imported = 0;
    let skipped = 0;

    if (validContacts.length > 0) {
      const existingContacts = await Contact.find(
        {
          email: {
            $in: validContacts.map((c) => c.email),
          },
        },
        { email: 1 }
      );

      const existingEmails = new Set(
        existingContacts.map((c) => c.email)
      );

      const newContacts = validContacts.filter(
        (c) => !existingEmails.has(c.email)
      );

      skipped = validContacts.length - newContacts.length;
      imported = newContacts.length;

      if (newContacts.length > 0) {
        await Contact.insertMany(newContacts);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      total: validContacts.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}