"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Send, Mail, CheckCircle, ArrowUpRight, Trash2, Archive } from "lucide-react";

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sendingId, setSendingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setCampaigns(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm("Are you sure you want to archive this campaign? Historical analytics will remain available.")) return;
    try {
      setDeletingId(campaignId);
      const res = await fetch(`/api/campaigns/${campaignId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to archive campaign");
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
      router.push("/campaigns/archived");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to archive campaign");
    } finally {
      setDeletingId("");
    }
  };

  const handleSend = async (campaignId: string) => {
    try {
      setSendingId(campaignId);

      const res = await fetch(
        `/api/campaigns/send/${campaignId}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      alert(
        `Campaign Sent Successfully\n\nEmails Sent: ${data.sentCount}`
      );

      fetchCampaigns();
    } catch (err: any) {
      alert(err.message || "Failed to send campaign");
    } finally {
      setSendingId("");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-xl border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg shadow-inner">
                <Mail className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Email Campaigns
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-normal">
              Design, target, and broadcast luxury outreach campaigns seamlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/campaigns/archived">
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                <Archive className="w-4 h-4 mr-2" />
                Archived Campaigns
              </Button>
            </Link>
            <Link href="/campaigns/create">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-slate-800">No campaigns found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Get started by creating your first high-converting broadcast campaign.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign: any) => (
              <div
                key={campaign._id}
                className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-normal">
                      {campaign.subject}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase ${
                      campaign.isDeleted
                        ? "bg-slate-100 text-slate-600 border border-slate-200"
                        : campaign.status === "sent"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          : "bg-amber-50 text-amber-700 border border-amber-200/50"
                    }`}
                  >
                    {campaign.isDeleted ? "Archived" : campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Sender
                    </p>
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {campaign.senderEmail}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Segment
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {campaign.targetSegment}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Emails Sent
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {campaign.sentCount || 0}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(
                        campaign.createdAt
                      ).toLocaleDateString()}
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
                    onClick={() => handleDelete(campaign._id)}
                    disabled={deletingId === campaign._id}
                    variant="outline"
                    className="border-rose-200 hover:bg-rose-50 text-rose-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletingId === campaign._id ? "Archiving..." : "Archive"}
                  </Button>

                  {campaign.status !== "sent" ? (
                    <Button
                      onClick={() =>
                        handleSend(campaign._id)
                      }
                      disabled={
                        sendingId === campaign._id
                      }
                      className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendingId === campaign._id
                        ? "Sending..."
                        : "Send Campaign"}
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="bg-emerald-600/90 text-white opacity-15 cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-white" />
                      Sent
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}