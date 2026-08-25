import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Contact from "@/models/Contact";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();

    const totalContacts =
      await Contact.countDocuments();

    const activeContacts =
      await Contact.countDocuments({
        status: "active",
      });

    const totalCampaigns =
      await Campaign.countDocuments();

    const sentCampaigns =
      await Campaign.countDocuments({
        status: "sent",
      });

    const campaigns = await Campaign.find()
      .sort({ createdAt: 1 });

    const totalEmailsSent = campaigns.reduce(
      (sum, campaign) =>
        sum + (campaign.sentCount || 0),
      0
    );

    /**
     * Calculate total emails opened using real tracking data
     * from the openCount field (incremented by tracking pixel)
     */
    const totalEmailsOpened = campaigns.reduce(
      (sum, campaign) =>
        sum + (campaign.openCount || 0),
      0
    );

    const recentCampaigns =
      await Campaign.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "title status sentCount openCount totalRecipients createdAt"
        );

    /**
     * Chart data uses real sent and opened counts
     * instead of fake calculations based on percentages
     */
    const chartData = campaigns
      .slice(-7)
      .map((campaign) => ({
        day: new Date(
          campaign.createdAt
        ).toLocaleDateString("en-US", {
          weekday: "short",
        }),

        sent: campaign.sentCount || 0,

        opened: campaign.openCount || 0,
      }));

    return NextResponse.json({
      totalContacts,
      activeContacts,
      totalCampaigns,
      sentCampaigns,
      totalEmailsSent,
      totalEmailsOpened,
      recentCampaigns,
      chartData,
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Dashboard Error",
      },
      {
        status: 500,
      }
    );
  }
}