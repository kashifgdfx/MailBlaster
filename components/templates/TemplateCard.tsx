"use client";

import { LayoutTemplate, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

interface Template {
  _id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}

interface TemplateCardProps {
  template: Template;
  onDelete: (id: string) => void;
}

export default function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const previewText = template.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
  const updatedDate = new Date(template.updatedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const handleDelete = () => {
    if (confirm("Delete this template?")) onDelete(template._id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutTemplate className="w-5 h-5" />
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
            {template.category}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-900">{template.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-3 rounded-lg font-mono">
          {previewText || "No preview available"}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100 text-xs text-slate-500">
        <span>Updated {updatedDate}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete template"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            href={`/templates/${template._id}`}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
          >
            Edit Template <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
