"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  CalendarDays,
  Activity,
  Waves,
  Droplets,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { api } from "@/lib/api";
import { ProjectGallery } from "@/lib/types";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

interface ProjectsTrackerProps {
  onOpenRFQ?: (plantType?: string, capacityKLD?: number) => void;
}

export function resolvePlantImage(imageUrl?: string, category?: string): string {
  const candidate = imageUrl?.trim();
  if (candidate) {
    if (
      /^https?:\/\//i.test(candidate) ||
      candidate.startsWith("/images/") ||
      candidate.startsWith("/uploads/") ||
      candidate.startsWith("blob:") ||
      candidate.startsWith("data:")
    ) {
      return candidate;
    }
  }

  switch (category) {
    case "ETP Plants":
      return "/images/plant-etp.jpg";
    case "STP Plants":
      return "/images/plant-stp.jpg";
    case "RO Systems":
    case "DM Plants":
    case "Water Softeners":
      return "/images/plant-ro.jpg";
    case "WTP Plants":
      return "/images/plant-etp.jpg";
    default:
      return "/images/plant-etp.jpg";
  }
}

// Fallback high-fidelity project data
const FALLBACK_PROJECTS: ProjectGallery[] = [
  {
    _id: "fall-1",
    title: "1,200 KLD Industrial Zero Liquid Discharge (ZLD) Plant with MEE",
    category: "ETP Plants",
    capacityKLD: "1,200 KLD",
    location: "Dahej PCPIR, Gujarat",
    clientSector: "Petrochemicals & Specialty Chemicals",
    imageUrl: "/images/plant-etp.jpg",
    images: [
      "/images/plant-etp.jpg",
      "/images/plant-etp.jpeg",
      "/images/hero-plant-2.jpeg",
      "/images/hero-bg.jpg",
    ],
    status: "RUNNING",
    progressPercentage: 78,
    currentStage: "Multi-Effect Evaporator Skid & Titanium Heat Exchanger Assembly",
    expectedCompletion: "December 2026",
    keyHighlights: ["Zero Liquid Discharge Assured", "Condensate Recovery 96%", "SCADA Controlled Automation"],
    completionYear: 2026,
    isFeatured: true,
    order: 1,
  },
  {
    _id: "fall-2",
    title: "800 KLD Submerged Aerobic Fixed Film (SAFF) STP Plant",
    category: "STP Plants",
    capacityKLD: "800 KLD",
    location: "Manesar, Haryana",
    clientSector: "Automotive Manufacturing Campus",
    imageUrl: "/images/plant-stp.jpg",
    images: [
      "/images/plant-stp.jpg",
      "/images/plant-stp.jpeg",
      "/images/hero-plant-1.webp",
    ],
    status: "RUNNING",
    progressPercentage: 55,
    currentStage: "Civil Reactor Tank Casting & Fine Bubble Diffuser Grid Installation",
    expectedCompletion: "November 2026",
    keyHighlights: ["Cooling Tower Reuse Spec", "BOD < 5 mg/L", "Dual Media Pressure Sand Filtration"],
    completionYear: 2026,
    isFeatured: true,
    order: 2,
  },
  {
    _id: "fall-3",
    title: "40 m³/hr High-Recovery Industrial RO & EDI Skid",
    category: "RO Systems",
    capacityKLD: "960 KLD",
    location: "Baddi, Himachal Pradesh",
    clientSector: "Pharmaceutical Sterile API",
    imageUrl: "/images/plant-ro.jpg",
    images: [
      "/images/plant-ro.jpg",
      "/images/plant-dm.jpeg",
      "/images/plant-softener.jpeg",
    ],
    status: "RUNNING",
    progressPercentage: 88,
    currentStage: "Membrane Loading, Hydrostatic Pressure Test & Calibration",
    expectedCompletion: "October 2026",
    keyHighlights: ["Conductivity < 0.1 µS/cm", "Dow Filmtec Membranes", "SS 316L Sanitary Piping"],
    completionYear: 2026,
    isFeatured: true,
    order: 3,
  },
  {
    _id: "fall-4",
    title: "500 KLD MBBR Sewage Treatment Plant",
    category: "STP Plants",
    capacityKLD: "500 KLD",
    location: "Greater Noida, UP",
    clientSector: "Residential High-Rise Society",
    imageUrl: "/images/plant-stp.jpg",
    images: [
      "/images/plant-stp.jpg",
      "/images/plant-stp.jpeg",
      "/images/hero-plant-2.jpeg",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2024",
    keyHighlights: ["CPCB Norms Certified", "BOD < 10 mg/L", "Automated Bio-Carrier Fluidization"],
    completionYear: 2024,
    isFeatured: true,
    order: 4,
  },
  {
    _id: "fall-5",
    title: "250 KLD Industrial Effluent Treatment & Sludge Dewatering Plant",
    category: "ETP Plants",
    capacityKLD: "250 KLD",
    location: "Bhiwadi, Rajasthan",
    clientSector: "Textile Dyeing & Processing",
    imageUrl: "/images/plant-etp.jpg",
    images: [
      "/images/plant-etp.jpg",
      "/images/plant-etp.jpeg",
      "/images/hero-bg.jpg",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2023",
    keyHighlights: ["Recessed Chamber Filter Press", "Color & Heavy Metal Removal 99%"],
    completionYear: 2023,
    isFeatured: true,
    order: 5,
  },
  {
    _id: "fall-6",
    title: "50 m³/hr Two-Bed Demineralization (DM) Plant with Mixed Bed",
    category: "DM Plants",
    capacityKLD: "1,200 KLD",
    location: "Panipat, Haryana",
    clientSector: "Thermal Power & Boiler Feed",
    imageUrl: "/images/plant-ro.jpg",
    images: [
      "/images/plant-ro.jpg",
      "/images/plant-dm.jpeg",
      "/images/plant-softener-2.jpg",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2023",
    keyHighlights: ["Silica < 0.02 ppm", "Conductivity < 0.2 µS/cm", "Degasser Tower Integration"],
    completionYear: 2023,
    isFeatured: true,
    order: 6,
  },
  {
    _id: "fall-7",
    title: "5 MLD Municipal River Intake Water Treatment Plant (WTP)",
    category: "WTP Plants",
    capacityKLD: "5,000 KLD",
    location: "Gopalganj, Bihar",
    clientSector: "Municipal Potable Water Supply",
    imageUrl: "/images/plant-etp.jpg",
    images: [
      "/images/plant-wtp.jpg",
      "/images/plant-etp.jpg",
      "/images/hero-plant-1.webp",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2022",
    keyHighlights: ["Rapid Gravity Sand Filters", "Pulsator Clarifier", "IS 10500 Drinking Water Norms"],
    completionYear: 2022,
    isFeatured: true,
    order: 7,
  },
];

const CATEGORIES = ["ALL", "ETP Plants", "STP Plants", "RO Systems", "DM Plants", "WTP Plants"];

const STATUS_LABELS = {
  RUNNING: "In progress",
  COMPLETED: "Commissioned",
} as const;

const ProjectImage: React.FC<{ project: ProjectGallery }> = ({ project }) => {
  const fallback = resolvePlantImage(undefined, project.category);
  const [src, setSrc] = useState(() => resolvePlantImage(project.imageUrl, project.category));

  return (
    <Image
      src={src}
      alt={`${project.category} project: ${project.title}`}
      fill
      unoptimized={/^https?:\/\//i.test(src)}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

const GalleryThumbnail: React.FC<{
  img: string;
  idx: number;
  isActive: boolean;
  onSelect: () => void;
  category?: string;
}> = ({ img, idx, isActive, onSelect, category }) => {
  const fallback = resolvePlantImage(undefined, category);
  const [src, setSrc] = useState(() => resolvePlantImage(img, category));

  useEffect(() => {
    setSrc(resolvePlantImage(img, category));
  }, [img, category]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative h-16 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
        isActive
          ? "border-[#00B4D8] scale-105 shadow-lg shadow-[#0077B6]/30 opacity-100"
          : "border-transparent opacity-60 hover:opacity-100"
      }`}
    >
      <Image
        src={src}
        alt={`Thumbnail ${idx + 1}`}
        fill
        className="object-cover"
        unoptimized
        onError={() => setSrc(fallback)}
      />
    </button>
  );
};

const ProjectCard: React.FC<{
  project: ProjectGallery;
  onOpenRFQ?: ProjectsTrackerProps["onOpenRFQ"];
  onOpenGallery?: (project: ProjectGallery) => void;
}> = ({ project, onOpenRFQ, onOpenGallery }) => {
  const isRunning = (project.status || "COMPLETED") === "RUNNING";
  const progress = project.progressPercentage || (isRunning ? 65 : 100);
  const handoverYear = project.completionYear || 2024;
  const capacity = Number.parseInt(project.capacityKLD?.replace(/[^\d]/g, "") || "", 10) || 100;
  const photoCount = project.images && project.images.length > 0 ? project.images.length : 1;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#bce1f1]/80 bg-white shadow-[0_2px_12px_rgba(0,119,182,0.06)] transition-all duration-300 hover:border-[#0077B6]/50 hover:shadow-[0_12px_30px_rgba(0,119,182,0.12)]"
    >
      {/* Compact Image Header */}
      <div
        className="relative h-40 overflow-hidden bg-[#e5ece8] sm:h-44 cursor-pointer"
        onClick={() => onOpenGallery?.(project)}
      >
        <ProjectImage key={`${project._id}-${project.imageUrl}`} project={project} />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/75 to-transparent" />
        
        {/* Status Badge */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold shadow-xs backdrop-blur-md ${
            isRunning
              ? "border-amber-300/80 bg-amber-50/95 text-amber-900"
              : "border-emerald-300/80 bg-emerald-50/95 text-emerald-900"
          }`}
        >
          {isRunning ? (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span>In Progress</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Commissioned</span>
            </>
          )}
        </span>

        {/* Capacity Tag */}
        <span className="absolute right-3 top-3 rounded-md bg-slate-900/80 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-200 shadow-xs backdrop-blur-md">
          {project.capacityKLD}
        </span>

        {/* Category Pill */}
        <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 drop-shadow-xs">
          {project.category}
        </span>

        {/* Photo Gallery Pill on Image */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenGallery?.(project);
          }}
          className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-md transition-colors hover:bg-[#0077B6] cursor-pointer"
          title="View project photo gallery"
          aria-label={`View ${photoCount} photos for ${project.title}`}
        >
          <Camera className="h-3 w-3" />
          <span>{photoCount} Photos</span>
        </button>
      </div>

      {/* Streamlined Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-4.5">
        <h3
          onClick={() => onOpenGallery?.(project)}
          className="text-sm sm:text-[15px] font-bold leading-snug tracking-tight text-[#0f2d38] transition-colors group-hover:text-[#0077B6] line-clamp-1 cursor-pointer"
        >
          {project.title}
        </h3>

        {/* Location & Sector Row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#526a72]">
          <span className="inline-flex items-center gap-1.5 truncate max-w-[160px]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0077B6]" />
            <span className="truncate">{project.location}</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5 truncate max-w-[160px]">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-[#0077B6]" />
            <span className="truncate">{project.clientSector}</span>
          </span>
        </div>

        {/* Dynamic Status / Progress Strip */}
        {isRunning ? (
          <div className="mt-3 border-t border-slate-100 pt-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-500">Progress</span>
              <span className="font-mono text-xs font-bold text-[#0077B6]">{progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200/50">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#10B981]"
              />
            </div>
            {project.expectedCompletion && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                <CalendarDays className="h-3 w-3 text-[#0077B6]" />
                <span>Target: {project.expectedCompletion}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-[#526a72]">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Operational ({handoverYear})</span>
            </span>
            {project.keyHighlights?.[0] && (
              <span className="truncate max-w-[160px] rounded bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-[#0369a1] border border-[#bce1f1]/70">
                {project.keyHighlights[0]}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons: View Gallery & Discuss Plant */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            data-magnetic="true"
            onClick={() => onOpenGallery?.(project)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-[#0077B6] hover:bg-sky-50 hover:text-[#0077B6] cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5 text-[#0077B6]" />
            <span>View Gallery</span>
          </button>
          <button
            type="button"
            data-magnetic="true"
            onClick={() => onOpenRFQ?.(project.title, capacity)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0077B6] px-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#005f92] cursor-pointer"
          >
            <span>Discuss Plant</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({ onOpenRFQ }) => {
  const [projects, setProjects] = useState<ProjectGallery[]>(FALLBACK_PROJECTS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "RUNNING" | "COMPLETED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [selectedGalleryProject, setSelectedGalleryProject] = useState<ProjectGallery | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mainImgError, setMainImgError] = useState(false);

  // Reset main image error state whenever active image or project changes
  useEffect(() => {
    setMainImgError(false);
  }, [selectedGalleryProject, activeImageIndex]);

  // Active images for current selected project
  const modalImages: string[] = selectedGalleryProject
    ? selectedGalleryProject.images && selectedGalleryProject.images.length > 0
      ? selectedGalleryProject.images
      : [selectedGalleryProject.imageUrl || resolvePlantImage(undefined, selectedGalleryProject.category)]
    : [];

  // Keyboard navigation for gallery modal
  useEffect(() => {
    if (!selectedGalleryProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedGalleryProject(null);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGalleryProject, modalImages.length]);

  // Fetch live projects from backend
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const res = await api.getGallery();
        if (res.success && res.data && res.data.length > 0) {
          setProjects(res.data);
        }
      } catch {
        // Fallback remains active
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Filter projects by status and category
  const filteredProjects = projects.filter((project) => {
    const projectStatus = project.status || "COMPLETED";
    const matchesStatus = statusFilter === "ALL" || projectStatus === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || project.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const runningCount = projects.filter((p) => (p.status || "COMPLETED") === "RUNNING").length;
  const completedCount = projects.filter((p) => (p.status || "COMPLETED") === "COMPLETED").length;

  return (
    <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
      <WaterBackgroundEffect variant="river" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1640px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-sm">
                <Waves className="h-3 w-3 text-[#0077b6] animate-pulse" />
                <span>Live Plant Delivery & Operations</span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#0f2d38] sm:text-4xl">
                Project delivery, shown in active practice.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#45616b] sm:text-base">
                A verified selection of industrial treatment plants currently in progress and turnkey systems commissioned for manufacturing, power, and municipal water schemes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex min-h-16 items-center gap-3 rounded-xl border border-[#bce1f1] bg-white/85 px-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,119,182,0.06)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309]">
                  <Activity className="h-4 w-4 animate-pulse" />
                </span>
                <span>
                  <span className="block font-mono text-xl font-bold leading-5 text-[#0f2d38]">
                    {runningCount}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-[#45616b]">
                    In Progress
                  </span>
                </span>
              </div>
              <div className="flex min-h-16 items-center gap-3 rounded-xl border border-[#bce1f1] bg-white/85 px-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,119,182,0.06)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dcfce7] text-[#15803d]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-mono text-xl font-bold leading-5 text-[#0f2d38]">
                    {completedCount}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-[#45616b]">
                    Commissioned
                  </span>
                </span>
              </div>
            </div>
          </div>

        <div className="mt-9 flex flex-col gap-4 border-y border-[#bce1f1]/60 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by status">
            {([
              ["ALL", "All projects", projects.length],
              ["RUNNING", "In progress", runningCount],
              ["COMPLETED", "Commissioned", completedCount],
            ] as const).map(([status, label, count]) => (
              <button
                key={status}
                type="button"
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6] ${
                  statusFilter === status
                    ? "border-[#0077B6] bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/25"
                    : "border-[#bce1f1] bg-white/80 text-[#45616b] hover:border-[#0077B6]/40 hover:bg-[#f0f9ff]"
                }`}
              >
                <span>{label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                  statusFilter === status ? "bg-white/20 text-white" : "bg-[#bce1f1]/40 text-[#0077B6]"
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="no-scrollbar [&::-webkit-scrollbar]:!hidden flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
            role="group"
            aria-label="Filter projects by treatment system"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={categoryFilter === category}
                onClick={() => setCategoryFilter(category)}
                className={`min-h-9 shrink-0 rounded-lg px-3.5 text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6] ${
                  categoryFilter === category
                    ? "bg-[#0077B6] text-white font-semibold shadow-sm shadow-[#0077B6]/20"
                    : "text-[#45616b] bg-white/60 hover:bg-white hover:text-[#0077B6]"
                }`}
              >
                {category === "ALL" ? "All systems" : category}
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">Showing {filteredProjects.length} projects</p>
        {filteredProjects.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || `project-${index}`}
                  project={project}
                  onOpenRFQ={onOpenRFQ}
                  onOpenGallery={(proj) => {
                    setSelectedGalleryProject(proj);
                    setActiveImageIndex(0);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mt-7 border border-dashed border-[#cbd8d2] bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No projects match these filters.</h3>
            <button type="button" onClick={() => { setStatusFilter("ALL"); setCategoryFilter("ALL"); }} className="mt-3 text-sm font-semibold text-[#0077B6] underline underline-offset-4 cursor-pointer">Clear filters</button>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-[#bce1f1] bg-white/85 p-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,119,182,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">
              <Droplets className="h-3 w-3" />
              <span>Custom Engineering Inquiries</span>
            </div>
            <h3 className="mt-1 text-base font-semibold text-[#0f2d38]">
              Planning a similar water or wastewater treatment plant?
            </h3>
            <p className="mt-1 text-sm text-[#45616b]">
              Share your daily flow rate (KLD) and water quality analysis for a detailed engineering proposal.
            </p>
          </div>
          <Link
            href="/contact-us#rfq"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-6 text-sm font-semibold text-white shadow-md shadow-[#0077B6]/20 transition-all hover:bg-[#0284c7] hover:shadow-lg"
          >
            Talk to Our Engineering Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </WaterBackgroundEffect>

    {/* Project Photo Gallery Lightbox Modal */}
    <AnimatePresence>
      {selectedGalleryProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setSelectedGalleryProject(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[92vh] max-h-[96vh] w-[96vw] max-w-6xl xl:max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-900 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2.5 truncate pr-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0077B6]/20 text-[#00B4D8]">
                  <Camera className="h-4 w-4" />
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                      {selectedGalleryProject.category}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                      {selectedGalleryProject.capacityKLD}
                    </span>
                  </div>
                  <h3 className="truncate text-sm font-bold text-white sm:text-base">
                    {selectedGalleryProject.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-medium text-slate-400">
                  {modalImages.length > 0 ? activeImageIndex + 1 : 0} / {modalImages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedGalleryProject(null)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
                  aria-label="Close photo gallery"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 w-full min-h-[380px] overflow-hidden bg-black/95 flex items-center justify-center select-none">
              {modalImages.length > 0 ? (
                (() => {
                  const rawSrc = modalImages[activeImageIndex];
                  const currentImgSrc = mainImgError
                    ? resolvePlantImage(undefined, selectedGalleryProject.category)
                    : resolvePlantImage(rawSrc, selectedGalleryProject.category);

                  return (
                    <div className="relative h-full w-full flex items-center justify-center p-3 sm:p-5">
                      <Image
                        key={`${currentImgSrc}-${activeImageIndex}`}
                        src={currentImgSrc}
                        alt={`${selectedGalleryProject.title} photo ${activeImageIndex + 1}`}
                        fill
                        priority
                        unoptimized
                        className="object-contain"
                        sizes="(max-width: 1536px) 96vw, 1400px"
                        onError={() => setMainImgError(true)}
                      />
                    </div>
                  );
                })()
              ) : (
                <div className="p-12 text-center text-slate-400">No photos available for this project.</div>
              )}

              {/* Prev / Next Buttons */}
              {modalImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-900/85 text-white shadow-xl backdrop-blur-md transition-all hover:bg-[#0077B6] hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-900/85 text-white shadow-xl backdrop-blur-md transition-all hover:bg-[#0077B6] hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Filmstrip */}
            {modalImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto border-t border-slate-800 bg-slate-950/70 p-3 scrollbar-thin">
                {modalImages.map((img, idx) => (
                  <GalleryThumbnail
                    key={`${img}-${idx}`}
                    img={img}
                    idx={idx}
                    isActive={activeImageIndex === idx}
                    onSelect={() => setActiveImageIndex(idx)}
                    category={selectedGalleryProject.category}
                  />
                ))}
              </div>
            )}

            {/* Footer with Project Details and RFQ CTA */}
            <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-900/95 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#00B4D8]" />
                  <span>{selectedGalleryProject.location}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#00B4D8]" />
                  <span>{selectedGalleryProject.clientSector}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  {selectedGalleryProject.status === "RUNNING" ? (
                    <span className="font-semibold text-amber-400">
                      In Progress ({selectedGalleryProject.progressPercentage || 65}%)
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-400">
                      Commissioned ({selectedGalleryProject.completionYear || 2024})
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const cap = Number.parseInt(selectedGalleryProject.capacityKLD?.replace(/[^\d]/g, "") || "", 10) || 100;
                    setSelectedGalleryProject(null);
                    onOpenRFQ?.(selectedGalleryProject.title, cap);
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#0077B6] px-4 text-xs font-semibold text-white shadow-md shadow-[#0077B6]/25 transition-all hover:bg-[#005f92] cursor-pointer"
                >
                  <span>Discuss This Plant Type</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </section>
);
};
