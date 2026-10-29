"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Factory,
  Layers,
  X,
  CheckCircle2,
  Maximize2,
  Activity,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  Waves,
  Droplets,
} from "lucide-react";
import { api } from "@/lib/api";
import { ProjectGallery } from "@/lib/types";
import { resolvePlantImage } from "@/components/home/ProjectsTracker";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

const FALLBACK_PROJECTS: ProjectGallery[] = [
  {
    _id: "fall-1",
    title: "1,200 KLD Industrial Zero Liquid Discharge (ZLD) Plant with MEE",
    category: "ETP Plants",
    capacityKLD: "1,200 KLD",
    location: "Dahej PCPIR, Gujarat",
    clientSector: "Petrochemicals & Specialty Chemicals",
    imageUrl: "/images/plant-etp.jpg",
    status: "RUNNING",
    progressPercentage: 78,
    currentStage: "Multi-Effect Evaporator Skid & Titanium Heat Exchanger Assembly",
    expectedCompletion: "December 2026",
    keyHighlights: [
      "Zero Liquid Discharge Assured",
      "Condensate Recovery 96%",
      "SCADA Controlled Automation",
    ],
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
    status: "RUNNING",
    progressPercentage: 55,
    currentStage: "Civil Reactor Tank Casting & Fine Bubble Diffuser Grid Installation",
    expectedCompletion: "November 2026",
    keyHighlights: [
      "Cooling Tower Reuse Spec",
      "BOD < 5 mg/L",
      "Dual Media Pressure Sand Filtration",
    ],
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
    status: "RUNNING",
    progressPercentage: 88,
    currentStage: "Membrane Loading, Hydrostatic Pressure Test & Calibration",
    expectedCompletion: "October 2026",
    keyHighlights: [
      "Conductivity < 0.1 µS/cm",
      "Dow Filmtec Membranes",
      "SS 316L Sanitary Piping",
    ],
    completionYear: 2026,
    isFeatured: true,
    order: 3,
  },
  {
    _id: "fall-4",
    title: "500 KLD MBBR Sewage Treatment Plant",
    category: "STP Plants",
    capacityKLD: "500 KLD",
    location: "Greater Noida, Uttar Pradesh",
    clientSector: "Residential High-Rise Society",
    imageUrl: "/images/plant-stp.jpg",
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over",
    expectedCompletion: "Completed",
    keyHighlights: [
      "Zero foul odor execution",
      "Biological water recycling for 14-acre landscaping",
      "SPCB compliant discharge",
    ],
    completionYear: 2024,
    isFeatured: true,
    order: 4,
  },
  {
    _id: "fall-5",
    title: "250 KLD Textile Industrial ETP & Filter Press",
    category: "ETP Plants",
    capacityKLD: "250 KLD",
    location: "Bhiwadi, Rajasthan",
    clientSector: "Textile Fabric Dyeing & Processing",
    imageUrl: "/images/plant-etp.jpg",
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over",
    expectedCompletion: "Completed",
    keyHighlights: [
      "Over 92% COD reduction",
      "Automated plate-and-frame sludge cake dewatering",
      "Full chemical coagulation skid",
    ],
    completionYear: 2023,
    isFeatured: true,
    order: 5,
  },
  {
    _id: "fall-6",
    title: "50 m³/hr Two-Bed Demineralization Plant with Mixed Bed",
    category: "DM Plants",
    capacityKLD: "1,200 KLD",
    location: "Panipat, Haryana",
    clientSector: "Thermal Power & Boiler Feed",
    imageUrl: "/images/plant-ro.jpg",
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over",
    expectedCompletion: "Completed",
    keyHighlights: [
      "Product conductivity < 0.1 µS/cm",
      "Online silica analyzer monitoring",
      "Counter-current regeneration",
    ],
    completionYear: 2023,
    isFeatured: true,
    order: 6,
  },
  {
    _id: "fall-7",
    title: "5 MLD Municipal River Intake Water Treatment Plant",
    category: "WTP Plants",
    capacityKLD: "5,000 KLD",
    location: "Gopalganj, Bihar",
    clientSector: "Municipal Urban Potable Water Scheme",
    imageUrl: "/images/plant-etp.jpg",
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over",
    expectedCompletion: "Completed",
    keyHighlights: [
      "Turbidity reduced from 450 NTU to < 1 NTU",
      "IS 10500 drinking water certified",
      "Lamella clarifier & dual gravity filters",
    ],
    completionYear: 2022,
    isFeatured: true,
    order: 7,
  },
];

const CATEGORIES = [
  "ALL",
  "STP Plants",
  "ETP Plants",
  "RO Systems",
  "DM Plants",
  "Water Softeners",
  "WTP Plants",
];

export default function GalleryPage() {
  const [projects, setProjects] = useState<ProjectGallery[]>(FALLBACK_PROJECTS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "RUNNING" | "COMPLETED">("ALL");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<ProjectGallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getGallery()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data && res.data.length > 0) {
          setProjects(res.data);
        } else {
          setProjects(FALLBACK_PROJECTS);
        }
      })
      .catch(() => {
        if (isMounted) setProjects(FALLBACK_PROJECTS);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const runningCount = projects.filter((p) => p.status === "RUNNING").length;
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "ALL" || project.status === statusFilter;
    const matchesCategory =
      activeCategory === "ALL" || project.category === activeCategory;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      {/* Page introduction */}
      <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="hydraulic" className="px-4 py-12 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-[#0077b6] bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#0077b6]">
              <Camera className="w-4 h-4 text-[#10B981]" />
              <span>Turnkey EPC Execution Portfolio</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-4xl lg:text-5xl">
              Industrial Plant Project Gallery
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#45616b] sm:text-base">
              Real installations and active construction sites across textile mills, pharmaceutical facilities,
              commercial complexes, and municipal potable water authorities across India.
            </p>

            {/* Quick Status Stats Pill */}
            <div className="mt-7 flex flex-wrap items-center justify-start gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-1.5 text-amber-800 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>{runningCount} Active Site Projects</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-emerald-800 shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{completedCount} Commissioned Plants</span>
              </span>
            </div>
          </div>
        </WaterBackgroundEffect>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Dual Filters Bar: Status Tabs + Category Pills */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 pb-4">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "ALL"
                  ? "bg-[#0A192F] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter("RUNNING")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                statusFilter === "RUNNING"
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-600/20"
                  : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Active Construction Sites ({runningCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                statusFilter === "COMPLETED"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Commissioned Plants ({completedCount})</span>
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0077B6] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-[#0077B6]" />
            <span>Loading gallery installations from database...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No project installations currently match the selected status and category filter.
            </p>
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setActiveCategory("ALL");
              }}
              className="px-4 py-2 bg-[#0077B6] text-white text-xs font-bold rounded-lg hover:bg-[#005f92]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const isRunning = project.status === "RUNNING";
            const imageSrc = resolvePlantImage(project.imageUrl, project.category);

            return (
              <div
                key={project._id || project.title}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#0077B6]/40"
              >
                <div>
                  {/* Photo Header */}
                  <div className="h-52 relative overflow-hidden bg-slate-900">
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold bg-[#0A192F]/80 backdrop-blur-md text-white border border-white/20 px-2.5 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                          isRunning
                            ? "bg-amber-500/90 text-slate-950 shadow-sm"
                            : "bg-emerald-500/90 text-white shadow-sm"
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                            <span>In Progress</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Commissioned</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Bottom overlay: Capacity & Year */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-cyan-300 font-bold block">
                          Plant Capacity
                        </span>
                        <span className="text-base font-black font-mono tracking-tight">
                          {project.capacityKLD}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded">
                        {isRunning ? project.expectedCompletion || "2026 Active" : `Est. ${project.completionYear}`}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors line-clamp-2 leading-snug">
                      {project.title}
                    </h3>

                    {/* Progress Bar for Running Projects */}
                    {isRunning && (
                      <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900">
                          <span className="flex items-center space-x-1">
                            <Activity className="w-3 h-3 text-amber-600" />
                            <span>Site Progress</span>
                          </span>
                          <span className="font-mono font-bold">{project.progressPercentage || 65}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                            style={{ width: `${project.progressPercentage || 65}%` }}
                          />
                        </div>
                        {project.currentStage && (
                          <p className="text-[10px] text-amber-800/90 font-medium line-clamp-1 pt-0.5">
                            Stage: {project.currentStage}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0077B6] shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Factory className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span className="truncate">Client: {project.clientSector}</span>
                      </div>
                    </div>

                    {/* Highlights bullet list */}
                    {project.keyHighlights && project.keyHighlights.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1">
                        {project.keyHighlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-start space-x-1.5 text-[11px] text-slate-600">
                            <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Technical Specifications</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#00E5FF]">
                  Project Technical Dossier
                </span>
                <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Image banner inside modal */}
              <div className="h-44 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <Image
                  src={resolvePlantImage(selectedProject.imageUrl, selectedProject.category)}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-mono">
                  <span className="text-xs font-bold text-cyan-300">
                    {selectedProject.capacityKLD}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedProject.status === "RUNNING"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {selectedProject.status === "RUNNING" ? "Site Construction Active" : "Commissioned & Running"}
                  </span>
                </div>
              </div>

              {/* Status and Telemetry Block */}
              {selectedProject.status === "RUNNING" && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Active Site Progress</span>
                    <span className="font-mono">{selectedProject.progressPercentage || 65}%</span>
                  </div>
                  <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${selectedProject.progressPercentage || 65}%` }}
                    />
                  </div>
                  {selectedProject.currentStage && (
                    <p className="text-[11px] text-amber-800">
                      <strong>Current Phase:</strong> {selectedProject.currentStage}
                    </p>
                  )}
                  {selectedProject.expectedCompletion && (
                    <p className="text-[11px] text-amber-800">
                      <strong>Expected Handover:</strong> {selectedProject.expectedCompletion}
                    </p>
                  )}
                </div>
              )}

              {/* Key Parameters Matrix */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Capacity:</span>
                  <span className="font-bold text-[#0077B6]">{selectedProject.capacityKLD}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Category:</span>
                  <span className="font-bold text-slate-800">{selectedProject.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Location:</span>
                  <span className="font-semibold text-slate-800">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Client Industry:</span>
                  <span className="font-semibold text-slate-800">{selectedProject.clientSector}</span>
                </div>
              </div>

              {/* Highlights */}
              {selectedProject.keyHighlights && selectedProject.keyHighlights.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                    Engineering Specifications:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProject.keyHighlights.map((h, i) => (
                      <li key={i} className="flex items-start space-x-2 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quality and compliance */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-slate-600">
                <ShieldCheck className="w-5 h-5 text-[#0077B6] shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  Turnkey EPC fabrication with ISO 9001:2015 quality controls and designs aligned with CPCB/SPCB discharge requirements.
                </span>
              </div>

              {/* Direct RFQ Action */}
              <div className="pt-2">
                <Link
                  href={`/contact-us?plant=${encodeURIComponent(selectedProject.category)}#rfq`}
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-2.5 rounded-lg bg-[#0077B6] hover:bg-[#005f92] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>Request Similar Plant Sizing & Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
