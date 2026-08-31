"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      question: "Is BlasterMail really 100% free during the beta?",
      answer: "Yes, absolutely! During our public early-access beta phase, all core features, automated sequencing, and analytics are completely free with zero hidden charges and no credit card required."
    },
    {
      question: "How does BlasterMail protect my domains from spam folders?",
      answer: "We use built-in smart throttling, randomized sending intervals, and automated warm-up protocols that distribute your emails naturally to ensure high inbox placement rates."
    },
    {
      question: "Can I import my existing lead lists into the dashboard?",
      answer: "Yes, you can easily import your leads via CSV files. Our built-in lead manager automatically cleans and validates emails before starting any campaign."
    },
    {
      question: "How does the AI personalization feature work?",
      answer: "Our integrated AI analyzes your lead details and crafts custom, high-converting email openers automatically, saving you hours of manual research time."
    },
    {
      question: "What happens after the beta program ends?",
      answer: "Early adopters and beta users will get special grandfathered perks and massive discounts when we introduce paid tiers later. Your account data and setups will remain secure."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative bg-white py-24 sm:py-32 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Got Questions?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Everything you need to know about our free beta program, features, and cold email deliverability.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-blue-600 text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Box */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-100 text-center shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Still have questions?</h3>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Can't find the answer you're looking for? Reach out to our founder support team directly.
          </p>
          <a 
            href="mailto:admin@websynergystudiollc.online" 
            className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            Chat With Support
          </a>
        </div>

      </div>
    </section>
  );
}