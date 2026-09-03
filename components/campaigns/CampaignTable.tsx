import React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Play, Eye, Trash2, MailCheck, Clock, AlertCircle, Send, Inbox } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: 'Completed' | 'Sending' | 'Queued' | 'Draft' | 'Failed';
  recipientsCount: number;
  sentCount: number;
  openRate: string;
  createdAt: string;
}

interface CampaignTableProps {
  campaigns: Campaign[];
  onView?: (id: string) => void;
  onAction?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function CampaignTable({ campaigns, onView, onAction, onDelete }: CampaignTableProps) {
  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
            <MailCheck className="w-3.5 h-3.5 text-emerald-600" /> Completed
          </span>
        );
      case 'Sending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
            <Send className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Sending
          </span>
        );
      case 'Queued':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Queued
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Draft
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Failed
          </span>
        );
    }
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No campaigns found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Get started by creating your very first email campaign and reach your audience.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-6">Campaign Title</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Recipients</th>
              <th className="py-4 px-6">Open Rate</th>
              <th className="py-4 px-6">Created</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {campaigns.map((campaign) => {
              const progressPercentage = campaign.recipientsCount > 0 
                ? Math.round((campaign.sentCount / campaign.recipientsCount) * 100) 
                : 0;

              return (
                <tr key={campaign.id} className="group hover:bg-slate-50/80 transition-all duration-150">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {campaign.title}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                      {campaign.subject}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    {getStatusBadge(campaign.status)}
                  </td>
                  
                  <td className="py-4 px-6">
                 <div className="flex items-center gap-2">
  <span className="font-semibold text-slate-900">
    {campaign.sentCount.toLocaleString()}
  </span>

  <span className="text-xs text-slate-400">
    / {campaign.recipientsCount.toLocaleString()}
  </span>

  {campaign.status === "Sending" && (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 animate-pulse">
      Processing...
    </span>
  )}
</div>
                    {/* Optional miniature progress bar */}
                   <div className="flex items-center gap-2 mt-1.5">
  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-indigo-500 rounded-full transition-all duration-[2500ms] ease-out"
      style={{ width: `${progressPercentage}%` }}
    />
  </div>

  <span className="text-[10px] font-semibold text-slate-500 min-w-[32px]">
    {progressPercentage}%
  </span>
</div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-semibold rounded-md text-xs">
                      {campaign.openRate}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-xs text-slate-400 font-medium">
                    {campaign.createdAt}
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => onAction && onAction(campaign.id)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Duplicate or Send"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete && onDelete(campaign.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}