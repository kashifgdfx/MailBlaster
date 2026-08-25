"use client";

import React, { useState, useEffect } from "react";
import CampaignForm from "./CampaignForm";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Eye, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import JodEditor from "@/components/JodEditor"; // Apne path ke hisaab se import check kar lein

export default function CampaignWizard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [campaignData, setCampaignData] = useState<any>({
    title: "",
    subject: "",
    senderName: "",
    senderEmail: "",
    targetSegment: "",
  });

  const [emailHtml, setEmailHtml] = useState("");
  const [templates, setTemplates] = useState<{ _id: string; title: string; content: string }[]>([]);
  
  // Preview Mode toggle state
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleFormSubmit = (data: any) => {
    setCampaignData(data);
    setCurrentStep(2);
  };

  const handleLaunch = async () => {
    try {
      setLoading(true);

      const createRes = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...campaignData,
          content: emailHtml,
        }),
      });

      const campaign = await createRes.json();

      if (!createRes.ok) {
        throw new Error(campaign.error || "Campaign creation failed");
      }

      const sendRes = await fetch(`/api/campaigns/send/${campaign._id}`, {
        method: "POST",
      });

      const sendData = await sendRes.json();

      if (!sendRes.ok) {
        throw new Error(sendData.error || "Email sending failed");
      }

      alert(`Campaign Sent Successfully 🚀\nEmails Sent: ${sendData.sentCount}`);

      router.push("/campaigns");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Details & Audience" },
    { number: 2, label: "Design & Content" },
    { number: 3, label: "Review & Send" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep > step.number
                  ? "bg-emerald-600 text-white"
                  : currentStep === step.number
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {currentStep > step.number ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <CampaignForm onSubmit={handleFormSubmit} />
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                Design Email Content
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Type directly in the editor below or choose an optional template.
              </p>
            </div>
            
            {/* Preview Template Toggle Button */}
            <Button
              variant="outline"
              
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 text-xs"
            >
              {isPreviewMode ? (
                <>
                  <Edit3 className="w-4 h-4" /> Back to Editor
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> Preview Template
                </>
              )}
            </Button>
          </div>

          {templates.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Optional Template Selector
              </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  const tpl = templates.find((t) => t._id === e.target.value);
                  if (tpl) setEmailHtml(tpl.content);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="" disabled>— Select a template or write your own content below —</option>
                {templates.map((t) => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional View: Jodit Editor vs Live HTML Preview */}
          {isPreviewMode ? (
            <div className="w-full min-h-[350px] border border-slate-300 rounded-lg p-6 bg-slate-50 text-slate-800 overflow-auto shadow-inner">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                <span>Live Email Output Preview</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Active Rendering</span>
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: emailHtml || "<p class='text-slate-400'>No content available to preview yet. Start typing in the editor!</p>" }} 
              />
            </div>
          ) : (
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
              <JodEditor
                value={emailHtml}
                onChange={(newContent: string) => setEmailHtml(newContent)}
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>

            <Button
              onClick={() => setCurrentStep(3)}
            >
              Review Campaign
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">
            Review Campaign
          </h3>

          <div className="space-y-2 text-sm text-slate-700">
            <p><strong>Title:</strong> {campaignData.title}</p>
            <p><strong>Subject:</strong> {campaignData.subject}</p>
            <p><strong>Sender:</strong> {campaignData.senderEmail}</p>
            <p><strong>Segment:</strong> {campaignData.targetSegment}</p>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>

            <Button
              onClick={handleLaunch}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Saving..." : "Create Campaign 🚀"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}