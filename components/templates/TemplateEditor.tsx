"use client";

import { Code } from "lucide-react";
import EmailPreview from "./EmailPreview";

interface TemplateEditorProps {
  title: string;
  category: string;
  content: string;
  onChange: (field: "title" | "category" | "content", value: string) => void;
  errors?: { title?: string; content?: string };
}

export default function TemplateEditor({ title, category, content, onChange, errors }: TemplateEditorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Template Name</label>
        <input
          type="text"
          placeholder="e.g., Monthly Product Showcase"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 ${errors?.title ? "border-red-400" : "border-slate-300"}`}
        />
        {errors?.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Category</label>
        <select
          value={category}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        >
          <option value="marketing">Marketing & Announcements</option>
          <option value="newsletter">Weekly Newsletter</option>
          <option value="promotional">Promotional Offer</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">HTML Source Code</label>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Code className="w-3.5 h-3.5" /> Supports {"{{"} name {"}}"}
          </span>
        </div>
        <textarea
          rows={14}
          value={content}
          onChange={(e) => onChange("content", e.target.value)}
          className={`w-full font-mono text-xs p-4 rounded-lg border bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors?.content ? "border-red-400" : "border-slate-300"}`}
        />
        {errors?.content && <p className="text-xs text-red-500">{errors.content}</p>}
      </div>

      <EmailPreview content={content} />
    </div>
  );
}
