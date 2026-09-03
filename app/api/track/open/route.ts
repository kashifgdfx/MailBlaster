import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

/**
 * Transparent 1x1 GIF pixel (base64 encoded)
 * Used for email open tracking
 */
const TRACKING_PIXEL = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
  0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x0a,
  0x00, 0x01, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
  0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");

    if (!campaignId) {
      return new NextResponse(TRACKING_PIXEL, {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    await connectDB();

    /**
     * Increment the openCount for the campaign
     * Using MongoDB $inc operator for atomic operation
     */
    await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { openCount: 1 } },
      { new: false }
    );

  } catch (error) {
    console.error("❌ Tracking Error:", error);
  }

  /**
   * Always return the tracking pixel regardless of success/failure
   * This prevents email clients from showing broken image errors
   * Cache control headers prevent the pixel from being cached
   */
  return new NextResponse(TRACKING_PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
