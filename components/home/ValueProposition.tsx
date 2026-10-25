"use client";

import Link from "next/link";
import type { FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Waves, CheckCircle2, ShieldCheck } from "lucide-react";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

const CAPABILITIES = [
  {
    number: "01",
    title: "Process Chemistry & Engineering",
    description:
      "Water characterization, treatability studies, PFDs, P&IDs, and hydraulic sizing calibrated precisely to inlet load variations.",
  },
  {
    number: "02",
    title: "Heavy Skid Fabrication & Quality",
    description:
      "Pressure vessels, reaction tanks, skids, and membrane racks manufactured in-house with ASME code welding and ISO 9001 QA/QC.",
  },
  {
    number: "03",
    title: "Compliance-Guaranteed Discharge",
    description:
      "Treatment trains guaranteed to meet Central and State Pollution Control Board (CPCB/SPCB) norms with online COD/BOD analyzers.",
  },
  {
    number: "04",
    title: "PLC, SCADA & IoT Telemetry",
    description:
      "Integrated automation panels with remote cloud dashboards, automated backwash cycles, and flow/pH fault alerting.",
  },
  {
    number: "05",
    title: "Installation & Wet Commissioning",
    description:
      "Full turnkey on-site piping, pump alignment, biological MLSS sludge acclimatization, and hands-on plant operator training.",
  },
  {
    number: "06",
    title: "Lifecycle Operations & AMC Support",
    description:
      "Comprehensive annual maintenance, membrane chemical cleaning (CIP), consumable resin replenishments, and 24/7 technical callout.",
  },
];

export const ValueProposition: FC = () => (
  <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
    <WaterBackgroundEffect variant="marine" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/80 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-md shadow-sm">
              <Waves className="h-3 w-3 text-[#0077b6] animate-pulse" />
              <span>Turnkey EPC Accountability</span>
            </div>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0f2d38] sm:text-4xl">
              One accountable engineering partner across the entire water lifecycle.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#45616b] sm:text-base">
              From raw water lab assays and chemical process simulations through to workshop skid fabrication, on-site erection, and decades of guaranteed AMC operations.
            </p>

            {/* Quality Commitment Pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#bce1f1] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#0f2d38] shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                <span>Zero Outsourced Skid Fabrication</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#bce1f1] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#0f2d38] shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-[#0077B6]" />
                <span>Performance Guarantee Contract</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/about-us"
                  data-magnetic="true"
                  className="group relative inline-flex min-h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284c7] px-6 text-sm font-semibold text-white shadow-lg shadow-[#0077B6]/25 transition-all hover:shadow-[#0077B6]/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Our EPC Delivery Methodology</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Animated 6-Capability Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 overflow-hidden rounded-3xl border border-[#bce1f1] bg-white/90 p-3 shadow-[0_20px_50px_rgba(0,119,182,0.08)] backdrop-blur-md sm:grid-cols-2 sm:p-5"
          >
            {CAPABILITIES.map((item, index) => (
              <motion.article
                key={item.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`group relative rounded-2xl p-5 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-[#f0f9ff] hover:shadow-md ${
                  index % 2 === 0 ? "sm:border-r border-[#bce1f1]/60" : ""
                } ${index < 4 ? "border-b border-[#bce1f1]/60" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0077B6]/10 font-mono text-xs font-bold text-[#0077B6] group-hover:bg-[#0077B6] group-hover:text-white transition-all shadow-sm">
                    {item.number}
                  </span>
                  <h3 className="text-sm font-semibold text-[#0f2d38] group-hover:text-[#0077B6] transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[#45616b] sm:text-[13px] group-hover:text-[#0f2d38]/80 transition-colors">
                  {item.description}
                </p>
                {/* Subtle Hover Beacon */}
                <div className="pointer-events-none absolute bottom-2 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Droplets className="h-4 w-4 text-[#0077B6]/40" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </WaterBackgroundEffect>
  </section>
);
