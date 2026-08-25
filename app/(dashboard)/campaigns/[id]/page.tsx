import DashboardLayout from "@/components/layout/DashboardLayout";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import { ArrowLeft, Mail, Clock, Send, User, CheckCircle2, Globe, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  const campaign = await Campaign.findById(id).lean();

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-12 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Campaign Not Found</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              The campaign you are looking for doesn't exist or has been removed.
            </p>
            <div className="pt-2">
              <Link href="/campaigns">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">

        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between">
          <Link href="/campaigns">
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase flex items-center gap-1.5 ${
              campaign.status === "sent"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                : "bg-amber-50 text-amber-700 border border-amber-200/50"
            }`}
          >
            {campaign.status === "sent" ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {campaign.status}
          </span>
        </div>

        {/* Main Campaign Overview Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Campaign Title & Subject
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {campaign.title}
            </h1>
            <p className="text-base font-normal text-slate-600">
              {campaign.subject}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                Sender Email
              </div>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {campaign.senderEmail}
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <Send className="w-3.5 h-3.5" />
                Total Emails Sent
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {campaign.sentCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Email Content Preview Section */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg shadow-inner">
                <Mail className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Email Content Preview
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">HTML Rendered View</span>
          </div>

          <div className="bg-slate-50/30 border border-slate-100 rounded-xl p-6 overflow-hidden">
            <div
              className="prose max-w-none text-slate-800"
              dangerouslySetInnerHTML={{
                __html: campaign.content,
              }}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}