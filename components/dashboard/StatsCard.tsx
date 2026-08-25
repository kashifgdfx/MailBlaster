import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, change, icon }: StatsCardProps) {
const numericChange = parseFloat(
  change.replace("%", "").replace("+", "")
);

const isPositive = change.startsWith("+");
const isNeutral = numericChange === 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          {icon || <TrendingUp className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <span
  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
    isNeutral
      ? "bg-slate-100 text-slate-600"
      : isPositive
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600"
  }`}
>
  {!isNeutral &&
    (isPositive ? (
      <ArrowUpRight className="w-3 h-3 mr-0.5" />
    ) : (
      <ArrowDownRight className="w-3 h-3 mr-0.5" />
    ))}

  {change}
</span>
      </div>
    </div>
  );
}