"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Droplets,
  Filter,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowRight,
  Zap,
  Gauge,
} from "lucide-react";
import { WaterWaveDivider } from "@/components/ui/WaterWaveDivider";
import { WaterPurificationFlowData, TreatmentStageItem } from "@/lib/types";

interface TreatmentStage {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  rawWaterLabel: string;
  rawWaterColor: string;
  rawWaterDesc: string;
  purifiedWaterColor: string;
  technology: string;
  keyMetric: { label: string; raw: string; treated: string; unit: string };
  complianceBadge: string;
}

const FALLBACK_STAGES: TreatmentStage[] = [
  {
    id: "etp",
    name: "Industrial Effluent (ETP & ZLD)",
    shortName: "ETP / ZLD",
    tagline: "Heavy Industrial Chemical & Organic Wastewater Remediation",
    rawWaterLabel: "Industrial Effluent",
    rawWaterColor: "rgba(180, 83, 9, 0.45)", // Turbid amber
    rawWaterDesc: "High COD/BOD • Heavy Metals • Oil & Grease",
    purifiedWaterColor: "rgba(0, 229, 255, 0.65)", // Clean cyan
    technology: "Physico-Chemical + Biological MBBR + Multi-Effect Evaporator",
    keyMetric: { label: "COD Level", raw: "3,800", treated: "< 45", unit: "mg/L" },
    complianceBadge: "100% CPCB / SPCB Zero Liquid Discharge (ZLD)",
  },
  {
    id: "stp",
    name: "Sewage Treatment (MBBR / MBR)",
    shortName: "STP Plant",
    tagline: "Odourless Domestic Wastewater Recycling for Commercial Sites",
    rawWaterLabel: "Raw Domestic Sewage",
    rawWaterColor: "rgba(100, 116, 139, 0.55)", // Turbid grey
    rawWaterDesc: "Organic Pathogens • High Suspended Solids • Ammoniacal Nitrogen",
    purifiedWaterColor: "rgba(16, 185, 129, 0.65)", // Eco emerald cyan
    technology: "Virgin HDPE Bio-Carriers (550 m²/m³) + Submerged Ultrafiltration",
    keyMetric: { label: "BOD Discharge", raw: "320", treated: "< 8", unit: "mg/L" },
    complianceBadge: "Approved for Dual-Plumbing Flushing & Landscaping",
  },
  {
    id: "ro",
    name: "Reverse Osmosis (RO Desalination)",
    shortName: "RO Systems",
    tagline: "High-Rejection Membrane Separation for High TDS Feeds",
    rawWaterLabel: "Brackish Ground Water",
    rawWaterColor: "rgba(202, 138, 4, 0.35)", // Saline mineral tint
    rawWaterDesc: "TDS 2,500+ ppm • Dissolved Chlorides & Sulfates • Hardness",
    purifiedWaterColor: "rgba(0, 180, 216, 0.75)", // Deep pure azure
    technology: "Thin-Film Composite (TFC) Polyamide Membranes (99.4% Rejection)",
    keyMetric: { label: "Total Dissolved Solids", raw: "2,850", treated: "< 40", unit: "ppm" },
    complianceBadge: "High-Pressure Boiler & Pharmaceutical Grade Purity",
  },
  {
    id: "wtp",
    name: "Surface Water Treatment (WTP)",
    shortName: "WTP Clarifier",
    tagline: "High-Rate River & Canal Clarification for Municipal/Plant Feeds",
    rawWaterLabel: "Raw River Water",
    rawWaterColor: "rgba(161, 98, 7, 0.4)", // River silt turbidity
    rawWaterDesc: "Colloidal Clay • Algae • Monsoon River Silt 120 NTU",
    purifiedWaterColor: "rgba(56, 189, 248, 0.7)", // Crystal aqua
    technology: "Flash Flash Mixer + Lamella Tube Settler + Rapid Gravity Sand",
    keyMetric: { label: "Turbidity", raw: "140", treated: "< 0.8", unit: "NTU" },
    complianceBadge: "Compliant with BIS 10500:2012 Potable Norms",
  },
];

interface WaterPurificationFlowProps {
  data?: Partial<WaterPurificationFlowData>;
}

export const WaterPurificationFlow: React.FC<WaterPurificationFlowProps> = ({ data }) => {
  const stages = data?.stages && data.stages.length > 0 ? (data.stages as TreatmentStage[]) : FALLBACK_STAGES;
  const badge = data?.badge || "Interactive Hydro-Dynamics Telemetry";
  const title = data?.title || "Watch Industrial Water Clarification in Real-Time";
  const description =
    data?.description ||
    "Experience how RP Global transforms heavily contaminated raw effluent, saline groundwater, and domestic sewage into crystal-clear, CPCB-compliant reusable water.";

  const [selectedId, setSelectedId] = useState<string>(() => stages[0]?.id || "etp");
  const [flowSpeed, setFlowSpeed] = useState<number>(100); // 50 to 200 KLD
  const [isSurgeActive, setIsSurgeActive] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (stages.length > 0 && !stages.some((s) => s.id === selectedId)) {
      setSelectedId(stages[0].id);
    }
  }, [stages, selectedId]);

  const stage = stages.find((s) => s.id === selectedId) || stages[0];

  // Canvas fluid particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 200);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 200;
    };
    window.addEventListener("resize", handleResize);

    // Particles simulation: raw particles on left, filtered in middle, bubbles on right
    interface Particle {
      x: number;
      y: number;
      vx: number;
      radius: number;
      isPurified: boolean;
      opacity: number;
    }

    const particles: Particle[] = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: 20 + Math.random() * (height - 40),
        vx: (1.2 + Math.random() * 1.5) * (flowSpeed / 100),
        radius: 1.5 + Math.random() * 3.5,
        isPurified: false,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }

    let time = 0;
    let isVisible = true;

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(render);
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const filterX = width * 0.48; // Position of membrane filter

      // Draw background fluid flow gradient
      const flowGrad = ctx.createLinearGradient(0, 0, width, 0);
      flowGrad.addColorStop(0, stage.rawWaterColor);
      flowGrad.addColorStop(0.44, "rgba(0, 119, 182, 0.2)");
      flowGrad.addColorStop(0.52, "rgba(0, 229, 255, 0.3)");
      flowGrad.addColorStop(1, stage.purifiedWaterColor);

      ctx.fillStyle = flowGrad;
      ctx.fillRect(0, 10, width, height - 20);

      // Draw undulating wave streams across the conduit
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const baseY = 40 + wave * 55;
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= width; x += 15) {
          const freq = 0.015 + wave * 0.005;
          const speedMultiplier = isSurgeActive ? 4.5 : 1.8;
          const y = baseY + Math.sin(x * freq + time * speedMultiplier + wave) * 8;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          wave === 1
            ? "rgba(255, 255, 255, 0.35)"
            : "rgba(0, 229, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Central Membrane Filtration Barrier
      ctx.save();
      ctx.fillStyle = "rgba(10, 25, 47, 0.85)";
      ctx.fillRect(filterX - 12, 5, 24, height - 10);
      ctx.strokeStyle = isSurgeActive ? "#00E5FF" : "rgba(0, 229, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(filterX - 12, 5, 24, height - 10);

      // Membrane grid lines
      for (let y = 15; y < height - 15; y += 12) {
        ctx.beginPath();
        ctx.moveTo(filterX - 10, y);
        ctx.lineTo(filterX + 10, y);
        ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const surgeBoost = isSurgeActive ? 3.0 : 1.0;
        p.x += p.vx * (flowSpeed / 100) * surgeBoost;

        if (p.x > width + 10) {
          p.x = -10;
          p.y = 20 + Math.random() * (height - 40);
          p.isPurified = false;
        }

        // Check if passed filter barrier
        if (p.x > filterX) {
          p.isPurified = true;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isPurified ? p.radius * 0.75 : p.radius, 0, Math.PI * 2);

        if (!p.isPurified) {
          // Turbid raw particle (amber / brown / suspended solids)
          ctx.fillStyle = `rgba(180, 83, 9, ${p.opacity * 0.75})`;
        } else {
          // Pure treated droplet / aeration micro-bubble (pure cyan & white glint)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.85})`;
          ctx.strokeStyle = "rgba(0, 229, 255, 0.8)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView && !isVisible) {
          isVisible = true;
          if (!animId) {
            animId = requestAnimationFrame(render);
          }
        } else if (!inView && isVisible) {
          isVisible = false;
          if (animId) {
            cancelAnimationFrame(animId);
            animId = 0;
          }
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stage, flowSpeed, isSurgeActive]);

  const triggerSurge = () => {
    setIsSurgeActive(true);
    setTimeout(() => setIsSurgeActive(false), 1600);
  };

  return (
    <section className="relative overflow-hidden bg-[#0A192F] pb-20 pt-0 text-white selection:bg-[#00E5FF] selection:text-[#0A192F]">
      {/* Top Wave transition from azure water of WhoWeAre */}
      <WaterWaveDivider position="top" fillColor="#f0f9ff" accentColor="#00e5ff" height={44} />

      {/* Background ambient water glow */}
      <div className="pointer-events-none absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-[#0077B6]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-1/4 h-96 w-96 rounded-full bg-[#00E5FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#00E5FF]">
              <Droplets className="h-3.5 w-3.5 animate-pulse text-[#00E5FF]" />
              {badge}
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl text-white">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {description}
            </p>
          </div>

          {/* Plant Selector Tabs */}
          <div className="no-scrollbar flex max-w-full flex-nowrap gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md md:flex-wrap">
            {stages.map((s) => {
              const isSelected = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`min-h-11 shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {s.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Simulation Console */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          {/* Top Bar: Telemetry Stage Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/60 px-4 py-4 font-mono text-xs sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] animate-ping" />
              <span className="truncate font-bold uppercase text-white">{stage.name}</span>
              <span className="hidden sm:inline text-slate-400">· {stage.technology}</span>
            </div>
            <div className="flex min-w-0 items-center gap-2 text-[#00E5FF]">
              <ShieldCheck className="h-4 w-4" />
              <span className="truncate text-[11px] font-semibold">{stage.complianceBadge}</span>
            </div>
          </div>

          {/* Live Dynamic Fluid Stream Canvas */}
          <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-cyan-950/40">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

            {/* Inflow & Outflow HUD Overlays */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[46%] items-center gap-2 overflow-hidden rounded-md border border-amber-500/30 bg-black/60 px-2.5 py-1.5 font-mono text-[10px] text-amber-300 backdrop-blur-md sm:left-6 sm:top-4 sm:max-w-none sm:px-3 sm:text-[11px]">
              <Activity className="h-3.5 w-3.5" />
              <span className="truncate">RAW INLET: {stage.rawWaterLabel}</span>
            </div>

            <div className="pointer-events-none absolute right-3 top-3 z-10 flex max-w-[46%] items-center gap-2 overflow-hidden rounded-md border border-[#00E5FF]/40 bg-black/60 px-2.5 py-1.5 font-mono text-[10px] text-[#00E5FF] backdrop-blur-md sm:right-6 sm:top-4 sm:max-w-none sm:px-3 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="truncate">TREATED OUTLET: Crystal Permeate</span>
            </div>

            {/* Filter Core Badge in Middle */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex max-w-[82%] -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 px-3 py-1 text-[9px] font-mono text-slate-300 sm:bottom-4 sm:text-[10px]">
              <Filter className="h-3 w-3 text-[#00E5FF]" />
              <span className="truncate">Membrane / Media Barrier</span>
            </div>
          </div>

          {/* Bottom Telemetry & Controls Dashboard */}
          <div className="grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 bg-slate-950/80 lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            {/* Raw Inlet Metrics */}
            <div className="p-6 lg:col-span-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                1. Raw Feed Analysis
              </div>
              <div className="mt-2 text-sm text-slate-300">{stage.rawWaterDesc}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-amber-400">
                  {stage.keyMetric.raw}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {stage.keyMetric.unit} ({stage.keyMetric.label})
                </span>
              </div>
            </div>

            {/* Treated Permeate Metrics */}
            <div className="p-6 lg:col-span-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#10B981]">
                2. Treated Water Purity
              </div>
              <div className="mt-2 text-sm text-slate-300">
                Odor-Free · Ultra Clarified · Recyclable for Boilers, Flushing & Irrigation
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-[#00E5FF]">
                  {stage.keyMetric.treated}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {stage.keyMetric.unit} ({stage.keyMetric.label})
                </span>
              </div>
            </div>

            {/* Interactive Flow Controls */}
            <div className="flex flex-col justify-between p-6 lg:col-span-4">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-[#00E5FF]" /> Sizing Hydraulic Flow
                  </span>
                  <span className="font-bold text-white">{flowSpeed} KLD</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="500"
                  step="25"
                  value={flowSpeed}
                  onChange={(e) => setFlowSpeed(Number(e.target.value))}
                  aria-label="Adjust plant hydraulic flow rate in KLD"
                  className="mt-3 w-full cursor-pointer accent-[#00E5FF]"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={triggerSurge}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-2 text-xs font-semibold text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-colors"
                >
                  <Zap className={`h-3.5 w-3.5 ${isSurgeActive ? "animate-bounce" : ""}`} />
                  {isSurgeActive ? "Backwash In Progress..." : "Simulate Fluid Surge"}
                </button>

                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#0077B6] hover:bg-[#005f92] px-3.5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <span>Specs</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave transition into SolutionsGrid */}
      <WaterWaveDivider position="bottom" fillColor="#e6f4f8" accentColor="#0ea5e9" height={44} />
    </section>
  );
};
