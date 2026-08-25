import React from "react";
import { AlertTriangle, CalendarDays, MailX, TrendingDown } from "lucide-react";

interface Props {
  data?: { day: string; value: number }[];
}

export default function BounceChart({ data = [] }: Props) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const totalBounces = data.reduce((total, item) => total + item.value, 0);
  const averageBounces = data.length > 0 ? Math.round(totalBounces / data.length) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-6 pb-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-slate-800">Bounce & Error Rate</h3>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Undelivered emails due to invalid addresses or server blocks
          </p>
        </div>
        <span className="mr-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          Last 7 days
        </span>
      </div>

      <div className="grid grid-cols-2 border-y border-slate-100 bg-slate-50/70 sm:grid-cols-3">
        <div className="border-r border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <MailX className="h-3.5 w-3.5 text-rose-600" />
            Total bounces
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            {totalBounces.toLocaleString()}
          </p>
        </div>
        <div className="px-6 py-4 sm:border-r sm:border-slate-100">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            Daily average
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            {averageBounces.toLocaleString()}
          </p>
        </div>
        <div className="col-span-2 hidden px-6 py-4 sm:col-span-1 sm:block">
          <p className="text-xs font-medium text-slate-500">Highest daily volume</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            {data.length > 0 ? maxValue.toLocaleString() : "—"}
          </p>
        </div>
      </div>

      <div className="h-64 px-6 pb-5 pt-6">
        <div className="flex h-full items-end justify-between gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="group flex h-full flex-1 flex-col items-center gap-3">
              <div className="relative flex w-full flex-1 items-end rounded-lg bg-slate-100/80 px-1.5 pt-2">
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                  {item.value.toLocaleString()} Bounces
                </div>
                <div
                  className="w-full rounded-md rounded-b-sm bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_-4px_12px_rgba(225,29,72,0.16)] transition-all duration-300 ease-out group-hover:from-rose-500 group-hover:to-rose-300"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: item.value > 0 ? "4px" : "0",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
