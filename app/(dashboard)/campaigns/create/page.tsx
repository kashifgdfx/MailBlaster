import DashboardLayout from "@/components/layout/DashboardLayout";
import CampaignWizard from "@/components/campaigns/CampaignWizard";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

function CreateCampaignPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Top Header with Back Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href="/campaigns"
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Create New Campaign
                </h1>
              </div>
              <p className="text-sm text-slate-500 font-normal">
                Configure, design, and launch your bulk outreach campaign with precision.
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Component Integration */}
        <CampaignWizard />
      </div>
    </DashboardLayout>
  );
}

export default CreateCampaignPage;