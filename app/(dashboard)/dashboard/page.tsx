"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import OverviewStatsCard from "@/components/dashboard/OverviewStatsCard";
import CampaignChart from "@/components/dashboard/CampaignChart";
import RecentCampaigns from "@/components/dashboard/RecentCampaigns";

// import {
//   Mail,
//   Send,
//   Users,
//   BarChart3,
// } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalEmailsSent: 0,
    totalCampaigns: 0,
    activeContacts: 0,
    sentCampaigns: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      setStats(data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Monitor campaigns, contacts, and email delivery performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <OverviewStatsCard
            title="Total Emails Sent"
            value={stats.totalEmailsSent}
            label={`${stats.sentCampaigns} Campaigns`}
          />

          <OverviewStatsCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            label="Created"
          />

          <OverviewStatsCard
            title="Sent Campaigns"
            value={stats.sentCampaigns}
            label="Delivered"
          />

          <OverviewStatsCard
            title="Active Contacts"
            value={stats.activeContacts}
            label="Subscribers"
          />
        </div>

        {/* Chart + Recent Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Campaign Performance
              </h2>
            </div>

            <CampaignChart />
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Recent Campaigns
            </h2>

            <RecentCampaigns />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}