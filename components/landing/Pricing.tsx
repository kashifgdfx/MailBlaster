"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, ShieldAlert } from 'lucide-react';

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState<'growth' | 'starter'>('growth');

  return (
    <section id="pricing" className="relative bg-gray-950 text-white py-28 sm:py-36 overflow-hidden border-t border-gray-800/80">
      
      {/* Background Soft Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unique Asymmetric Grid Layout (Left: Info & Perks, Right: Free Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & Trust Badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Early Access Beta Program
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Scale Your Outreach. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Completely Free.
              </span>
            </h2>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              We believe powerful cold email infrastructure should be accessible to every founder and agency. Enjoy 100% full access to all features with zero hidden fees during our public beta.
            </p>

            {/* Perks list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>No credit card required ever</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Instant activation upon signup</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Free updates and premium server routes</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 text-xs text-gray-500">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>Limited slots available for the current beta batch.</span>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Pricing Card */}
          <div className="lg:col-span-7">
            <div className="relative bg-gray-900/90 rounded-3xl p-8 sm:p-10 border border-gray-800 shadow-2xl backdrop-blur-xl ring-1 ring-blue-500/20">
              
              {/* Card Top Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                <div>
                  <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">Founder's Pass</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Unlimited Beta License</h3>
                </div>
                <div className="text-right">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-gray-400 block mt-0.5">Forever Free</span>
                </div>
              </div>

              {/* Features checklist inside card */}
              <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Unlimited Sends</h4>
                    <p className="text-xs text-gray-400">High-volume dispatching</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Smart Automation</h4>
                    <p className="text-xs text-gray-400">Drip campaigns & follow-ups</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Real-time Analytics</h4>
                    <p className="text-xs text-gray-400">Open & click tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">AI Personalization</h4>
                    <p className="text-xs text-gray-400">Automated custom openers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Spam Guard</h4>
                    <p className="text-xs text-gray-400">Domain safety protection</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Lead Lists Manager</h4>
                    <p className="text-xs text-gray-400">Clean & validate checks</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-800">
                <Link 
                  href="/signup" 
                  className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Claim Your Free Access Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Takes less than 30 seconds • No credit card needed
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}