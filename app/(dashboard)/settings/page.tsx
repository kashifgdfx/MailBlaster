"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Settings, Server, User, Lock, CheckCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'smtp' | 'profile' | 'security'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states
  const [generalData, setGeneralData] = useState({
    appName: '',
    supportEmail: '',
    timezone: 'Asia/Kolkata (IST)',
    maxBatchSize: '500',
  });

  const [smtpData, setSmtpData] = useState({
    host: 'smtp.sendgrid.net',
    port: '587',
    username: 'apikey',
    encryption: 'TLS',
  });

  const [profileData, setProfileData] = useState({
    senderName: '',
    senderEmail: '',
    replyTo: '',
  });

  const [securityData, setSecurityData] = useState({
    apiKey: 'eb_live_99f83a71b2904c81e92d8371',
    webhookUrl: 'https://api.yourdomain.com/v1/webhooks/deliveries',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setGeneralData((prev) => ({
          ...prev,
          appName: data.companyName || '',
          supportEmail: data.companyEmail || '',
        }));
        setProfileData((prev) => ({
          ...prev,
          senderName: data.senderName || '',
          senderEmail: data.senderEmail || '',
          replyTo: data.replyTo || '',
        }));
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: generalData.appName,
          companyEmail: generalData.supportEmail,
          senderName: profileData.senderName,
          senderEmail: profileData.senderEmail,
          replyTo: profileData.replyTo,
        }),
      });
      const saved = await res.json();
      if (saved) {
        setGeneralData((prev) => ({
          ...prev,
          appName: saved.companyName || '',
          supportEmail: saved.companyEmail || '',
        }));
        setProfileData((prev) => ({
          ...prev,
          senderName: saved.senderName || '',
          senderEmail: saved.senderEmail || '',
          replyTo: saved.replyTo || '',
        }));
      }
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure global application parameters, SMTP relays, and security credentials.</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Settings updated successfully! Changes saved across the platform.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation Sidebar */}
          <div className="space-y-1 md:col-span-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'general' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" /> General
            </button>
            <button
              onClick={() => setActiveTab('smtp')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'smtp' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Server className="w-4 h-4" /> SMTP & Relay
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <User className="w-4 h-4" /> Sender Identity
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'security' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" /> API & Security
            </button>
          </div>

          {/* Active Settings Panel Content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">General Application Settings</h3>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Platform Instance Name</label>
                    <input
                      type="text"
                      value={generalData.appName}
                      onChange={(e) => setGeneralData({ ...generalData, appName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">System Support Email</label>
                    <input
                      type="email"
                      value={generalData.supportEmail}
                      onChange={(e) => setGeneralData({ ...generalData, supportEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Default Dispatch Timezone</label>
                    <select
                      value={generalData.timezone}
                      onChange={(e) => setGeneralData({ ...generalData, timezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    >
                      <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SMTP Tab */}
              {activeTab === 'smtp' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">SMTP Mail Relay Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">SMTP Host</label>
                      <input
                        type="text"
                        value={smtpData.host}
                        onChange={(e) => setSmtpData({ ...smtpData, host: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">Port Number</label>
                      <input
                        type="text"
                        value={smtpData.port}
                        onChange={(e) => setSmtpData({ ...smtpData, port: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">SMTP Username</label>
                    <input
                      type="text"
                      value={smtpData.username}
                      onChange={(e) => setSmtpData({ ...smtpData, username: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Encryption Protocol</label>
                    <select
                      value={smtpData.encryption}
                      onChange={(e) => setSmtpData({ ...smtpData, encryption: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    >
                      <option value="TLS">TLS (Recommended)</option>
                      <option value="SSL">SSL</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Sender Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Default Sender Identity</h3>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Default Sender Name</label>
                    <input
                      type="text"
                      value={profileData.senderName}
                      onChange={(e) => setProfileData({ ...profileData, senderName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Default From Email</label>
                    <input
                      type="email"
                      value={profileData.senderEmail}
                      onChange={(e) => setProfileData({ ...profileData, senderEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Reply-To Address</label>
                    <input
                      type="email"
                      value={profileData.replyTo}
                      onChange={(e) => setProfileData({ ...profileData, replyTo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">API Credentials & Webhooks</h3>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Live API Key</label>
                    <input
                      type="password"
                      readOnly
                      value={securityData.apiKey}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 font-mono text-xs text-slate-600 focus:outline-none"
                    />
                    <p className="text-xs text-slate-400 mt-1">Keep this key secret. Do not expose it in client-side scripts.</p>
                  </div>
                  <div className="space-y-1 pt-2">
                    <label className="block text-sm font-medium text-slate-700">Webhook Endpoint URL</label>
                    <input
                      type="text"
                      value={securityData.webhookUrl}
                      onChange={(e) => setSecurityData({ ...securityData, webhookUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Save Button Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}