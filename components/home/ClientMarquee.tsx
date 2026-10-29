"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Car,
  Coffee,
  FlaskConical,
  Hotel,
  Pill,
  Shirt,
  Wheat,
  Zap,
  Droplets,
  Waves,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Gauge,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";
import { WaterWaveDivider } from "@/components/ui/WaterWaveDivider";
import { WaterFluidButton } from "@/components/ui/WaterFluidButton";
import { ClientMarqueeSectionData, SectorItemData } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Pill,
  Shirt,
  Coffee,
  Car,
  FlaskConical,
  Hotel,
  Zap,
  Building2,
  Wheat,
  SlidersHorizontal,
  Droplets,
  Waves,
};

export type SectorCategory = "all" | "heavy" | "process" | "civic";

export interface SectorProcessStep {
  title: string;
  desc: string;
}

export interface SectorItem {
  id: string;
  name: string;
  category: "heavy" | "process" | "civic";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  detail: string;
  badge: string;
  challenge: string;
  keyMetric: { label: string; value: string };
  secondaryMetric: { label: string; value: string };
  gradient: string;
  iconBg: string;
  borderColor: string;
  recommendedPlant: string;
  processSummary: string;
  steps: SectorProcessStep[];
}

const SECTORS: SectorItem[] = [
  {
    id: "pharma",
    name: "Pharmaceuticals",
    category: "process",
    icon: Pill,
    detail: "Ultra-pure WFI & Demin Water",
    badge: "USP & EP Pure Grade",
    challenge: "Endotoxins, Pyrogens, Heavy Metals & Sub-Micron Particles",
    keyMetric: { label: "Conductivity", value: "< 0.05 µS/cm" },
    secondaryMetric: { label: "Standards", value: "US-FDA / cGMP" },
    gradient: "from-[#6366f1] via-[#4f46e5] to-[#06b6d4]",
    iconBg: "bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-indigo-500/25",
    borderColor: "hover:border-indigo-400",
    recommendedPlant: "Demineralization (DM) Plants",
    processSummary:
      "Engineered multi-barrier purification combining double-pass sanitary reverse osmosis with chemical-free electrodeionization (EDI) and 185nm UV irradiation for pyrogen-free Water for Injection.",
    steps: [
      {
        title: "Sanitary Pre-Treatment",
        desc: "Activated carbon filtration & hot-water sanitizable media reducing free chlorine & silt density.",
      },
      {
        title: "Double-Pass Sanitary RO",
        desc: "High-rejection brackish membranes in 316L SS housing removing >99.2% dissolved ionic species.",
      },
      {
        title: "Electrodeionization (EDI)",
        desc: "Continuous electro-regeneration delivering demineralized water with conductivity < 0.05 µS/cm.",
      },
      {
        title: "UV Sanitization & UF",
        desc: "Dual-wavelength 185/254nm ultraviolet lamps and 6,000 Dalton ultrafiltration for endotoxin removal.",
      },
    ],
  },
  {
    id: "textiles",
    name: "Textiles & Dyeing",
    category: "heavy",
    icon: Shirt,
    detail: "Colour & TDS Recovery ZLD",
    badge: "96.5% Closed-Loop ZLD",
    challenge: "Refractory Azo Dyes, Salt TDS (15,000+ ppm) & Extreme Chemical COD",
    keyMetric: { label: "Water Recovery", value: "96.5% Reuse" },
    secondaryMetric: { label: "Effluent Standard", value: "Zero Liquid Discharge" },
    gradient: "from-[#0284c7] via-[#0369a1] to-[#ec4899]",
    iconBg: "bg-gradient-to-br from-sky-500 to-pink-500 shadow-sky-500/25",
    borderColor: "hover:border-sky-400",
    recommendedPlant: "Effluent Treatment Plants (ETP)",
    processSummary:
      "Zero Liquid Discharge (ZLD) train combining colour coagulation, biological treatment, high-pressure RO membranes, and mechanical vapour recompression where required.",
    steps: [
      {
        title: "Physico-Chemical De-color",
        desc: "Flash coagulation using specialty decoloring polymers and ferric flocculation to precipitate dyes.",
      },
      {
        title: "Aerobic MBBR Bio-Reactor",
        desc: "Fluidized high-surface bio-carriers breaking down complex surfactant organics and COD load.",
      },
      {
        title: "Multi-Stage High Recovery RO",
        desc: "80-bar high-pressure membranes capturing clean permeate for immediate dye-bath recycling.",
      },
      {
        title: "MVR Evaporator & ATFD",
        desc: "Thermal concentration recovering solid sodium chloride salts for dry disposal according to CPCB norms.",
      },
    ],
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    category: "process",
    icon: Coffee,
    detail: "Sanitary RO & Effluent Recycling",
    badge: "Sanitary 316L SS Grade",
    challenge: "High Organic COD/BOD, Starch, Dairy Emulsions & Caustic CIP Effluent",
    keyMetric: { label: "BOD Reduction", value: "> 98% Permeate" },
    secondaryMetric: { label: "Sanitary Spec", value: "CIP Auto-Sanitize" },
    gradient: "from-[#f59e0b] via-[#d97706] to-[#0ea5e9]",
    iconBg: "bg-gradient-to-br from-amber-500 to-sky-500 shadow-amber-500/25",
    borderColor: "hover:border-amber-400",
    recommendedPlant: "Effluent Treatment Plants (ETP)",
    processSummary:
      "Food-grade sanitary processing that purifies process washwater and effluent through high-efficiency Dissolved Air Flotation (DAF), biological stabilization, and two-pass reverse osmosis.",
    steps: [
      {
        title: "DAF Clarification",
        desc: "Micro-bubble dissolved air flotation stripping >95% suspended fats, edible oils, and grease.",
      },
      {
        title: "Biological Stabilization",
        desc: "High-rate extended aeration decomposing starches and sugars into inert, non-odorous biomass.",
      },
      {
        title: "Ultrafiltration Membrane",
        desc: "Hollow-fiber barrier retaining bacteria, yeast cells, and colloidal turbidity.",
      },
      {
        title: "Sanitary RO Permeate Polish",
        desc: "Full stainless-steel skid producing high-purity water for boiler feed, cooling, and utility circuits.",
      },
    ],
  },
  {
    id: "chemical-processing",
    name: "Chemical Processing",
    category: "heavy",
    icon: FlaskConical,
    detail: "Heavy Metal Precipitation",
    badge: "Zero Hazardous Discharge",
    challenge: "Corrosive Acid Streams, Toxic Heavy Metals (Cr, Ni, Cu) & Volatiles",
    keyMetric: { label: "Heavy Metals", value: "< 0.05 mg/L (Nil)" },
    secondaryMetric: { label: "Compliance", value: "SPCB CTO Approved" },
    gradient: "from-[#10b981] via-[#059669] to-[#0284c7]",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25",
    borderColor: "hover:border-emerald-400",
    recommendedPlant: "Effluent Treatment Plants (ETP)",
    processSummary:
      "Heavy industrial wastewater neutralization system with automated multi-reagent dosing, heavy metal co-precipitation, lamella clarification, and recessed-plate sludge filter presses.",
    steps: [
      {
        title: "Automated pH Equalization",
        desc: "Multi-compartment neutralization with automated lime/acid dosing controlled via dual pH loops.",
      },
      {
        title: "Heavy Metal Co-Precipitation",
        desc: "Chemical conversion of soluble trivalent/hexavalent chrome, nickel, and copper into insoluble flocs.",
      },
      {
        title: "High-Rate Lamella Settling",
        desc: "Inclined honeycomb plates increase settling area before downstream filtration.",
      },
      {
        title: "Sludge Cake Dehydration",
        desc: "High-pressure hydraulic filter presses yielding non-leachable dry cake for safe TSDF disposal.",
      },
    ],
  },
  {
    id: "automotive",
    name: "Automotive & Eng",
    category: "heavy",
    icon: Car,
    detail: "Oil-Grease & Paint Shop ETP",
    badge: "Oil & Grease < 5 mg/L",
    challenge: "Emulsified Cutting Fluids, Phosphating Rinses & Paint Pigments",
    keyMetric: { label: "Oil Separation", value: "< 5 ppm (99.9%)" },
    secondaryMetric: { label: "Wash Recovery", value: "90% Degrease Loop" },
    gradient: "from-[#2563eb] via-[#1d4ed8] to-[#0ea5e9]",
    iconBg: "bg-gradient-to-br from-blue-600 to-sky-500 shadow-blue-500/25",
    borderColor: "hover:border-blue-400",
    recommendedPlant: "Effluent Treatment Plants (ETP)",
    processSummary:
      "Engineered treatment train utilizing corrugated plate interceptors, emulsion-cracking coagulation, ceramic ultrafiltration, and active carbon polishing for automotive assembly plants.",
    steps: [
      {
        title: "CPI Oil & Grease Interceptor",
        desc: "Corrugated plate packs coalescing and skimming free-floating petroleum hydrocarbons.",
      },
      {
        title: "Chemical Emulsion Cracking",
        desc: "Acidification and specialized coagulants destabilizing microscopic oil droplets.",
      },
      {
        title: "Paint Sludge Coagulation",
        desc: "Denaturing agents detackifying overspray paint resins for automated mechanical dewatering.",
      },
      {
        title: "Ultrafiltration & RO Polish",
        desc: "Crossflow filtration stripping all organics and ions, returning water to pre-treatment rinse tanks.",
      },
    ],
  },
  {
    id: "townships",
    name: "Commercial Townships",
    category: "civic",
    icon: Building2,
    detail: "MBBR/SBR Sewage Plants",
    badge: "100% Odourless STP",
    challenge: "Surge Flow Fluctuations, High Biological Pathogens & Strict Odour Limits",
    keyMetric: { label: "Treated BOD", value: "< 5 mg/L" },
    secondaryMetric: { label: "Dual Plumbing", value: "Flushing & Landscape" },
    gradient: "from-[#06b6d4] via-[#0891b2] to-[#0d9488]",
    iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-cyan-500/25",
    borderColor: "hover:border-cyan-400",
    recommendedPlant: "Sewage Treatment Plants (STP)",
    processSummary:
      "Compact biological sewage treatment utilizing fluidized media MBBR / SBR technology with subterranean installation, acoustic enclosures, and multi-media filtration for complete water reuse.",
    steps: [
      {
        title: "Mechanical Screening",
        desc: "Rotary fine screens and automated grit chambers removing rags, plastics, and coarse sediments.",
      },
      {
        title: "Fluidized MBBR Bio-Reactor",
        desc: "Virgin HDPE bio-carriers with 550 m²/m³ protected surface area digesting nitrogen & BOD.",
      },
      {
        title: "Tube Settler & Sludge Recycle",
        desc: "Compact clarification tank separating clear water from biomass with automatic sludge return.",
      },
      {
        title: "Sand, Carbon & Ozonation",
        desc: "Multi-grade filtration followed by ozone disinfection providing sparkling, pathogen-free water.",
      },
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality & Hotels",
    category: "civic",
    icon: Hotel,
    detail: "Greywater Flushing Recirc",
    badge: "Silent Sub-Basement",
    challenge: "Laundry Detergents, High Kitchen Grease & Stringent Space Constraints",
    keyMetric: { label: "Freshwater Saved", value: "Up to 70% Cut" },
    secondaryMetric: { label: "Acoustics", value: "< 48 dB Whisper" },
    gradient: "from-[#38bdf8] via-[#0284c7] to-[#6366f1]",
    iconBg: "bg-gradient-to-br from-sky-400 to-indigo-600 shadow-sky-500/25",
    borderColor: "hover:border-sky-400",
    recommendedPlant: "Sewage Treatment Plants (STP)",
    processSummary:
      "Whisper-quiet, ultra-compact membrane bioreactor (MBR) system installed in hotel basements with zero odor footprint, saving tens of thousands of liters of fresh water daily.",
    steps: [
      {
        title: "Automatic Grease Separation",
        desc: "Multi-stage motorized kitchen grease traps preventing fat and soap accumulation.",
      },
      {
        title: "Submerged MBR Filtration",
        desc: "0.04-micron hollow fiber membranes replacing secondary clarifiers within a 50% smaller footprint.",
      },
      {
        title: "Catalytic Ozonation",
        desc: "Direct ozonation neutralizing surfactants, hotel laundry bleaching agents, and perfumes.",
      },
      {
        title: "Pressurized Dual-Line Booster",
        desc: "Automated hydro-pneumatic pumping for HVAC cooling and flush lines.",
      },
    ],
  },
  {
    id: "municipal",
    name: "Municipal Clean Water",
    category: "civic",
    icon: Droplets,
    detail: "Surface Clarification & WTP",
    badge: "WHO & BIS 10500 Pure",
    challenge: "Monsoon Turbidity, River Silt, Algal Blooms & Coliform Pathogens",
    keyMetric: { label: "Turbidity", value: "< 0.2 NTU" },
    secondaryMetric: { label: "Capacity Scale", value: "1 – 50 MLD Plants" },
    gradient: "from-[#0284c7] via-[#0077b6] to-[#0369a1]",
    iconBg: "bg-gradient-to-br from-sky-600 to-blue-700 shadow-sky-600/25",
    borderColor: "hover:border-blue-400",
    recommendedPlant: "Water Treatment Plants (WTP)",
    processSummary:
      "High-capacity surface water treatment plants engineering coagulation, flocculation, tube settling, rapid gravity sand filters, and gas chlorination for public drinking infrastructure.",
    steps: [
      {
        title: "Raw Water Flash Mixing",
        desc: "Hydraulic jumps and PAC/alum dosing destabilizing colloidal turbidity in large raw water volumes.",
      },
      {
        title: "Pulsator & Tube Settling",
        desc: "Laminar-flow settling chambers removing 98% of suspended clay, silt, and algae.",
      },
      {
        title: "Rapid Gravity Sand Filters",
        desc: "Multi-graded quartz sand and anthracite coal filters capturing ultra-fine residual particles.",
      },
      {
        title: "Disinfection & Distribution",
        desc: "Gas chlorination skids maintaining mandated residual chlorine across town distribution networks.",
      },
    ],
  },
  {
    id: "agro-sugar",
    name: "Agro & Sugar Mills",
    category: "process",
    icon: Wheat,
    detail: "Condensate Polishing CPU",
    badge: "High-Temp CPU Polishing",
    challenge: "Elevated Temperature (65°C+), Sucrose Sugars & Volatile Organics",
    keyMetric: { label: "Condensate Reuse", value: "95% Returned" },
    secondaryMetric: { label: "Silica Reduction", value: "< 0.02 ppm" },
    gradient: "from-[#059669] via-[#047857] to-[#d97706]",
    iconBg: "bg-gradient-to-br from-emerald-600 to-amber-600 shadow-emerald-600/25",
    borderColor: "hover:border-emerald-400",
    recommendedPlant: "Demineralization (DM) Plants",
    processSummary:
      "Thermal condensate polishing units (CPU) that treat boiling pan and evaporator condensate, removing sucrose sugar carryover and hardness to return high-value water to high-pressure boilers.",
    steps: [
      {
        title: "Thermal Pre-Cooling",
        desc: "Plate heat exchangers capturing process thermal energy prior to resin polisher beds.",
      },
      {
        title: "Macroporous Carbon Filter",
        desc: "High-adsorption beds removing trace caramel sugars and volatile organic acids.",
      },
      {
        title: "High-Temp Ion Exchange",
        desc: "Specialty cross-linked resin beads stripping mineral cations and hardness at high temperature.",
      },
      {
        title: "Boiler Feed Re-injection",
        desc: "Closed-loop condensate feed generating huge fuel savings in sugar co-generation boilers.",
      },
    ],
  },
  {
    id: "power-energy",
    name: "Power & Energy",
    category: "heavy",
    icon: Zap,
    detail: "Boiler Feed Water Demin",
    badge: "Supercritical Boiler Grade",
    challenge: "Extreme Scale-Forming Reactive Silica, Hardness Ions & Boiler Corrosion",
    keyMetric: { label: "Conductivity", value: "< 0.08 µS/cm" },
    secondaryMetric: { label: "Reactive Silica", value: "< 0.01 ppm" },
    gradient: "from-[#f59e0b] via-[#d97706] to-[#06b6d4]",
    iconBg: "bg-gradient-to-br from-amber-500 to-cyan-500 shadow-amber-500/25",
    borderColor: "hover:border-amber-400",
    recommendedPlant: "Demineralization (DM) Plants",
    processSummary:
      "Ultra-pure water demineralization systems combining ultrafiltration, twin-pass reverse osmosis, strong acid/base ion exchange, and mixed bed polishers for high-pressure power plant steam turbines.",
    steps: [
      {
        title: "Ultrafiltration SDI Barrier",
        desc: "0.02-micron membrane removing colloidal silica to target a Silt Density Index (SDI) below 2.5.",
      },
      {
        title: "Two-Pass Brackish RO",
        desc: "High-rejection brackish membranes stripping 99.4% dissolved ions and total dissolved solids.",
      },
      {
        title: "Primary Cation & Anion DM",
        desc: "Twin-tower ion exchange columns packed with high-capacity nuclear-grade resins.",
      },
      {
        title: "Mixed Bed Polish (MB)",
        desc: "Final polishing column delivering sub-0.08 µS/cm conductivity and < 0.01 ppm reactive silica.",
      },
    ],
  },
];

interface ClientMarqueeProps {
  data?: Partial<ClientMarqueeSectionData>;
  onOpenRFQ?: (plantType?: string) => void;
}

export const ClientMarquee: React.FC<ClientMarqueeProps> = ({ data, onOpenRFQ }) => {
  const badge = data?.badge || "Where Our Water Systems Work";
  const title = data?.title || "Engineered water infrastructure for critical industries.";
  const description =
    data?.description ||
    "Inlet chemical matrices and discharge compliance standards vary widely across sectors. Process engineering always starts with your unique effluent and water analysis.";

  const sectors: SectorItem[] =
    data?.sectors && data.sectors.length > 0
      ? data.sectors.map((s: SectorItemData) => ({
          ...s,
          icon: ICON_MAP[s.iconName] || Building2,
        }))
      : SECTORS;

  const [activeCategory, setActiveCategory] = useState<SectorCategory>("all");
  const [selectedSector, setSelectedSector] = useState<SectorItem | null>(null);

  // Filter sectors based on selected category tab
  const filteredSectors =
    activeCategory === "all"
      ? sectors
      : sectors.filter((s) => s.category === activeCategory);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSector(null);
      }
    };
    if (selectedSector) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSector]);

  return (
    <section className="relative overflow-hidden">
      <WaterBackgroundEffect variant="coastal" className="pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/30 bg-white/85 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-md shadow-sm">
                <Waves className="h-3.5 w-3.5 text-[#0077b6] animate-pulse" />
                <span>{badge}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              </div>

              <h2 className="mt-3.5 text-2xl font-bold tracking-tight text-[#0f2d38] sm:text-3xl lg:text-4xl">
                {title}
              </h2>
              <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#45616b]">
                {description}
              </p>
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#bce1f1]/80 bg-white/70 p-1.5 backdrop-blur-md shadow-sm">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`relative min-h-11 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeCategory === "all"
                    ? "bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/30"
                    : "text-[#45616b] hover:text-[#0f2d38] hover:bg-white/60"
                }`}
              >
                All Sectors ({SECTORS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("heavy")}
                className={`relative min-h-11 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeCategory === "heavy"
                    ? "bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/30"
                    : "text-[#45616b] hover:text-[#0f2d38] hover:bg-white/60"
                }`}
              >
                Manufacturing & Energy (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("process")}
                className={`relative min-h-11 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeCategory === "process"
                    ? "bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/30"
                    : "text-[#45616b] hover:text-[#0f2d38] hover:bg-white/60"
                }`}
              >
                Biotech & Process (3)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("civic")}
                className={`relative min-h-11 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeCategory === "civic"
                    ? "bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/30"
                    : "text-[#45616b] hover:text-[#0f2d38] hover:bg-white/60"
                }`}
              >
                Townships & Civic (3)
              </button>
            </div>
          </motion.div>

          {/* Sectors Grid with Rich Hydro-Cards */}
          <motion.div
            layout
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredSectors.map((sector) => {
                const Icon = sector.icon;
                return (
                  <motion.div
                    key={sector.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    onClick={() => setSelectedSector(sector)}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,119,182,0.07)] backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,119,182,0.18)] cursor-pointer ${sector.borderColor}`}
                  >
                    {/* Top ambient color bar for each industry */}
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${sector.gradient} opacity-75 group-hover:opacity-100 transition-opacity`}
                    />

                    {/* Subtle hydro-wave shimmer in background on hover */}
                    <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-tr from-[#00E5FF]/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1 ${sector.iconBg}`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2.2} />
                        </div>
                        <span className="rounded-full border border-[#0077b6]/20 bg-[#0077b6]/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#0077b6]">
                          {sector.badge}
                        </span>
                      </div>

                      {/* Title & Core Solution */}
                      <div className="mt-4">
                        <h3 className="text-base font-bold text-[#0f2d38] group-hover:text-[#0077b6] transition-colors leading-tight">
                          {sector.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-[#45616b] leading-relaxed">
                          {sector.detail}
                        </p>
                      </div>

                      {/* Technical Parameter Chip */}
                      <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg border border-[#bce1f1]/60 bg-[#f0f9ff]/70 px-2.5 py-1 text-[11px] font-semibold text-[#0077b6]">
                        <Gauge className="h-3 w-3 text-[#0077b6]" />
                        <span>{sector.keyMetric.label}:</span>
                        <span className="font-bold text-[#0f2d38]">{sector.keyMetric.value}</span>
                      </div>
                    </div>

                    {/* Card Footer: Interactive specs CTA */}
                    <div className="mt-5 border-t border-[#bce1f1]/50 pt-3 flex items-center justify-between text-xs font-semibold text-[#0077b6]">
                      <span className="text-[11px] font-medium text-[#45616b] group-hover:text-[#0077b6] transition-colors">
                        Inspect Flow Architecture
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077b6]/10 text-[#0077b6] group-hover:bg-[#0077b6] group-hover:text-white transition-all group-hover:translate-x-1">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Quick Engineering Summary Strip */}
          <div className="mt-8 rounded-2xl border border-[#bce1f1]/70 bg-gradient-to-r from-white/90 via-[#f0f9ff]/90 to-white/90 p-4 backdrop-blur-md shadow-sm sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0077b6]/10 text-[#0077b6]">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-xs sm:text-sm text-[#0f2d38]">
                <span className="font-bold">Need customized inlet chemistry design?</span> Every system is modeled with pilot scale water analysis, simulation software & SPCB discharge compliance.
              </p>
            </div>
            {onOpenRFQ && (
              <WaterFluidButton
                id="client-marquee-sizing-btn"
                size="sm"
                className="mt-3 sm:mt-0 shrink-0 px-4 py-2 text-xs font-bold"
                onClick={() => onOpenRFQ("Effluent Treatment Plants (ETP)")}
              >
                <span>Request Plant Sizing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </WaterFluidButton>
            )}
          </div>
        </div>
      </WaterBackgroundEffect>

      {/* High-Fidelity Engineering Flow Inspector Modal */}
      <AnimatePresence>
        {selectedSector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSector(null)}
              className="fixed inset-0 bg-[#071324]/65 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-[#bce1f1] bg-white shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header Gradient */}
              <div
                className={`relative px-6 py-6 text-white bg-gradient-to-r ${selectedSector.gradient}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
                      {React.createElement(selectedSector.icon, {
                        className: "h-6 w-6 text-white",
                        strokeWidth: 2.2,
                      })}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        <span>{selectedSector.badge}</span>
                      </div>
                      <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                        {selectedSector.name}
                      </h3>
                      <p className="text-xs text-white/90 font-medium">
                        {selectedSector.detail}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSector(null)}
                    aria-label="Close modal"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 hover:scale-105"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Summary & Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="rounded-2xl border border-[#bce1f1]/70 bg-[#f0f9ff]/70 p-3.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0077b6]">
                      {selectedSector.keyMetric.label}
                    </span>
                    <span className="mt-1 block text-lg font-bold text-[#0f2d38]">
                      {selectedSector.keyMetric.value}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#bce1f1]/70 bg-[#f0f9ff]/70 p-3.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0077b6]">
                      {selectedSector.secondaryMetric.label}
                    </span>
                    <span className="mt-1 block text-lg font-bold text-[#0f2d38]">
                      {selectedSector.secondaryMetric.value}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#bce1f1]/70 bg-[#f0f9ff]/70 p-3.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0077b6]">
                      Recommended Plant
                    </span>
                    <span className="mt-1 block text-sm font-bold text-[#0f2d38] truncate">
                      {selectedSector.recommendedPlant}
                    </span>
                  </div>
                </div>

                {/* Challenge & Inlet Effluent Chemistry */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        Inlet Stream & Effluent Challenge
                      </h4>
                      <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                        {selectedSector.challenge}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Treatment Architecture Narrative */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0077b6]">
                    Engineered Process Overview
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#45616b] leading-relaxed">
                    {selectedSector.processSummary}
                  </p>
                </div>

                {/* 4-Stage Treatment Flow Diagram */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f2d38] mb-3">
                    4-Stage RP Global Treatment Flow Architecture
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSector.steps.map((step, idx) => (
                      <div
                        key={step.title}
                        className="relative rounded-2xl border border-[#bce1f1]/60 bg-white p-4 shadow-sm hover:border-[#0077b6] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0077b6] text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#0f2d38]">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#45616b] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="border-t border-[#bce1f1]/60 bg-[#f8fafc] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#45616b]">
                  <ShieldCheck className="h-4 w-4 text-[#0077b6]" />
                  <span>Compliant with CPCB, SPCB & ISO Standards</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSector(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#45616b] hover:text-[#0f2d38] transition-colors"
                  >
                    Close
                  </button>
                  {onOpenRFQ && (
                    <WaterFluidButton
                      id="client-marquee-sector-rfq-btn"
                      size="sm"
                      className="px-5 py-2.5 text-xs font-bold"
                      onClick={() => {
                        const plantType = selectedSector.recommendedPlant;
                        setSelectedSector(null);
                        onOpenRFQ(plantType);
                      }}
                    >
                      <span>Request {selectedSector.name} Plant Proposal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </WaterFluidButton>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Organic transition wave into the dark industrial ocean footer */}
      <WaterWaveDivider
        position="bottom"
        fillColor="#071324"
        accentColor="#00E5FF"
        height={52}
      />
    </section>
  );
};
