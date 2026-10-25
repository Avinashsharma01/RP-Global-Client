"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, PhoneCall, Droplets, Activity } from "lucide-react";
import dynamic from "next/dynamic";
import { COMPANY_INFO } from "@/lib/constants";
import { WaterWaveDivider } from "@/components/ui/WaterWaveDivider";
import { WaterFluidButton } from "@/components/ui/WaterFluidButton";

const WaterHeroCanvas = dynamic(
  () => import("@/components/ui/WaterHeroCanvas").then((mod) => mod.WaterHeroCanvas),
  { ssr: false }
);

export const Hero: FC<{ onOpenRFQ?: (plantType?: string) => void }> = ({
  onOpenRFQ,
}) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f0f9ff]/60 to-[#e0f2fe]/40">
    {/* Subtle aquatic background ambient caustics with breathing glow */}
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#00E5FF]/20 blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="pointer-events-none absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-[#0077B6]/20 blur-3xl"
    />

    <div className="mx-auto grid min-h-[560px] max-w-[1640px] grid-cols-1 px-4 sm:px-6 lg:px-8 lg:min-h-[580px] lg:grid-cols-[0.92fr_1.08fr]">
      {/* Left Column: Headline & Technical Value Props */}
      <div className="relative z-10 flex flex-col justify-center py-14 pr-4 sm:pr-8 lg:py-14 lg:pr-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#0077b6]/25 bg-white/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-sm shadow-sm"
        >
          <Droplets className="h-3.5 w-3.5 text-[#00E5FF] animate-pulse" />
          <span>Industrial Water & Wastewater EPC • India</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="max-w-[650px] text-[2.45rem] font-semibold leading-[1.05] tracking-[-0.045em] text-[#0A192F] sm:text-[2.8rem] xl:text-[3.8rem]"
        >
          Water systems,
          <br />
          engineered for
          <br />
          <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent font-bold">
            the long run.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease: "easeOut" }}
          className="mt-6 max-w-[510px] text-base leading-7 text-[#475569] sm:text-lg"
        >
          Turnkey water and wastewater treatment plants designed around your inlet water chemistry,
          fabricated in-house to guarantee CPCB/SPCB discharge limits, and supported through long-term operation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: "easeOut" }}
          className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <WaterFluidButton
            id="hero-rfq-btn"
            onClick={() => onOpenRFQ ? onOpenRFQ() : (window.location.href = "/contact-us#rfq")}
            size="md"
            className="px-7 py-3.5 text-sm font-semibold tracking-wide"
          >
            Talk to an Engineer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </WaterFluidButton>

          <WaterFluidButton
            href="/solutions"
            id="hero-solutions-link"
            variant="secondary"
            size="md"
            className="px-6 py-3.5 text-sm font-semibold"
          >
            Explore Our Solutions <ArrowDown className="h-4 w-4 text-[#0077B6]" />
          </WaterFluidButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-xs text-[#53666a]"
        >
          <span className="inline-flex items-center gap-2 font-medium">
            <Check className="h-4 w-4 text-[#10B981]" /> ISO 9001:2015 Certified
          </span>
          <span className="inline-flex items-center gap-2 font-medium">
            <Check className="h-4 w-4 text-[#10B981]" /> CPCB / SPCB Focused Design
          </span>
          <a
            href={`tel:${COMPANY_INFO.phoneRaw}`}
            className="group inline-flex items-center gap-2 font-semibold text-[#0A192F] transition-colors hover:text-[#0077B6]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077B6]/10 text-[#0077B6] group-hover:bg-[#0077B6] group-hover:text-white transition-colors">
              <PhoneCall className="h-3 w-3" />
            </span>
            <span>{COMPANY_INFO.phone}</span>
          </a>
        </motion.div>
      </div>

      {/* Right Column: Hero Facility Image with Interactive Water Ripple Canvas */}
      <div className="group relative min-h-[380px] overflow-hidden bg-[#0A192F] lg:min-h-full">
        <Image
          src="/images/hero-bg.jpg"
          alt="A large industrial wastewater treatment facility"
          fill
          priority
          quality={85}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient fluid tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/85 via-[#0077B6]/20 to-transparent pointer-events-none" />

        {/* Interactive Water Ripple & Caustic Canvas */}
        <WaterHeroCanvas
          intensity={1.1}
          showBadge={true}
          className="absolute inset-0 z-10 cursor-crosshair"
        />

        {/* Floating Live Telemetry Badge */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-white/20 bg-[#0A192F]/85 px-4 py-2 text-xs font-mono text-cyan-200 backdrop-blur-md shadow-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
          </span>
          <Activity className="h-3.5 w-3.5 text-[#00E5FF]" />
          <span>Real-Time Plant Telemetry • Active</span>
        </motion.div>

        <div className="absolute bottom-5 left-5 z-20 rounded-md bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0A192F] shadow-md sm:bottom-7 sm:left-7">
          Industrial wastewater treatment
        </div>
      </div>
    </div>

    {/* Organic animated water wave divider into MetricsSection */}
    <WaterWaveDivider
      fillColor="#f0f9ff"
      accentColor="#00e5ff"
      height={46}
      position="bottom"
    />
  </section>
);
