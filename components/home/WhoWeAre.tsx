"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { ArrowRight, Check, Droplets, Waves, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

const DELIVERY_POINTS = [
  "Water characterization & chemical process design",
  "In-house heavy vessel fabrication & skid assembly",
  "Electro-mechanical installation & wet commissioning",
  "CPCB/SPCB compliance handover & AMC lifecycle support",
];

export const WhoWeAre: FC = () => (
  <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
    <WaterBackgroundEffect variant="azure" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        {/* Left Column: Industrial Plant Visual with Motion Reveal */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="group relative min-h-[380px] overflow-hidden rounded-2xl border-2 border-white/80 bg-[#dce5e1] shadow-[0_16px_40px_rgba(0,119,182,0.12)] sm:min-h-[520px]"
        >
          <Image
            src="/images/plant-etp.jpg"
            alt="Industrial effluent treatment equipment and process tanks"
            fill
            quality={85}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0077B6]/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 text-white sm:px-8 sm:pb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#0A192F]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF] backdrop-blur-md">
              <Waves className="h-3 w-3 animate-pulse" />
              <span>Turnkey Water Engineering</span>
            </div>
            <p className="mt-2 text-lg font-medium text-white sm:text-xl">
              Custom-Engineered for Source Water Chemistry & Discharge Limits.
            </p>
          </div>

          {/* Floating ISO Badge with subtle hover elevation */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-5 top-5 rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:left-7 sm:top-7"
          >
            <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">
              Quality Management
            </span>
            <span className="mt-1 block font-mono text-sm font-bold text-[#0A192F]">
              ISO 9001:2015
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Narrative & Technical Points with Staggered Motion */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="py-2 lg:py-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-sm shadow-sm">
            <Droplets className="h-3 w-3 text-[#0077b6]" />
            <span>About R P Global Projects</span>
          </div>

          <h2 className="mt-4 max-w-[640px] text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0f2d38] sm:text-4xl lg:text-[2.75rem]">
            A single engineering team, from first sample to final handover.
          </h2>

          <div className="mt-5 max-w-[650px] space-y-4 text-sm leading-7 text-[#45616b] sm:text-base">
            <p>
              R P Global Projects designs and delivers industrial water and wastewater treatment systems for manufacturing, commercial, and municipal applications. Each plant is planned around the source water, process demand, site conditions, and reuse goals.
            </p>
            <p>
              Our turnkey EPC approach brings process chemistry, equipment fabrication, instrumentation, and operational support together under one project team.
            </p>
          </div>

          {/* Staggered Delivery Points */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {DELIVERY_POINTS.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ scale: 1.02, x: 2 }}
                className="flex items-start gap-2.5 rounded-xl border border-[#bce1f1] bg-white/80 p-3.5 text-xs font-medium text-[#1e4652] shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[#0077b6]/40 sm:text-sm"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0077B6]" />
                <span>{point}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about-us"
                id="who-we-are-about-link"
                data-magnetic="true"
                className="group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284c7] px-6 text-sm font-semibold text-white shadow-lg shadow-[#0077B6]/25 transition-all hover:shadow-[#0077B6]/35"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Meet the Team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ x: 2 }}>
              <Link
                href="/contact-us"
                id="who-we-are-audit-link"
                data-magnetic="true"
                className="text-sm font-semibold text-[#0f2d38] underline decoration-[#0077B6]/50 underline-offset-4 transition-colors hover:text-[#0077B6]"
              >
                Arrange a Site Discussion
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </WaterBackgroundEffect>
  </section>
);
