import React from "react";
import { TrendingUp } from "lucide-react";

interface OverviewStatsCardProps {
  title: string;
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export default function OverviewStatsCard({
  title,
  value,
  label,
  icon,
}: OverviewStatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          {title}
        </span>

        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          {icon || <TrendingUp className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-800">
          {typeof value === "number"
            ? value.toLocaleString()
            : value}
        </h3>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
          {label}
        </span>
      </div>
    </div>
  );
}