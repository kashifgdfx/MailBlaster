"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import TemplateEditor from "@/components/templates/TemplateEditor";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function EditTemplatePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const [formData, setFormData] = useState({
    title: "",
    category: "marketing",
    content: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/templates/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setFormData({ title: data.title, category: data.category, content: data.content });
      } catch {
        alert("Failed to load template.");
        router.push("/templates");
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [id]);

  const validate = () => {
    const e: { title?: string; content?: string } = {};
    if (!formData.title.trim()) e.title = "Template name is required.";
    if (!formData.content.trim()) e.content = "Content is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: "title" | "category" | "content", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update template");
      }
      setSuccessMsg(true);
      setTimeout(() => router.push("/templates"), 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Edit Template</h1>
              <p className="text-sm text-slate-500 mt-0.5">Update your template layout and content.</p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Template updated successfully! Redirecting...</span>
          </div>
        )}

        {isFetching ? (
          <div className="text-sm text-slate-500 py-12 text-center">Loading template...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <TemplateEditor
              title={formData.title}
              category={formData.category}
              content={formData.content}
              onChange={handleChange}
              errors={errors}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Link href="/templates">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Update Template
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
