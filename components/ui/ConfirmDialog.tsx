"use client";

import { useEffect, useId, useRef } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmText, cancelText, destructive = false, onConfirm, loading = false }: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, onOpenChange, open]);

  if (!open) return null;
  const close = () => { if (!loading) onOpenChange(false); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" />
      <section aria-describedby={descriptionId} aria-labelledby={titleId} aria-modal="true" className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20" role="alertdialog">
        <div className="flex gap-4">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${destructive ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}><TriangleAlert className="size-5" aria-hidden="true" /></div>
          <div className="space-y-1.5"><h2 id={titleId} className="text-lg font-semibold text-slate-900">{title}</h2><p id={descriptionId} className="text-sm leading-6 text-slate-500">{description}</p></div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelButtonRef} type="button" disabled={loading} onClick={close} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">{cancelText}</button>
          <button type="button" disabled={loading} onClick={() => void onConfirm()} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${destructive ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-slate-800"}`}>{loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{loading ? "Processing..." : confirmText}</button>
        </div>
      </section>
    </div>
  );
}
