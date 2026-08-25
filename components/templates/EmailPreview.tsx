"use client";

interface EmailPreviewProps {
  content: string;
}

const SAMPLE_VARS: Record<string, string> = {
  name: "John Doe",
  email: "john@example.com",
};

function applyVars(html: string) {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) => SAMPLE_VARS[key] ?? `{{${key}}}`);
}

export default function EmailPreview({ content }: EmailPreviewProps) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
        Live Preview
      </div>
      <iframe
        srcDoc={applyVars(content) || "<p style='color:#94a3b8;padding:20px'>Start typing to see preview...</p>"}
        className="w-full h-64"
        sandbox="allow-same-origin"
        title="Email Preview"
      />
    </div>
  );
}
