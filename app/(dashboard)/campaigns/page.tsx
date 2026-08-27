"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowUpRight, CheckCircle, Mail, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Campaign = { 
  _id: string; 
  title: string; 
  subject: string; 
  senderEmail: string; 
  targetSegment: string; 
  sentCount?: number; 
  createdAt: string; 
  isDeleted?: boolean; 
  status: string 
};

type PendingAction = { 
  id: string; 
  kind: "archive" | "delete" | "send" 
} | null;

const message = (error: unknown, fallback: string) => 
  error instanceof Error ? error.message : fallback;

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sendingId, setSendingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const fetchCampaigns = async () => { 
    try { 
      const response = await fetch("/api/campaigns", { cache: "no-store" }); 
      const data: unknown = await response.json(); 
      if (Array.isArray(data)) setCampaigns(data as Campaign[]); 
    } catch (error) { 
      console.error(error); 
    } 
  };

  useEffect(() => { 
    void fetchCampaigns(); 
  }, []);

  const archiveCampaign = async (id: string) => { 
    try { 
      setDeletingId(id); 
      const response = await fetch(`/api/campaigns/${id}`, { method: "DELETE" }); 
      const data = await response.json(); 
      if (!response.ok) throw new Error(data.error || "Failed to archive campaign"); 
      setCampaigns((current) => current.filter((campaign) => campaign._id !== id)); 
      toast.success("Campaign Archived", { description: "Campaign moved to archived campaigns" }); 
      setPendingAction(null); 
      router.push("/campaigns/archived"); 
      router.refresh(); 
    } catch (error) { 
      toast.error("Operation Failed", { description: message(error, "Failed to archive campaign") }); 
    } finally { 
      setDeletingId(""); 
    } 
  };

  const deleteCampaign = async (id: string) => { 
    try { 
      setDeletingId(id); 
      const response = await fetch(`/api/campaigns/${id}?permanent=true`, { method: "DELETE" }); 
      const data = await response.json(); 
      if (!response.ok) throw new Error(data.error || "Failed to delete campaign"); 
      setCampaigns((current) => current.filter((campaign) => campaign._id !== id)); 
      toast.success("Campaign Deleted", { description: "Campaign permanently deleted" }); 
      setPendingAction(null); 
    } catch (error) { 
      toast.error("Operation Failed", { description: message(error, "Failed to delete campaign") }); 
    } finally { 
      setDeletingId(""); 
    } 
  };

  const sendCampaign = async (id: string) => { 
    try { 
      setSendingId(id); 
      const response = await fetch(`/api/campaigns/send/${id}`, { method: "POST" }); 
      const data = await response.json(); 
      if (!response.ok) throw new Error(data.error || "Failed to send campaign"); 
      toast.success("Campaign Sent", { description: `${data.sentCount} emails sent successfully` }); 
      setPendingAction(null); 
      await fetchCampaigns(); 
    } catch (error) { 
      toast.error("Operation Failed", { description: message(error, "Failed to send campaign") }); 
    } finally { 
      setSendingId(""); 
    } 
  };

  const dialog = pendingAction && ({ 
    archive: ["Archive campaign?", "Historical analytics will remain available in archived campaigns.", "Archive campaign", false], 
    delete: ["Delete campaign permanently?", "This will permanently delete the campaign and all analytics. This cannot be undone.", "Delete permanently", true], 
    send: ["Send campaign?", "This campaign will be delivered to its selected audience.", "Send campaign", false] 
  } as const)[pendingAction.kind];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/65 backdrop-blur-xl border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900">Email Campaigns</h1>
            </div>
            <p className="text-sm text-slate-500">Design, target, and broadcast outreach campaigns.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/campaigns/archived">
              <Button variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Archived Campaigns
              </Button>
            </Link>
            <Link href="/campaigns/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <Mail className="w-6 h-6 mx-auto text-slate-400" />
            <h3 className="mt-3 font-medium">No campaigns found</h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{campaign.title}</h3>
                    <p className="text-sm text-slate-500">{campaign.subject}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium uppercase bg-slate-100 text-slate-600">
                    {campaign.isDeleted ? "Archived" : campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                  {[
                    ["Sender", campaign.senderEmail], 
                    ["Segment", campaign.targetSegment], 
                    ["Emails Sent", campaign.sentCount || 0], 
                    ["Created", new Date(campaign.createdAt).toLocaleDateString()]
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <p className="text-xs font-medium text-slate-400 uppercase">{label}</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3 pt-4">
                  <Link href={`/campaigns/${campaign._id}`}>
                    <Button variant="outline">
                      View <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>

                  <Button 
                    onClick={() => setPendingAction({ id: campaign._id, kind: "archive" })} 
                    disabled={Boolean(deletingId)} 
                    variant="outline" 
                    className="border-rose-200 text-rose-600"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>

                  <Button 
                    onClick={() => setPendingAction({ id: campaign._id, kind: "delete" })} 
                    disabled={Boolean(deletingId)} 
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>

                  {campaign.status !== "sent" ? (
                    <Button 
                      onClick={() => setPendingAction({ id: campaign._id, kind: "send" })} 
                      disabled={Boolean(sendingId)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendingId === campaign._id ? "Sending..." : "Send Campaign"}
                    </Button>
                  ) : (
                    <Button disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sent
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        {pendingAction && dialog && (
          <ConfirmDialog 
            open 
            onOpenChange={(open) => { 
              if (!open) setPendingAction(null); 
            }} 
            title={dialog[0]} 
            description={dialog[1]} 
            confirmText={dialog[2]} 
            cancelText="Cancel" 
            destructive={dialog[3]} 
            loading={sendingId === pendingAction.id || deletingId === pendingAction.id} 
            onConfirm={() => 
              pendingAction.kind === "archive" 
                ? archiveCampaign(pendingAction.id) 
                : pendingAction.kind === "delete" 
                  ? deleteCampaign(pendingAction.id) 
                  : sendCampaign(pendingAction.id)
            } 
          />
        )}
      </div>
    </DashboardLayout>
  );
}