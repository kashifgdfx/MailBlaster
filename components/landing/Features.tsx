"use client";

import React from 'react';
import { Send, Users, BarChart3, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Send className="w-6 h-6 text-blue-600" />,
      title: "Smart Campaign Automation",
      description: "Schedule, drip, and automate your cold email sequences with intelligent throttling to maximize deliverability.",
      badge: "Popular",
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Advanced Lead Management",
      description: "Import, categorize, and clean your lead lists seamlessly with built-in validation checks.",
      badge: null,
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      title: "Real-time Analytics & Tracking",
      description: "Monitor opens, clicks, replies, and bounce rates instantly with a clean, interactive dashboard.",
      badge: "Live Data",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Spam Guard & Warm-up",
      description: "Keep your domains safe and out of the spam folder with automated warm-up networks.",
      badge: "Secure",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: "Lightning Fast Delivery",
      description: "Send thousands of hyper-personalized emails per hour without hitting server roadblocks.",
      badge: null,
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      title: "AI Personalization",
      description: "Draft high-converting custom email openers automatically using integrated smart AI tools.",
      badge: "AI Powered",
    },
  ];

  return (
    <section id="features" className="relative bg-gray-50/50 py-24 sm:py-32 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Left Aligned) */}
        <div className="max-w-3xl">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100 mb-4">
            Powerful Features
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Everything you need to scale your <span className="text-blue-600">cold outreach</span>
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Designed specifically for sales teams, agencies, and founders who want results without the complexity.
          </p>
        </div>

        {/* Features Grid (Bento Style) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                  {feature.icon}
                </div>
                {feature.badge && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {feature.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="mt-3 text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom Subtle Indicator */}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                <span>Learn more</span>
                <span className="text-lg">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}