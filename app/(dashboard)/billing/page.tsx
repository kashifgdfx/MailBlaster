"use client";

import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CreditCard, Zap, CheckCircle, Download, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function BillingPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Pro Unlimited');

  const handleUpgrade = (planName: string) => {
    setIsUpgrading(true);
    setTimeout(() => {
      setCurrentPlan(planName);
      setIsUpgrading(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
    }, 1000);
  };

  const invoices = [
    { id: 'INV-2026-08', date: 'Aug 01, 2026', amount: '$49.00', status: 'Paid', plan: 'Pro Unlimited' },
    { id: 'INV-2026-07', date: 'Jul 01, 2026', amount: '$49.00', status: 'Paid', plan: 'Pro Unlimited' },
    { id: 'INV-2026-06', date: 'Jun 01, 2026', amount: '$29.00', status: 'Paid', plan: 'Growth Starter' },
  ];

  const plans = [
    {
      name: 'Growth Starter',
      price: '$29',
      period: '/month',
      description: 'Ideal for small businesses starting with automated bulk messaging.',
      features: ['Up to 25,000 emails/mo', 'Standard SMTP Relay', 'Basic Analytics', 'Email Support'],
      popular: false,
    },
    {
      name: 'Pro Unlimited',
      price: '$49',
      period: '/month',
      description: 'Built for high-throughput campaigns and advanced analytics tracking.',
      features: ['Up to 150,000 emails/mo', 'Dedicated IP Warmup', 'Real-time Open/Click Charts', 'Priority 24/7 Support'],
      popular: true,
    },
    {
      name: 'Enterprise Scale',
      price: '$199',
      period: '/month',
      description: 'Custom infrastructure for large enterprises needing maximum velocity.',
      features: ['Unlimited Email Dispatches', 'Multiple SMTP Rotations', 'Advanced Webhook API', 'Dedicated Account Manager'],
      popular: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Billing & Subscription</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your platform plan, credit quota, payment methods, and download past invoices.</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Subscription updated successfully to <strong>{currentPlan}</strong>!</span>
          </div>
        )}

        {/* Current Plan & Usage Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Subscription Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">Active Plan</span>
                <span className="text-xs text-slate-400 font-medium">Renews Sep 01, 2026</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{currentPlan}</h3>
              <p className="text-xs text-slate-500">High-throughput bulk dispatch with advanced SMTP routing.</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">$49.00 <span className="text-xs font-normal text-slate-500">/mo</span></span>
              <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active
              </span>
            </div>
          </div>

          {/* Quota Usage Meter */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Monthly Email Dispatch Quota</h3>
                <p className="text-xs text-slate-500">Reset cycle begins on the 1st of every month.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">84,520 / 150,000 Used</span>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: '56%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>56% Utilized</span>
                <span>65,480 credits remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans Grid */}
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Available Plans</h2>
            <p className="text-xs text-slate-500">Scale up or down anytime based on your campaign frequency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isCurrent = currentPlan === plan.name;
              return (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between space-y-6 relative ${
                    plan.popular ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-500">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                    
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Button
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={isCurrent || isUpgrading}
                      className={`w-full flex items-center justify-center gap-2 text-xs font-semibold ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
                          : plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : <><Zap className="w-3.5 h-3.5" /> Upgrade Plan</>}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice History Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Billing & Invoice History</h3>
              <p className="text-xs text-slate-500">Download past payment receipts for your accounting records.</p>
            </div>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-slate-400" /> Visa ending in •••• 4821
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Invoice ID</th>
                  <th className="pb-3">Billing Date</th>
                  <th className="pb-3">Plan Tier</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-medium text-slate-800">{inv.id}</td>
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3 font-semibold text-slate-700">{inv.plan}</td>
                    <td className="py-3 font-bold text-slate-900">{inv.amount}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800">
                        Download <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}