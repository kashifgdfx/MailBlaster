"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarDays, MailCheck, Send, TrendingUp } from "lucide-react";

export default function OpenRateChart() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/campaigns");
    const data = await res.json();

    setCampaigns(data.slice(0, 7));
  };

  const maxSent = Math.max(
    ...campaigns.map((c) => c.sentCount || 0),
    1
  );
  const totalSent = campaigns.reduce(
    (total, campaign) => total + (campaign.sentCount || 0),
    0
  );
  const averageSent = campaigns.length > 0 ? Math.round(totalSent / campaigns.length) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-6 pb-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MailCheck className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-slate-800">
              Emails Sent Trend
            </h3>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Last 7 campaigns performance
          </p>
        </div>

        <span className="mr-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          Recent campaigns
        </span>
      </div>

      <div className="grid grid-cols-2 border-y border-slate-100 bg-slate-50/70 sm:grid-cols-3">
        <div className="border-r border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Send className="h-3.5 w-3.5 text-emerald-600" />
            Total sent
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            {totalSent.toLocaleString()}
          </p>
        </div>
        <div className="px-6 py-4 sm:border-r sm:border-slate-100">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Campaign average
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            {averageSent.toLocaleString()}
          </p>
        </div>
        <div className="col-span-2 hidden px-6 py-4 sm:col-span-1 sm:block">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
            Highest volume
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            {campaigns.length > 0 ? maxSent.toLocaleString() : "—"}
          </p>
        </div>
      </div>

      <div className="h-64 px-6 pb-5 pt-6">
        <div className="flex h-full items-end justify-between gap-3">
          {campaigns.map((campaign, idx) => (
            <div
              key={campaign._id}
              className="group flex h-full flex-1 flex-col items-center gap-3"
            >
              <div className="relative flex w-full flex-1 items-end rounded-lg bg-slate-100/80 px-1.5 pt-2">
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                  {(campaign.sentCount || 0).toLocaleString()} Emails
                </div>
                <div
                  className="min-h-1.5 w-full rounded-md rounded-b-sm bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_-4px_12px_rgba(5,150,105,0.16)] transition-all duration-300 ease-out group-hover:from-emerald-500 group-hover:to-emerald-300"
                  style={{
                    height: `${((campaign.sentCount || 0) / maxSent) * 100}%`,
                  }}
                />
              </div>

              <span className="text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700">
                {new Date(campaign.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
