"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Archive, ArrowLeft, ArrowUpRight } from "lucide-react";

type Campaign = {
  _id: string;
  title: string;
  subject: string;
  senderEmail: string;
  targetSegment: string;
  sentCount?: number;
  createdAt: string;
  isDeleted?: boolean;
};

export default function ArchivedCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchArchivedCampaigns = async () => {
      try {
        const response = await fetch("/api/campaigns?archived=true", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch archived campaigns");
        }

        if (Array.isArray(data)) {
          setCampaigns(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchArchivedCampaigns();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-xl border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-700 text-white rounded-lg shadow-inner">
                <Archive className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Archived Campaigns
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-normal">
              View historical campaigns and their preserved performance data.
            </p>
          </div>

          <Link href="/campaigns">
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Active Campaigns
            </Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Archive className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-slate-800">No archived campaigns</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Archived campaigns will appear here while their analytics remain available.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-normal">
                      {campaign.subject}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                    Archived
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Sender</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{campaign.senderEmail}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Segment</p>
                    <p className="text-sm font-medium text-slate-700">{campaign.targetSegment}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Emails Sent</p>
                    <p className="text-sm font-medium text-slate-700">{campaign.sentCount || 0}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Created</p>
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-4">
                  <Link href={`/campaigns/${campaign._id}`}>
                    <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                      View
                      <ArrowUpRight className="w-4 h-4 ml-1.5 text-slate-400" />
                    </Button>
                  </Link>
                  <Button
                    disabled
                    variant="outline"
                    className="border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archived
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
