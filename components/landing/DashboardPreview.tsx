"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, BarChart3, Users, Mail, TrendingUp, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="relative bg-white py-24 sm:py-32 overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Left Aligned & Premium) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100 mb-4">
              See EmailBlaster In Action
            </h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Manage campaigns, contacts, analytics and email performance <span className="text-blue-600">from one dashboard.</span>
            </p>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end">
            <p className="text-gray-600 text-base mb-6 max-w-md">
              Everything built for high deliverability and scale. Control your sequences with live data feeds and automated lead filtering.
            </p>
            <Link 
              href="/#" 
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup / Image Section Container */}
        <div className="relative mx-auto max-w-7xl rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-gray-100 to-gray-200/60 ring-1 ring-inset ring-gray-900/10 shadow-2xl">
          <div className="rounded-2xl bg-gray-950 overflow-hidden shadow-2xl border border-gray-800">
            
            {/* Window Top Bar (Mac style dots + URL bar) */}
            <div className="px-4 py-3 bg-gray-900 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs font-mono text-gray-400 bg-gray-950 px-4 py-1 rounded-md border border-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                app.blastervavmail.io/dashboard/overview
              </div>
              <div className="text-xs text-gray-500 font-medium hidden sm:block">v2.4 Pro</div>
            </div>

            {/* Dashboard Mockup Inner Layout */}
            <div className="p-6 sm:p-10 text-white space-y-8">
              
              {/* Top Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900/90 p-5 rounded-2xl border border-gray-800/80 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                    <span>Total Sent Emails</span>
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">48,250</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+14.2% from last week</span>
                  </div>
                </div>

                <div className="bg-gray-900/90 p-5 rounded-2xl border border-gray-800/80 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                    <span>Average Open Rate</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">72.6%</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+5.1% optimized</span>
                  </div>
                </div>

                <div className="bg-gray-900/90 p-5 rounded-2xl border border-gray-800/80 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                    <span>Active Lead Lists</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">14,890</div>
                  <div className="mt-2 text-xs text-gray-400 font-medium">Verified & clean status</div>
                </div>

                <div className="bg-gray-900/90 p-5 rounded-2xl border border-gray-800/80 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                    <span>Spam / Bounce Ratio</span>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">0.2%</div>
                  <div className="mt-2 text-xs text-emerald-400 font-medium">Safe server health</div>
                </div>
              </div>

              {/* Middle Section: Visual Analytics & Active Campaign Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Graph Box */}
                <div className="lg:col-span-2 bg-gray-900/60 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Campaign Engagement Performance</h4>
                      <p className="text-xs text-gray-400">Real-time open & reply ratios across active sequences</p>
                    </div>
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">Live Feed</span>
                  </div>
                  
                  {/* Simulated Bar Graph Visual */}
                  <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-gray-800">
                    {[40, 65, 30, 85, 55, 95, 70, 90, 60, 75, 88, 100].map((height, i) => (
                      <div key={i} className="w-full bg-gray-800 rounded-t-lg overflow-hidden h-full flex items-end">
                        <div 
                          style={{ height: `${height}%` }} 
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg hover:bg-blue-400 transition-all duration-300"
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 pt-2 font-mono">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                {/* Side Quick Actions / Live Campaign Status */}
                <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-white">Active Automation</h4>
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/80">
                      <p className="text-xs font-semibold text-blue-400 mb-1">Sequence #4 - SaaS Founders</p>
                      <p className="text-xs text-gray-300">Dispatching batch 3 of 5 with smart throttling...</p>
                      <div className="mt-3 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[78%] rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 flex items-center justify-between pt-2 border-t border-gray-800">
                    <span>Server Status</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Operational
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Feature Checkmarks Row (Clean Badges) */}
        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-gray-700 font-medium">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm">Campaign Management</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm">Open Tracking</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm">Bounce Monitoring</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm">Contact Lists</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm">Analytics Reports</span>
          </div>
        </div>

      </div>
    </section>
  );
}