"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Droplets,
  ShieldCheck,
  Activity,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface WaterLoadingScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
  durationMs?: number;
}

interface PlantStage {
  step: string;
  name: string;
  shortName: string;
  technology: string;
  shortDesc: string;
  badge: string;
  image: string;
  imageAlt: string;
  metric1: { label: string; value: string; note: string };
  metric2: { label: string; value: string; note: string };
  purityIndex: number;
}

const PLANT_STAGES: PlantStage[] = [
  {
    step: "01",
    name: "Effluent Intake & Analysis",
    shortName: "ETP Intake",
    technology: "Physico-Chemical & Neutralization",
    shortDesc: "Automated spectroscopic chemical analysis & coagulation of heavy organic load.",
    badge: "Influent Characterization",
    image: "/images/plant-etp.jpg",
    imageAlt: "Industrial Effluent Treatment Plant (ETP)",
    metric1: { label: "Inlet COD", value: "3,800 mg/L", note: "Raw Influent" },
    metric2: { label: "TSS Level", value: "1,450 mg/L", note: "Pre-coagulation" },
    purityIndex: 35,
  },
  {
    step: "02",
    name: "Biological MBBR Aeration",
    shortName: "MBBR Aeration",
    technology: "Fluidized Bio-Carriers (550 m²/m³)",
    shortDesc: "Aerobic microbial decomposition of dissolved organics with fine-bubble oxygen diffusion.",
    badge: "Biological Remediation",
    image: "/images/plant-stp.jpg",
    imageAlt: "MBBR Sewage & Wastewater Treatment Plant",
    metric1: { label: "BOD Reduction", value: "92.4%", note: "Bio-degraded" },
    metric2: { label: "Dissolved O₂", value: "3.4 mg/L", note: "Continuous" },
    purityIndex: 72,
  },
  {
    step: "03",
    name: "Reverse Osmosis & ZLD",
    shortName: "RO Demineralization",
    technology: "High-Rejection Polyamide RO Membranes",
    shortDesc: "Spiral-wound membrane separation eliminating dissolved salts, heavy metals, and silica.",
    badge: "Membrane Demineralization",
    image: "/images/plant-ro.jpg",
    imageAlt: "Industrial Reverse Osmosis Desalination Plant",
    metric1: { label: "Salt Rejection", value: "99.4%", note: "TDS < 35 ppm" },
    metric2: { label: "Permeate Yield", value: "85%", note: "High Recovery" },
    purityIndex: 94,
  },
  {
    step: "04",
    name: "Facility Online & Certified",
    shortName: "ZLD Operational",
    technology: "100% CPCB / SPCB Zero Liquid Discharge",
    shortDesc: "Recycled industrial water calibrated for boiler feed, cooling towers, and green belt.",
    badge: "Plant Commissioned",
    image: "/images/hero-bg.jpg",
    imageAlt: "Turnkey Industrial Water Treatment Facility",
    metric1: { label: "Purity Index", value: "99.8%", note: "Process Grade" },
    metric2: { label: "SPCB Standard", value: "Compliant", note: "Zero Discharge" },
    purityIndex: 100,
  },
];

export const WaterLoadingScreen: React.FC<WaterLoadingScreenProps> = ({
  onComplete,
  forceShow = false,
  durationMs = 3200,
}) => {
  const [isVisible, setIsVisible] = useState(forceShow);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onCompleteRef = useRef(onComplete);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Sync isVisible if forceShow changes
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      setProgress(0);
    }
  }, [forceShow]);

  // Trap and restore focus for accessibility
  useEffect(() => {
    if (!isVisible) return;

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && !activeElement.closest("#site-introduction")) {
      returnFocusRef.current = activeElement;
    }
    skipButtonRef.current?.focus({ preventScroll: true });
  }, [isVisible]);

  const finishIntro = useCallback(() => {
    returnFocusRef.current?.focus({ preventScroll: true });
    returnFocusRef.current = null;
    setIsVisible(false);
    onCompleteRef.current?.();
  }, []);

  // Keyboard controls (Esc to skip, Tab trap)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finishIntro();
      } else if (event.key === "Tab") {
        event.preventDefault();
        skipButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishIntro, isVisible]);

  // Smooth 60fps progress animation timer
  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    let frameId: number;

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, (elapsed / durationMs) * 100);

      setProgress(rawProgress);

      if (rawProgress < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Brief graceful settle at 100% before reveal
        window.setTimeout(finishIntro, 220);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [durationMs, finishIntro, isVisible]);

  // Subtle interactive parallax mouse effect (desktop only)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 14;
    const y = (clientY / window.innerHeight - 0.5) * 14;
    setMousePos({ x, y });
  };

  // Determine current active stage (0 to 3) based on progress
  const activeStageIndex = Math.min(
    PLANT_STAGES.length - 1,
    progress < 25 ? 0 : progress < 55 ? 1 : progress < 85 ? 2 : 3
  );
  const currentStage = PLANT_STAGES[activeStageIndex];

  // Fluid liquid orb color transition
  const liquidHue = progress < 25 ? "#c2410c" : progress < 55 ? "#059669" : "#00E5FF";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          id="site-introduction"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-introduction-heading"
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-[100] flex min-h-[100svh] flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#030914] text-slate-100 select-none"
        >
          {/* Ambient Aquatic Caustics & Glowing Blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, mousePos.x * 2, 0],
                y: [0, mousePos.y * 2, 0],
                scale: [1, 1.1, 1],
                opacity: [0.18, 0.3, 0.18],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -left-24 h-[360px] w-[360px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#00E5FF]/20 blur-[90px] sm:blur-[120px]"
            />
            <motion.div
              animate={{
                x: [0, -mousePos.x * 1.8, 0],
                y: [0, -mousePos.y * 1.8, 0],
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/3 -right-20 h-[380px] w-[380px] sm:h-[540px] sm:w-[540px] rounded-full bg-[#0077B6]/30 blur-[100px] sm:blur-[130px]"
            />
            <div className="absolute -bottom-32 left-1/4 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] rounded-full bg-[#0096c7]/15 blur-[90px] sm:blur-[110px]" />

            {/* Micro Floating Bioluminescent Bubbles */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0">
                {[14, 32, 50, 68, 86, 24, 60, 76].map((leftPos, idx) => {
                  const size = 3 + (idx % 3) * 1.8;
                  const duration = 5.5 + (idx % 4) * 1.5;
                  const delay = (idx % 5) * 0.8;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ y: "105vh", opacity: 0 }}
                      animate={{
                        y: "-10vh",
                        x: [0, (idx % 2 === 0 ? 1 : -1) * 16, 0],
                        opacity: [0, 0.45, 0.6, 0.2, 0],
                      }}
                      transition={{
                        duration,
                        repeat: Infinity,
                        delay,
                        ease: "linear",
                      }}
                      style={{
                        left: `${leftPos}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                      className="absolute rounded-full border border-cyan-300/40 bg-gradient-to-t from-cyan-400/30 to-white/70 shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                    />
                  );
                })}
              </div>
            )}

            {/* Subtle Grid Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Top Bar Header (Optimized for Mobile & Desktop) */}
          <header className="relative z-10 mx-auto flex w-full max-w-[1640px] items-center justify-between px-3.5 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1.5 shadow-md shadow-cyan-500/10 backdrop-blur-md">
                <img
                  src="https://rpglobalprojects.com/wp-content/uploads/2025/08/cropped-cropped-imgi_34_LOGO-RPGP-removebg-preview.png"
                  alt="R P Global Projects logo"
                  className="h-full w-auto object-contain"
                />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#00E5FF]" />
                </span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-bold tracking-[0.04em] text-white sm:text-base">
                    R P GLOBAL
                  </span>
                  <span className="rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/15 px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[8.5px] sm:text-[9px] font-semibold tracking-wider text-[#00E5FF]">
                    PROJECTS
                  </span>
                </div>
                <span className="mt-0.5 block text-[8px] sm:text-[10px] font-medium tracking-[0.14em] uppercase text-cyan-200/70 truncate max-w-[170px] sm:max-w-none">
                  Water &amp; Wastewater EPC
                </span>
              </div>
            </div>

            {/* Live Status Badge (Hidden on very narrow mobile) & Skip Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-[11px] font-medium text-cyan-300 md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                <span>Simulating Treatment Cycle</span>
              </div>

              <button
                ref={skipButtonRef}
                type="button"
                onClick={finishIntro}
                className="group inline-flex min-h-8 sm:min-h-10 cursor-pointer items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-md transition-all hover:border-[#00E5FF] hover:bg-[#0077B6]/70 hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                aria-label="Skip site introduction (Escape)"
              >
                <span>Skip intro</span>
                <span className="hidden sm:inline-block rounded bg-white/20 px-1.5 py-0.5 text-[10px] text-cyan-200 transition-colors group-hover:bg-white/30">
                  Esc
                </span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* Main Visual Arena: Fully Responsive Layout */}
          <main className="relative z-10 mx-auto flex flex-col justify-center w-full max-w-[1640px] flex-1 gap-4 px-3.5 py-2 sm:px-6 sm:py-4 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-8 lg:py-6">
            
            {/* Left Column: Live Water Engineering Clarification Chamber */}
            <section className="flex flex-col justify-center">
              <div className="flex items-center justify-between sm:justify-start gap-2 mb-2 sm:mb-3">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400 backdrop-blur-sm"
                >
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 shrink-0" />
                  <span>CPCB / SPCB Zero-Discharge</span>
                </motion.div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 sm:hidden">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  <span>{currentStage.step}/04</span>
                </div>
              </div>

              <motion.h1
                id="site-introduction-heading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-lg font-bold leading-tight tracking-[-0.03em] text-white sm:text-2xl lg:text-3xl xl:text-4xl"
              >
                Water systems, engineered for{" "}
                <span className="bg-gradient-to-r from-[#00E5FF] via-[#00B4D8] to-[#90E0EF] bg-clip-text text-transparent">
                  the long run.
                </span>
              </motion.h1>

              {/* Water Clarification Chamber Orb & Telemetry Card */}
              <div className="mt-3 sm:mt-5 flex items-center gap-3 sm:gap-5">
                
                {/* Dynamic Water Vessel / Fluid Gauge Orb */}
                <div className="relative flex shrink-0 items-center justify-center">
                  <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 items-center justify-center">
                    {/* Rotating SVG Ring */}
                    <svg className="absolute inset-0 h-full w-full animate-spin [animation-duration:14s]" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.2"
                        strokeDasharray="4 8"
                        strokeOpacity="0.45"
                      />
                    </svg>

                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="3.5"
                      />
                      {/* Animated circular progress */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={liquidHue}
                        strokeWidth="3.5"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                      />
                    </svg>

                    {/* Fluid Glass Orb Core */}
                    <div className="relative flex h-18 w-18 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-[#081b33] to-[#040e1a] shadow-[inset_0_0_15px_rgba(0,229,255,0.25)]">
                      {/* Rising Liquid Wave */}
                      <div
                        className="absolute inset-x-0 bottom-0 transition-all duration-300 ease-out"
                        style={{ height: `${progress}%` }}
                      >
                        <div
                          className="h-full w-full opacity-85 transition-colors duration-700"
                          style={{
                            background:
                              progress < 25
                                ? "linear-gradient(to top, #7c2d12, #c2410c)"
                                : progress < 55
                                ? "linear-gradient(to top, #064e3b, #059669)"
                                : "linear-gradient(to top, #0077b6, #00E5FF)",
                          }}
                        />
                      </div>

                      {/* Inner Centered Percentage & Label */}
                      <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <Droplets className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-300 drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
                        <span className="font-mono text-base font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-2xl">
                          {Math.round(progress)}%
                        </span>
                        <span className="text-[7.5px] sm:text-[8.5px] font-semibold tracking-wider uppercase text-cyan-200/90">
                          Clarified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telemetry Stage Card */}
                <div className="flex-1 min-w-0 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 sm:p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 sm:pb-2">
                    <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-400">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                      Stage {currentStage.step} of 04
                    </span>
                    <span className="rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-medium text-cyan-300 truncate max-w-[120px] sm:max-w-none">
                      {currentStage.badge}
                    </span>
                  </div>

                  <h3 className="mt-1.5 sm:mt-2 text-xs sm:text-base font-semibold text-white truncate">
                    {currentStage.name}
                  </h3>
                  <p className="mt-0.5 hidden text-xs leading-4 text-slate-300 sm:block sm:leading-5">
                    {currentStage.shortDesc}
                  </p>

                  {/* Dynamic Technical Metrics Grid */}
                  <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-slate-900/60 p-1.5 sm:p-2">
                      <div className="text-[8.5px] sm:text-[9.5px] font-medium uppercase tracking-wider text-slate-400 truncate">
                        {currentStage.metric1.label}
                      </div>
                      <div className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-[#00E5FF]">
                        {currentStage.metric1.value}
                      </div>
                      <div className="text-[7.5px] sm:text-[8.5px] text-slate-400 truncate">{currentStage.metric1.note}</div>
                    </div>

                    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-slate-900/60 p-1.5 sm:p-2">
                      <div className="text-[8.5px] sm:text-[9.5px] font-medium uppercase tracking-wider text-slate-400 truncate">
                        {currentStage.metric2.label}
                      </div>
                      <div className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-emerald-400">
                        {currentStage.metric2.value}
                      </div>
                      <div className="text-[7.5px] sm:text-[8.5px] text-slate-400 truncate">{currentStage.metric2.note}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Holographic Plant Visual Showcase with Scanning Beam */}
            <section className="relative flex flex-col justify-center">
              <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#00E5FF]/25 bg-slate-900/80 p-1.5 sm:p-2 shadow-[0_0_40px_rgba(0,119,182,0.25)] backdrop-blur-xl">
                
                {/* Visual Viewport with responsive aspect ratio */}
                <div className="relative aspect-[16/9] sm:aspect-[16/10] max-h-[190px] sm:max-h-[300px] lg:max-h-none w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#081525]">
                  <Image
                    src={currentStage.image}
                    alt={currentStage.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Ambient Aquatic Tint & Deep Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030914] via-[#0077b6]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#030914]/40 via-transparent to-[#030914]/30" />

                  {/* Scanning Laser Beam Effect */}
                  {!prefersReducedMotion && (
                    <motion.div
                      animate={{ y: ["-10%", "110%"] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                      className="pointer-events-none absolute inset-x-0 h-12 sm:h-16 bg-gradient-to-b from-transparent via-[#00E5FF]/30 to-transparent shadow-[0_0_12px_#00E5FF]"
                    />
                  )}

                  {/* Holographic HUD Overlay Pins */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[8.5px] sm:text-[10px] font-semibold tracking-wide text-white shadow-md backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                    <span>RPGP EPC TELEMETRY</span>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2 py-0.5 sm:px-3 sm:py-1 text-[8.5px] sm:text-[10px] font-semibold text-emerald-300 shadow-md backdrop-blur-md">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>ISO 9001:2015</span>
                  </div>

                  {/* Bottom Info Banner */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-[#030914] via-[#030914]/80 to-transparent p-2.5 sm:p-4">
                    <div className="min-w-0 pr-2">
                      <div className="text-[8.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300 truncate">
                        {currentStage.technology}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {currentStage.imageAlt}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-slate-400">
                        Yield
                      </div>
                      <div className="font-mono text-sm sm:text-base font-bold text-[#00E5FF]">
                        {currentStage.purityIndex}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Interactive Plant Technology Tabs */}
                <div className="mt-1.5 sm:mt-2.5 grid grid-cols-4 gap-1 sm:gap-1.5 p-0.5">
                  {PLANT_STAGES.map((stg, idx) => {
                    const isActive = idx === activeStageIndex;
                    return (
                      <div
                        key={stg.step}
                        className={`rounded-lg sm:rounded-xl px-1.5 py-1 sm:py-2 text-center transition-all ${
                          isActive
                            ? "border border-[#00E5FF]/40 bg-[#0077B6]/30 text-white shadow-sm sm:shadow-md shadow-cyan-500/20"
                            : "border border-white/5 bg-white/[0.02] text-slate-400 opacity-60"
                        }`}
                      >
                        <div className="font-mono text-[8px] sm:text-[9px] font-semibold tracking-wider text-cyan-300">
                          {stg.step}
                        </div>
                        <div className="mt-0.5 truncate text-[8.5px] sm:text-[10px] font-medium">
                          {stg.shortName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>

          {/* Bottom Progress Bar & Milestones Footer (Responsive) */}
          <footer className="relative z-10 mx-auto w-full max-w-[1640px] px-3.5 pb-3 sm:px-6 sm:pb-6 lg:px-8">
            
            {/* 4 Sequenced Milestone Steppers */}
            <div className="mb-2 sm:mb-3 grid grid-cols-4 gap-1.5 sm:gap-2 text-center sm:text-left">
              {[
                { label: "Water Analysis", sub: "Influent", icon: Activity },
                { label: "Biological MBBR", sub: "Aeration", icon: Droplets },
                { label: "Reverse Osmosis", sub: "Membrane", icon: Sparkles },
                { label: "Zero Discharge", sub: "Compliant", icon: ShieldCheck },
              ].map((step, idx) => {
                const isPassed = progress >= (idx + 1) * 24;
                const isCurrent = activeStageIndex === idx;

                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <div
                      className={`flex h-4.5 w-4.5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-[9px] sm:text-xs font-bold transition-all mx-auto sm:mx-0 ${
                        isPassed
                          ? "bg-[#00E5FF] text-[#030914] shadow-[0_0_8px_rgba(0,229,255,0.7)]"
                          : isCurrent
                          ? "border border-[#00E5FF] bg-[#0077B6] text-white animate-pulse"
                          : "border border-white/20 bg-slate-900/60 text-slate-500"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> : idx + 1}
                    </div>

                    <div className="mt-0.5 sm:mt-0 text-center sm:text-left truncate">
                      <div className={`text-[8.5px] sm:text-[11px] font-semibold leading-tight truncate ${isCurrent ? "text-[#00E5FF]" : isPassed ? "text-slate-200" : "text-slate-500"}`}>
                        {step.label}
                      </div>
                      <div className="hidden sm:block text-[9px] text-slate-400">{step.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glowing Laser Progress Line */}
            <div className="relative h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5 shadow-inner">
              <motion.div
                style={{ width: `${progress}%` }}
                className="relative h-full rounded-full bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.9)] transition-all duration-150"
              >
                {/* Comet Leading Edge Flare */}
                <div className="absolute right-0 top-1/2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_#00E5FF]" />
              </motion.div>
            </div>

            {/* Footer Subtext */}
            <div className="mt-2 sm:mt-3 flex items-center justify-between text-[9.5px] sm:text-xs text-slate-400">
              <span className="flex items-center gap-1.5 truncate pr-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] shrink-0" />
                <span className="truncate">R P Global Projects — Turnkey Water &amp; Wastewater Solutions</span>
              </span>
              <span className="hidden sm:inline-block shrink-0">Press Esc to skip</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
