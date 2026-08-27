"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function ImportContactsPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      toast.error("Import Failed", { description: "Please select a CSV file first" });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/contacts/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }

      setMessage(
        `Successfully imported ${data.imported} contacts`
      );
      toast.success("Contacts Imported", { description: `Successfully imported ${data.imported} contacts` });

      setTimeout(() => {
        router.push("/contacts");
        router.refresh();
      }, 1500);
    } catch (error: unknown) {
      toast.error("Import Failed", { description: error instanceof Error ? error.message : "Import failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/contacts"
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Import Contacts (CSV)
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Upload a CSV file containing your subscriber records.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <label className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-blue-500 transition-colors bg-slate-50/50 cursor-pointer block">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Click to upload CSV file
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              CSV format with columns: name,email
            </p>

            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </label>

          {/* Selected File */}
          {file && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* CSV Rules */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                CSV Requirements Checklist:
              </p>

              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>
                  Must include{" "}
                  <code className="text-blue-600 font-mono">
                    name
                  </code>{" "}
                  column
                </li>

                <li>
                  Must include{" "}
                  <code className="text-blue-600 font-mono">
                    email
                  </code>{" "}
                  column
                </li>

                <li>
                  Maximum file size: 25MB
                </li>

                <li>
                  Duplicate emails will be skipped
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/contacts">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>

            <Button
              onClick={handleUpload}
              disabled={loading}
            >
              {loading
                ? "Importing..."
                : "Upload & Import Contacts"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
