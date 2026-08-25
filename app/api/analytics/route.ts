import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const totalContacts = await Contact.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const sentCampaigns = await Campaign.countDocuments({ status: "sent" });

    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    const totalEmailsSent = campaigns.reduce(
      (sum, c) => sum + (c.sentCount || 0),
      0
    );

    const totalEmailsAttempted = campaigns.reduce(
      (sum, c) =>
        sum + (c.totalRecipients || (c.sentCount || 0) + (c.bounceCount || 0)),
      0
    );

    const totalBounces = campaigns.reduce(
      (sum, c) => sum + (c.bounceCount || 0),
      0
    );

    const bounceRate =
      totalEmailsAttempted > 0
        ? parseFloat(((totalBounces / totalEmailsAttempted) * 100).toFixed(2))
        : 0;

    // Build last-7-days bounce trend from failedEmails records
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trendMap: Record<string, number> = {};

    const now = new Date();
    const last7: { label: string; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = days[d.getDay()];
      last7.push({ label, date: d });
      trendMap[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`] = 0;
    }

    for (const campaign of campaigns) {
      for (const fe of campaign.failedEmails || []) {
        if (!fe.date) continue;
        const fd = new Date(fe.date);
        const key = `${fd.getFullYear()}-${fd.getMonth()}-${fd.getDate()}`;
        if (key in trendMap) {
          trendMap[key]++;
        }
      }
    }

    // Build last-7-days sent trend from sentAt field
    const sentTrendMap: Record<string, number> = {};
    for (const { date } of last7) {
      sentTrendMap[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] = 0;
    }
    for (const campaign of campaigns) {
      if (!campaign.sentAt) continue;
      const sd = new Date(campaign.sentAt);
      const key = `${sd.getFullYear()}-${sd.getMonth()}-${sd.getDate()}`;
      if (key in sentTrendMap) {
        sentTrendMap[key] += campaign.sentCount || 0;
      }
    }
    const sentTrend = last7.map(({ label, date }) => ({
      day: label,
      value: sentTrendMap[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] || 0,
    }));

    const bounceTrend = last7.map(({ label, date }) => ({
      day: label,
      value:
        trendMap[
          `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        ] || 0,
    }));

    const topCampaigns = campaigns.slice(0, 4);

    return NextResponse.json({
      totalContacts,
      totalCampaigns,
      sentCampaigns,
      totalEmailsSent,
      totalBounces,
      bounceRate,
      bounceTrend,
      sentTrend,
      topCampaigns,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Analytics Error" }, { status: 500 });
  }
}
