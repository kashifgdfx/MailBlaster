"use client";

import React, { useEffect, useState } from "react";
import {
  MailCheck,
  Clock,
  AlertCircle,
  Send,
} from "lucide-react";

export default function RecentCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      setCampaigns(data.recentCampaigns || []);
    } catch (error) {
      console.error(
        "Failed to load recent campaigns",
        error
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
            <MailCheck className="w-3.5 h-3.5" />
            Sent
          </span>
        );

      case "sending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <Send className="w-3.5 h-3.5 animate-pulse" />
            Sending
          </span>
        );

      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            Draft
          </span>
        );

      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="divide-y divide-slate-100">
        {campaigns.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500">
            No Campaigns Found
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                  {campaign.title}
                </h4>

                {getStatusBadge(
                  campaign.status
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Recipients:{" "}
                  {campaign.sentCount || 0}
                </span>

                <span>
                  {new Date(
                    campaign.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}