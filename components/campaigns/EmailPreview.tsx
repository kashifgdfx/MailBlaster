"use client";

import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface EmailPreviewProps {
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  htmlContent?: string;
}

export default function EmailPreview({
  subject = 'Welcome to EmailBlaster Pro!',
  senderName = 'Admin',
  senderEmail = 'admin@emailblaster.com',
  htmlContent = '<h1 style="color: #2563eb;">Hello Subscriber,</h1><p>This is a live test preview of your bulk broadcast content layout.</p>',
}: EmailPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Preview Header controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview Container</span>
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-1 text-xs text-slate-600">
        <p><strong>From:</strong> {senderName} &lt;{senderEmail}&gt;</p>
        <p><strong>Subject:</strong> {subject}</p>
      </div>

      {/* Frame Rendering Wrapper */}
      <div className="flex-1 p-6 flex items-center justify-center bg-slate-100/50 overflow-y-auto">
        <div
          className={`bg-white rounded-lg border border-slate-200 shadow-md transition-all duration-300 ${
            device === 'mobile' ? 'w-[375px] h-[600px]' : 'w-full max-w-2xl min-h-[400px]'
          } overflow-hidden`}
        >
          <div className="p-6 prose max-w-none text-slate-800 text-sm" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}