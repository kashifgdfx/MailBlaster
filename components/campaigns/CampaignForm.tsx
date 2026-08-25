"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Type, Mail, User, AtSign, Users, ArrowRight, Loader2 } from "lucide-react";

export default function CampaignForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [totalContacts, setTotalContacts] = useState<number | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    senderName: "",
    senderEmail: "",
    targetSegment: "all",
  });

  useEffect(() => {
    loadContacts();
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setFormData((prev) => ({
          ...prev,
          senderName: data.senderName || "",
          senderEmail: data.senderEmail || "",
        }));
      })
      .catch(console.error);
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTotalContacts(data.length);
      }
    } catch (error) {
      console.error(error);
      setTotalContacts(0);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden max-w-7xl"
    >
      {/* Form Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Campaign Details
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your sender details, subject line, and target audience.
        </p>
      </div>

      {/* Form Fields */}
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Campaign Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Campaign Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Type className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Summer Product Launch 2026"
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Internal name used for your dashboard list.
            </p>
          </div>

          {/* Email Subject */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Subject Line
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="subject"
                required
                placeholder="e.g., Discover what's new in our latest release 🚀"
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Sender Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Sender Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Sender Email */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Sender Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Target Segment */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Target Contact Segment
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </span>
              <select
                name="targetSegment"
                value={formData.targetSegment}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs appearance-none cursor-pointer"
              >
                <option value="all">
                  All Contacts ({isLoadingContacts ? "..." : totalContacts ?? 0})
                </option>
                <option value="general">General Contacts</option>
                <option value="newsletter">Newsletter Subscribers</option>
                <option value="customers">Verified Customers</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 bg-slate-50/75 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Step <span className="font-semibold text-slate-700">1</span> of 2
        </span>
        <Button 
          type="submit" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
        >
          Continue To Editor
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}