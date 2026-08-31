"use client";

import React from "react";
import Link from "next/link";
import {useEffect,useRef} from 'react'
import { ArrowRight, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import Typewriter from "typewriter-effect";

export default function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 0.5;
  }
}, [])

  return (
    <section className="relative text-white overflow-hidden py-24 sm:py-32 lg:py-36">

      {/* Video Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
     <video
  ref={videoRef}
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover"
>
  <source
    src="/video1.mp4"
    type="video/mp4"
  />
</video>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-8 shadow-inner cursor-pointer group">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>

          <span className="text-sm font-medium">
            Over 10,000+ Campaigns Launched • 100% Free Beta
          </span>

          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto min-h-[100px] sm:min-h-[140px]">
          Launch Cold Emails That <br />

          <span className="bg-blue-500">
            <Typewriter
              options={{
                strings: [
                  "Convert.",
                  "Engage.",
                  "Scale.",
                  "Close Deals.",
                ],
                autoStart: true,
                loop: true,
                delay: 70,
                deleteSpeed: 50,
              }}
            />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          BlasterMail empowers you to send personalized,
          high-volume cold emails effortlessly.
          Automate follow-ups, track engagement,
          and scale your outreach.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">

          {/* <Link
            href="/login"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 shadow-2xl transition-all duration-300"
          >
            Open Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link> */}

          <button
            onClick={() =>
              toast.info("Demo video coming soon")
            }
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
          >
            <PlayCircle className="w-6 h-6 text-blue-400" />
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
}