"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import TemplateCard from "@/components/templates/TemplateCard";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";

interface Template {
  _id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((t) => t._id !== id));
      toast.success("Template Deleted", { description: "Template permanently deleted" });
    } catch {
      toast.error("Operation Failed", { description: "Failed to delete template." });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Email Templates</h1>
            <p className="text-sm text-slate-500 mt-1">Design and manage reusable templates for your campaigns.</p>
          </div>
          <Link href="/templates/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Template
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500 py-12 text-center">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 bg-slate-100 rounded-full">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-700 font-semibold">No templates yet</p>
              <p className="text-sm text-slate-500 mt-1">Create your first email template to get started.</p>
            </div>
            <Link href="/templates/create">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Template
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template._id} template={template} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
