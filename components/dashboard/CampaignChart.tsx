"use client";

import React, { useEffect, useState } from "react";

export default function CampaignChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setChartData(data.chartData || []);
    } catch (error) {
      console.error("Failed to load chart", error);
    } finally {
      setLoading(false);
    }
  };

  // Safely compute max value with fallbacks
  const maxValue = chartData.length > 0 
    ? Math.max(...chartData.map((d) => Math.max(d.sent || 0, d.opened || 0)), 1)
    : 1;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-end space-x-4">
          <div className="w-24 h-4 bg-slate-200 rounded" />
          <div className="w-24 h-4 bg-slate-200 rounded" />
        </div>
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex items-center justify-end space-x-6 text-xs font-medium text-slate-600">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-blue-600 rounded-sm shadow-sm" />
          <span>Sent Emails</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm" />
          <span>Opened Emails</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-64 flex items-end justify-between gap-3 pt-8 px-2 border-b border-slate-200">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
        </div>

        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-400 z-10">
            No Campaign Data Available
          </div>
        ) : (
         chartData.map((item, index) => {
            const sentHeight = `${Math.min(Math.max(((item.sent || 0) / maxValue) * 100, 4), 100)}%`;
            const openedHeight = `${Math.min(Math.max(((item.opened || 0) / maxValue) * 100, 4), 100)}%`;

            return (
              <div
                key={`${item.day}-${index}`} // <-- Fixed: Combined day and index for guaranteed uniqueness
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative z-10"
              >
                {/* Tooltip */}
                <div className="absolute -top-12 bg-slate-900 text-white text-[11px] font-medium py-1.5 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 -translate-y-1 group-hover:translate-y-0">
                  <span className="text-blue-400">Sent: {item.sent ?? 0}</span>
                  <span className="text-slate-400 mx-1.5">|</span>
                  <span className="text-emerald-400">Opened: {item.opened ?? 0}</span>
                </div>

                {/* Bars Wrapper */}
                <div className="w-full flex items-end justify-center gap-1 h-52">
                  {/* Sent Bar */}
                  <div
                    style={{ height: sentHeight }}
                    className="w-1/2 bg-blue-600 hover:bg-blue-500 rounded-t-md transition-all duration-300 shadow-sm"
                  />
                  {/* Opened Bar */}
                  <div
                    style={{ height: openedHeight }}
                    className="w-1/2 bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all duration-300 shadow-sm"
                  />
                </div>

                {/* X-Axis Label */}
                <span className="text-xs font-semibold text-slate-500 truncate max-w-full">
                  {item.day}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}