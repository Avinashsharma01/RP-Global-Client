"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Droplets,
  FileText,
  Gauge,
  Waves,
  Zap,
} from "lucide-react";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";
import { WaterFluidButton } from "@/components/ui/WaterFluidButton";
import { PlantCalculatorSectionData, CalculatorApplication } from "@/lib/types";

interface ApplicationOption {
  id: string;
  name: string;
  plantType: string;
  plantSlug: string;
  technology: string;
  designObjective: string;
  reusePercent: number;
  description: string;
  processChain: string[];
}

const FALLBACK_APPLICATIONS: ApplicationOption[] = [
  {
    id: "sewage",
    name: "Residential & Commercial Sewage",
    plantType: "Sewage Treatment Plant (STP)",
    plantSlug: "sewage-treatment-plants",
    technology: "MBBR or SBR biological aeration & clarification",
    designObjective: "BOD < 10 ppm and TSS < 10 ppm for flush and landscape irrigation reuse.",
    reusePercent: 75,
    description: "Engineered for townships, IT campuses, and commercial developments seeking zero fresh-water waste in toilet flushing and horticulture.",
    processChain: [
      "Screening & grit removal",
      "Flow equalisation & pumping",
      "Biological aeration (MBBR/SBR)",
      "Secondary clarification",
      "Filtration & UV disinfection",
    ],
  },
  {
    id: "effluent",
    name: "Industrial Chemical & Dye Effluent",
    plantType: "Effluent Treatment Plant (ETP)",
    plantSlug: "effluent-treatment-plants",
    technology: "Physico-chemical coagulation & biological treatment",
    designObjective: "COD/BOD/heavy metal reduction conforming to strict SPCB/CPCB industrial discharge limits.",
    reusePercent: 85,
    description: "Heavy-duty skid systems engineered for textile dyeing, pharmaceuticals, electroplating, and manufacturing effluent streams.",
    processChain: [
      "Screening & oil skimmer",
      "Chemical dosing & flash mixing",
      "Flocculation & lamella settling",
      "Aerobic biological reactor",
      "Pressure sand & carbon filter",
    ],
  },
  {
    id: "boiler_pure",
    name: "High-Pressure Boiler Feed & Pure Water",
    plantType: "Demineralization (DM) Plant",
    plantSlug: "demineralization-plants",
    technology: "Two-bed ion exchange with mixed-bed polishing",
    designObjective: "Conductivity < 0.2 µS/cm and silica < 0.02 ppm for zero-scaling thermal operations.",
    reusePercent: 95,
    description: "Ion-exchange columns built for power utilities, paper mills, and pharmaceutical loops demanding zero electrical conductivity.",
    processChain: [
      "Feed-water dual media filter",
      "Strong acid cation exchanger",
      "Degasser tower for dissolved CO₂",
      "Strong base anion exchanger",
      "Mixed bed polish & conductivity monitor",
    ],
  },
  {
    id: "reverse_osmosis",
    name: "Groundwater & High-TDS Desalination",
    plantType: "Reverse Osmosis (RO) Plant",
    plantSlug: "reverse-osmosis-plants",
    technology: "High-pressure membrane separation with anti-scalant dosing",
    designObjective: "Up to 80% permeate recovery with >99.2% salt rejection across high-TDS feeds.",
    reusePercent: 80,
    description: "Multi-stage brackish and sea water reverse osmosis skids equipped with energy recovery turbines and PLC control.",
    processChain: [
      "Raw water multi-grade filter",
      "Anti-scalant & micron cartridge",
      "High-pressure booster pump",
      "Spiral wound RO membrane rack",
      "Permeate storage & CIP system",
    ],
  },
  {
    id: "softener",
    name: "Hard-Water Scale Prevention",
    plantType: "Water Softening Plant",
    plantSlug: "water-softening-plants",
    technology: "Sodium-cycle cation resin with automatic multi-port valve",
    designObjective: "Hardness reduction to < 5 ppm as CaCO₃ to protect cooling towers, chillers, and boilers.",
    reusePercent: 98,
    description: "Turnkey industrial water softeners eliminating calcium and magnesium scale formation across heat-exchange equipment.",
    processChain: [
      "Feed-water hardness testing",
      "Inlet particulate pre-filter",
      "Strong cation ion-exchange resin",
      "Automated brine suction regeneration",
      "Final rinse & softened water supply",
    ],
  },
];

const FALLBACK_PRESETS = [25, 100, 250, 500, 1000];

interface PlantCalculatorProps {
  data?: Partial<PlantCalculatorSectionData>;
  onSelectEstimate?: (plantType: string, capacityKLD: number) => void;
}

export const PlantCalculator: React.FC<PlantCalculatorProps> = ({
  data,
  onSelectEstimate,
}) => {
  const applications =
    data?.applications && data.applications.length > 0
      ? data.applications
      : FALLBACK_APPLICATIONS;
  const presets =
    data?.presets && data.presets.length > 0 ? data.presets : FALLBACK_PRESETS;
  const badge = data?.badge || "Hydraulic Capacity Sizing & Design";
  const title = data?.title || "Estimate plant capacity and compare treatment sequences.";
  const description =
    data?.description ||
    "Select your industrial water application and target flow rate to simulate real-time hydraulic sizing, recovery metrics, and treatment stages.";

  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || "sewage");
  const [capacityKLD, setCapacityKLD] = useState(100);

  const selectedApp =
    applications.find((app) => app.id === selectedAppId) ?? applications[0];

  // Daily flow in m³ (1 KLD = 1 m³/day). Hourly flow assumes 20 operating hours.
  const dailyFlowM3 = capacityKLD;
  const hourlyFlowRateM3 = (dailyFlowM3 / 20).toFixed(1);
  const potentialReuseM3 = Math.round(
    dailyFlowM3 * (selectedApp.reusePercent / 100),
  );

  // Hydraulic height percentage for liquid reservoir visualization (10 KLD = 10%, 1000 KLD = 100%)
  const fillPercentage = Math.min(
    100,
    Math.max(12, Math.round(((capacityKLD - 10) / (1000 - 10)) * 88 + 12)),
  );

  return (
    <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
      <WaterBackgroundEffect variant="hydraulic" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 grid gap-6 lg:mb-10 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/80 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-md shadow-sm">
                <Waves className="h-3 w-3 text-[#0077b6] animate-pulse" />
                <span>{badge}</span>
              </div>
              <h2 className="mt-3.5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0f2d38] sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#45616b] sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-[#bce1f1] bg-white/85 p-3.5 pl-5 text-sm shadow-[0_4px_20px_rgba(0,119,182,0.06)] backdrop-blur-md">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">
                  Capacity Range
                </span>
                <span className="mt-1 block font-mono font-bold text-[#0f2d38]">
                  10 – 1,000 KLD
                </span>
              </div>
              <div className="border-l border-[#bce1f1] pl-5">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">
                  Design Standard
                </span>
                <span className="mt-1 block font-mono font-bold text-[#0f2d38]">
                  20 Operating Hrs
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-3xl border border-[#bce1f1] bg-white/90 shadow-[0_20px_50px_rgba(0,119,182,0.09)] backdrop-blur-md"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              {/* Left Configuration Panel */}
              <div className="space-y-8 p-6 sm:p-8 lg:p-9">
                <fieldset>
                  <legend className="mb-4 text-base font-semibold text-[#0f2d38] flex items-center justify-between">
                    <span>1. Select Water Application</span>
                    <span className="text-xs font-normal text-[#0077B6]">5 Engineering Systems</span>
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {applications.map((app) => {
                      const isSelected = app.id === selectedAppId;
                      return (
                        <motion.button
                          key={app.id}
                          type="button"
                          id={`app-option-${app.id}`}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedAppId(app.id)}
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className={`group relative min-h-[96px] rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6] ${
                            isSelected
                              ? "border-[#0077B6] bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]/60 shadow-[0_4px_16px_rgba(0,119,182,0.12)] ring-1 ring-[#0077B6]/30"
                              : "border-[#bce1f1]/70 bg-white/80 hover:border-[#0077B6]/50 hover:bg-white"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-3">
                            <span className="text-sm font-semibold leading-5 text-[#0f2d38] group-hover:text-[#0077B6] transition-colors">
                              {app.name}
                            </span>
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                isSelected
                                  ? "border-[#0077B6] bg-[#0077B6] text-white shadow-sm"
                                  : "border-[#bce1f1] text-transparent group-hover:border-[#0077B6]/50"
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                            </span>
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-[#45616b]">
                            {app.technology}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Daily Plant Capacity Slider & Interactive Reservoir */}
                <div className="border-t border-[#bce1f1]/60 pt-7">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <label
                        htmlFor="capacity-slider"
                        className="block text-base font-semibold text-[#0f2d38]"
                      >
                        2. Daily Hydraulic Flow Rate
                      </label>
                      <p className="mt-1 text-xs text-[#45616b] sm:text-sm">
                        Slide to set your required plant throughput or choose a common standard.
                      </p>
                    </div>
                    <div className="text-right">
                      <motion.span
                        key={capacityKLD}
                        initial={{ scale: 0.9, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl font-mono font-bold tracking-tight text-[#0077B6]"
                      >
                        {capacityKLD.toLocaleString()}
                      </motion.span>
                      <span className="ml-2 font-mono text-sm font-semibold text-[#0f2d38]">
                        KLD
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-[#45616b]">
                        = {dailyFlowM3.toLocaleString()} m³/day ({hourlyFlowRateM3} m³/hr)
                      </span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="mt-6 relative">
                    <input
                      type="range"
                      id="capacity-slider"
                      min="10"
                      max="1000"
                      step="10"
                      value={capacityKLD}
                      onChange={(event) =>
                        setCapacityKLD(Number.parseInt(event.target.value, 10))
                      }
                      className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[#bce1f1]/60 accent-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/40"
                      aria-label="Daily plant capacity in kilolitres"
                      aria-valuetext={`${capacityKLD} kilolitres per day`}
                    />
                    {/* Animated Fill Track */}
                    <div
                      className="pointer-events-none absolute left-0 top-0 h-2.5 rounded-full bg-gradient-to-r from-[#0077B6] to-[#00E5FF]"
                      style={{ width: `${((capacityKLD - 10) / 990) * 100}%` }}
                    />
                  </div>

                  <div className="mt-2.5 flex justify-between font-mono text-[11px] text-[#45616b]">
                    <span>10 KLD (Micro Plant)</span>
                    <span>500 KLD</span>
                    <span>1,000 KLD (Macro Industrial)</span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="mt-5 flex flex-wrap gap-2" aria-label="Quick capacity values">
                    {presets.map((preset) => {
                      const isActive = capacityKLD === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          id={`preset-btn-${preset}`}
                          aria-pressed={isActive}
                          onClick={() => setCapacityKLD(preset)}
                          className={`min-h-11 rounded-xl border px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6] ${
                            isActive
                              ? "border-[#0077B6] bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/25"
                              : "border-[#bce1f1] bg-white text-[#45616b] hover:border-[#0077B6]/50 hover:bg-[#f0f9ff]"
                          }`}
                        >
                          {preset.toLocaleString()} KLD
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Animated Process Chain Sequence */}
                <div className="border-t border-[#bce1f1]/60 pt-7">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#0f2d38]">
                        3. Typical 5-Stage Treatment Train
                      </h3>
                      <p className="mt-1 text-xs text-[#45616b] sm:text-sm">
                        Fluid flow sequence for {selectedApp.plantType}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0077B6]">
                      <Waves className="h-4 w-4 animate-pulse" />
                      <span>Continuous Flow</span>
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.ol
                      key={selectedApp.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                    >
                      {selectedApp.processChain.map((stage, index) => (
                        <motion.li
                          key={`${selectedApp.id}-${stage}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.06, duration: 0.3 }}
                          whileHover={{ x: 3 }}
                          className="group flex min-h-12 items-center gap-3 rounded-xl border border-[#bce1f1]/60 bg-white/70 px-3.5 py-2.5 text-xs text-[#0f2d38] shadow-sm backdrop-blur-sm transition-colors hover:border-[#0077B6]/40 hover:bg-white"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0077B6]/10 font-mono text-[11px] font-bold text-[#0077B6] group-hover:bg-[#0077B6] group-hover:text-white transition-colors">
                            {index + 1}
                          </span>
                          <span className="leading-snug font-medium text-[#45616b] group-hover:text-[#0f2d38] transition-colors">
                            {stage}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ol>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Results & Hydraulic Gauge Panel */}
              <aside className="flex flex-col border-t border-[#bce1f1]/70 bg-gradient-to-b from-[#f0f9ff]/80 to-white/95 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077B6]">
                    <Zap className="h-3 w-3" />
                    <span>Hydraulic Simulator Output</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.02em] text-[#0f2d38] sm:text-2xl">
                    {selectedApp.plantType}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#45616b] sm:text-sm">
                    {selectedApp.description}
                  </p>
                </div>

                {/* Visual Liquid Reservoir Vessel */}
                <div className="mt-6 rounded-2xl border border-[#bce1f1] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0f2d38] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-[#0077B6]" />
                      <span>Hydraulic Reservoir Volume</span>
                    </span>
                    <span className="font-mono text-[#0077B6]">{capacityKLD} KLD</span>
                  </div>

                  {/* Vessel Tank Graphic */}
                  <div className="relative h-20 w-full overflow-hidden rounded-xl border border-[#bce1f1] bg-gradient-to-b from-[#0A192F]/5 to-[#0077B6]/10 p-1">
                    {/* Tick Marks */}
                    <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-between text-[9px] font-mono text-[#45616b]/60 pointer-events-none z-10">
                      <span>1,000</span>
                      <span>500</span>
                      <span>10</span>
                    </div>

                    {/* Animated Liquid Level */}
                    <motion.div
                      className="absolute inset-x-0 bottom-0 rounded-lg bg-gradient-to-t from-[#0077B6] to-[#00E5FF] shadow-inner"
                      initial={false}
                      animate={{ height: `${fillPercentage}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    >
                      {/* Wave Crest Ripple Line */}
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/50 animate-pulse" />
                      
                      {/* Micro-Bubbles */}
                      <span className="absolute left-1/4 bottom-1 h-1.5 w-1.5 rounded-full bg-white/70 animate-ping opacity-60" />
                      <span className="absolute right-1/3 bottom-3 h-1 w-1 rounded-full bg-white/80 animate-ping opacity-75" />
                    </motion.div>

                    {/* Glass Glare Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/5" />
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="mt-5 divide-y divide-[#bce1f1]/60 border-y border-[#bce1f1]/60">
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#45616b]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0077B6] shadow-sm ring-1 ring-[#bce1f1]">
                        <Gauge className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>Daily Design Flow</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#0f2d38]">
                      {dailyFlowM3.toLocaleString()} m³/day
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#45616b]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0077B6] shadow-sm ring-1 ring-[#bce1f1]">
                        <Activity className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>Flow Rate (20 Hr Basis)</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#0f2d38]">
                      {hourlyFlowRateM3} m³/hour
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#45616b]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#10B981] shadow-sm ring-1 ring-[#bce1f1]">
                        <Droplets className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>Projected Water Recovery</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#10B981]">
                      ~{potentialReuseM3.toLocaleString()} m³/day
                    </span>
                  </div>
                </div>

                {/* Water Recovery Efficiency Badge */}
                <div className="mt-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
                      Standard Recovery: {selectedApp.reusePercent}%
                    </p>
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      ZLD / High-Yield
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-950/80">
                    {selectedApp.designObjective}
                  </p>
                </div>

                {/* CTAs */}
                <div className="mt-auto pt-7 space-y-3">
                  <WaterFluidButton
                    type="button"
                    id="plant-calculator-rfq-btn"
                    size="md"
                    className="w-full py-3.5 text-sm font-semibold"
                    onClick={() => {
                      if (onSelectEstimate) {
                        onSelectEstimate(selectedApp.plantType, capacityKLD);
                      } else {
                        window.location.href = `/contact-us?plant=${encodeURIComponent(
                          selectedApp.plantType,
                        )}&capacity=${capacityKLD}#rfq`;
                      }
                    }}
                  >
                    <span>Request Engineering Proposal ({capacityKLD} KLD)</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </WaterFluidButton>

                  <div className="text-center">
                    <Link
                      href={`/solutions/${selectedApp.plantSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077B6] hover:text-[#0284c7] transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Review Technical Specifications & P&ID</span>
                    </Link>
                  </div>

                  <p className="flex items-start gap-2 border-t border-[#bce1f1]/60 pt-3 text-[11px] leading-relaxed text-[#45616b]">
                    <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0077B6]" aria-hidden="true" />
                    <span>
                      Preliminary hydraulic estimate. Actual equipment sizing, membrane arrays, and dosing requirements are finalized after raw water chemical lab characterization.
                    </span>
                  </p>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      </WaterBackgroundEffect>
    </section>
  );
};
