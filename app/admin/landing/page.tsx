"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Sparkles,
  BarChart3,
  Users,
  Activity,
  Layers,
  Calculator,
  MapPin,
  Award,
  ShieldCheck,
  Handshake,
  Factory,
  HelpCircle,
  Save,
  RotateCcw,
  ExternalLink,
  Upload,
  Check,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Film,
  Image as ImageIcon,
  ChevronRight,
  X,
  Loader2,
  Radio,
  FileCode,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  LandingContentCollection,
  HeroSectionData,
  MetricsSectionData,
  WhoWeAreSectionData,
  WaterPurificationFlowData,
  SolutionsGridSectionData,
  PlantCalculatorSectionData,
  ProjectTrackerSectionData,
  ValuePropositionSectionData,
  CertificationsSectionData,
  PartnersSectionData,
  ClientMarqueeSectionData,
  FAQSectionSettingsData,
  MetricItem,
  TreatmentStageItem,
  CalculatorApplication,
  QualityPillItem,
  CapabilityItem,
  SectorItemData,
} from "@/lib/types";
import { INITIAL_LANDING_DATA } from "@/lib/initialLandingData";

type SectionTabKey = keyof LandingContentCollection;

interface TabConfig {
  key: SectionTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabConfig[] = [
  { key: "hero", label: "Hero Banner", icon: Sparkles, description: "Main headline, CTAs, telemetry badges, and hero video/image." },
  { key: "metrics", label: "Trust Metrics", icon: BarChart3, description: "Experience counter, compliance statistics, and plant count cards." },
  { key: "whoWeAre", label: "Who We Are", icon: Users, description: "Corporate mission, delivery points, ISO badges, and plant photography." },
  { key: "waterPurificationFlow", label: "Purification Flow", icon: Activity, description: "Interactive 4-stage water clarification simulation & telemetry." },
  { key: "solutionsGrid", label: "Solutions Grid", icon: Layers, description: "Section titles and featured core plant treatment card." },
  { key: "plantCalculator", label: "Plant Calculator", icon: Calculator, description: "Sizing presets and target wastewater application models." },
  { key: "projectTracker", label: "Project Tracker", icon: MapPin, description: "Live EPC project installation showcase headline." },
  { key: "valueProposition", label: "Value Proposition", icon: Award, description: "Turnkey EPC accountability, quality badges, and core capabilities." },
  { key: "certifications", label: "Certifications", icon: ShieldCheck, description: "Accreditation headline and compliance assurance badge." },
  { key: "partners", label: "Partners & Clients", icon: Handshake, description: "Industrial client trust marquee headline." },
  { key: "clientMarquee", label: "Industry Marquee", icon: Factory, description: "20+ industrial sectors, treatment challenges, and processes." },
  { key: "faqs", label: "FAQs Headline", icon: HelpCircle, description: "Clarifications and knowledge base section headers." },
];

export default function AdminLandingCMSPage() {
  const [activeTab, setActiveTab] = useState<SectionTabKey>("hero");
  const [content, setContent] = useState<LandingContentCollection>(INITIAL_LANDING_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [unsavedTabs, setUnsavedTabs] = useState<Record<string, boolean>>({});

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Fetch current live content from server
  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getLandingContent();
      if (res.success && res.data) {
        setContent((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (err: any) {
      console.warn("Using offline landing defaults:", err);
      showToast("Could not connect to backend, loaded local defaults.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Update a field in the active section
  const updateActiveSection = useCallback(
    (updater: (prev: any) => any) => {
      setContent((prev) => {
        const currentSection = prev[activeTab];
        const nextSection = updater(currentSection);
        return {
          ...prev,
          [activeTab]: nextSection,
        };
      });
      setUnsavedTabs((prev) => ({ ...prev, [activeTab]: true }));
    },
    [activeTab]
  );

  // Save current active section to backend
  const handleSaveActiveSection = async () => {
    setIsSaving(true);
    try {
      const currentData = content[activeTab];
      const res = await api.updateLandingSection(activeTab, currentData);
      if (res.success) {
        showToast(`Section '${TABS.find((t) => t.key === activeTab)?.label}' saved successfully to database!`);
        setUnsavedTabs((prev) => ({ ...prev, [activeTab]: false }));
      } else {
        showToast(res.message || "Failed to update landing section.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Network error while updating section.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset current section to default values
  const handleResetActiveSection = () => {
    if (confirm(`Reset '${TABS.find((t) => t.key === activeTab)?.label}' to default content? This will discard unsaved edits.`)) {
      setContent((prev) => ({
        ...prev,
        [activeTab]: INITIAL_LANDING_DATA[activeTab],
      }));
      setUnsavedTabs((prev) => ({ ...prev, [activeTab]: true }));
      showToast(`Reset ${activeTab} to default values. Click Save to persist.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 shadow-xl text-xs font-semibold rounded-lg border transition-all ${
            toast.type === "success"
              ? "bg-[#0f1d31] border-cyan-400/40 text-cyan-300 shadow-cyan-900/20"
              : "bg-red-950 border-red-500/40 text-red-200 shadow-red-950/30"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-75"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0077B6]/10 text-[#0077B6]">
              <Globe className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Landing Page CMS
            </h1>
            <span className="rounded bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
              Live Connected
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Edit landing-page copy, adjust numbers, and upload Cloudinary media across all 12 homepage sections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleResetActiveSection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            title="Reset active tab to defaults"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveActiveSection}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-600/20 transition hover:bg-[#005f92] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving to Cloud...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Section</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main CMS Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Navigation Sidebar / Tabs */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                12 Homepage Sections
              </span>
            </div>
            <nav className="space-y-1" aria-label="Landing page sections">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                const isUnsaved = unsavedTabs[tab.key];
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-all ${
                      isActive
                        ? "bg-[#0f1d31] font-semibold text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isUnsaved && (
                        <span
                          className="h-2 w-2 rounded-full bg-amber-400"
                          title="Unsaved changes in this section"
                        />
                      )}
                      <ChevronRight
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? "text-cyan-400" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Section Editor Panel */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Editor Header */}
            <div className="flex flex-col gap-1 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {TABS.find((t) => t.key === activeTab)?.label}
                  </h2>
                  {unsavedTabs[activeTab] && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Unsaved Edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {TABS.find((t) => t.key === activeTab)?.description}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveActiveSection}
                disabled={isSaving}
                className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0077B6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#005f92] disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save</span>
              </button>
            </div>

            {/* Dynamic Section Forms */}
            <div className="p-5 sm:p-6">
              {loading ? (
                <div className="flex h-64 items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin text-[#0077B6]" />
                  <span className="text-xs font-medium">Loading section data from backend...</span>
                </div>
              ) : (
                <>
                  {activeTab === "hero" && (
                    <HeroEditor
                      data={content.hero}
                      onChange={(updated) => updateActiveSection(() => updated)}
                      showToast={showToast}
                    />
                  )}
                  {activeTab === "metrics" && (
                    <MetricsEditor
                      data={content.metrics}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "whoWeAre" && (
                    <WhoWeAreEditor
                      data={content.whoWeAre}
                      onChange={(updated) => updateActiveSection(() => updated)}
                      showToast={showToast}
                    />
                  )}
                  {activeTab === "waterPurificationFlow" && (
                    <WaterPurificationFlowEditor
                      data={content.waterPurificationFlow}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "solutionsGrid" && (
                    <SolutionsGridEditor
                      data={content.solutionsGrid}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "plantCalculator" && (
                    <PlantCalculatorEditor
                      data={content.plantCalculator}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "projectTracker" && (
                    <ProjectTrackerEditor
                      data={content.projectTracker}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "valueProposition" && (
                    <ValuePropositionEditor
                      data={content.valueProposition}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "certifications" && (
                    <CertificationsEditor
                      data={content.certifications}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "partners" && (
                    <PartnersEditor
                      data={content.partners}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "clientMarquee" && (
                    <ClientMarqueeEditor
                      data={content.clientMarquee}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                  {activeTab === "faqs" && (
                    <FAQsEditor
                      data={content.faqs}
                      onChange={(updated) => updateActiveSection(() => updated)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Cloudinary Media Upload Component (Reusable across Hero & Who We Are)
   ========================================================================= */

interface MediaUploadProps {
  label: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  onMediaTypeChange: (type: "image" | "video") => void;
  onMediaUrlChange: (url: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
  recommendedAspect?: string;
}

function MediaUploadField({
  label,
  mediaType,
  mediaUrl,
  onMediaTypeChange,
  onMediaUrlChange,
  showToast,
  recommendedAspect = "16:9 widescreen or high-resolution photo",
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const targetType = isVideo ? "video" : "image";
    onMediaTypeChange(targetType);

    const formData = new FormData();
    formData.append("media", file);

    setIsUploading(true);
    try {
      const res = await api.uploadLandingMedia(formData);
      const uploadedUrl = res.data?.url || (res as any).url;
      if (res.success && uploadedUrl) {
        onMediaUrlChange(uploadedUrl);
        showToast(`Uploaded ${targetType} directly to Cloudinary!`);
      } else {
        showToast(res.message || "Failed to upload file to Cloudinary.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Error uploading file.", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const isCloudinary = mediaUrl.includes("cloudinary.com");

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-slate-800">{label}</label>
          <span className="block text-[11px] text-slate-500">{recommendedAspect}</span>
        </div>

        {/* Media type toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onMediaTypeChange("image")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
              mediaType === "image"
                ? "bg-[#0077B6] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="h-3 w-3" />
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => onMediaTypeChange("video")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
              mediaType === "video"
                ? "bg-[#0077B6] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Film className="h-3 w-3" />
            <span>Video (MP4)</span>
          </button>
        </div>
      </div>

      {/* Cloudinary Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
            isCloudinary
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {isCloudinary ? "☁️ Cloudinary CDN Hosted" : "Static Path / Fallback"}
        </span>
      </div>

      {/* URL Input & Upload trigger */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => onMediaUrlChange(e.target.value)}
          placeholder="https://res.cloudinary.com/... or /images/..."
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0077B6] focus:outline-none"
        />

        <label
          className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#0f1d31] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b2f4d] ${
            isUploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 text-cyan-400" />
              <span>Upload to Cloudinary</span>
            </>
          )}
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Live Preview Box */}
      {mediaUrl && (
        <div className="relative mt-2 overflow-hidden rounded-lg border border-slate-300 bg-slate-900">
          {mediaType === "video" ? (
            <div className="relative aspect-video w-full bg-black">
              <video
                src={mediaUrl}
                controls
                className="h-full w-full object-contain"
                preload="metadata"
              />
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full max-h-56 bg-slate-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl}
                alt="Media Preview"
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <div className="bg-slate-900/90 px-3 py-1.5 text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span className="truncate max-w-[80%]">{mediaUrl}</span>
            <span className="uppercase text-[9px] font-bold text-cyan-400">{mediaType}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   1. HERO SECTION EDITOR
   ========================================================================= */

function HeroEditor({
  data,
  onChange,
  showToast,
}: {
  data: HeroSectionData;
  onChange: (updated: HeroSectionData) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [newCheckpoint, setNewCheckpoint] = useState("");

  const addCheckpoint = () => {
    if (!newCheckpoint.trim()) return;
    onChange({
      ...data,
      checkpoints: [...(data.checkpoints || []), newCheckpoint.trim()],
    });
    setNewCheckpoint("");
  };

  const removeCheckpoint = (idx: number) => {
    onChange({
      ...data,
      checkpoints: data.checkpoints.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Badge Tagline</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Headline Line 1</label>
          <input
            type="text"
            value={data.titleLine1}
            onChange={(e) => onChange({ ...data, titleLine1: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Headline Line 2</label>
          <input
            type="text"
            value={data.titleLine2}
            onChange={(e) => onChange({ ...data, titleLine2: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Headline Highlight (Cyan Accent)</label>
          <input
            type="text"
            value={data.titleHighlight}
            onChange={(e) => onChange({ ...data, titleHighlight: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Hero Description Paragraph</label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 p-3 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Primary CTA Button Text</label>
          <input
            type="text"
            value={data.primaryCtaText}
            onChange={(e) => onChange({ ...data, primaryCtaText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Primary CTA Action (or empty for RFQ modal)</label>
          <input
            type="text"
            value={data.primaryCtaLink}
            onChange={(e) => onChange({ ...data, primaryCtaLink: e.target.value })}
            placeholder="e.g. /contact-us or leave blank"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Secondary CTA Button Text</label>
          <input
            type="text"
            value={data.secondaryCtaText}
            onChange={(e) => onChange({ ...data, secondaryCtaText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Secondary CTA Link</label>
          <input
            type="text"
            value={data.secondaryCtaLink}
            onChange={(e) => onChange({ ...data, secondaryCtaLink: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Engineering Desk Hotline Phone</label>
          <input
            type="text"
            value={data.phoneNumber}
            onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Telemetry Live Badge Text</label>
          <input
            type="text"
            value={data.telemetryText}
            onChange={(e) => onChange({ ...data, telemetryText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      {/* Checkpoints list */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-semibold text-slate-700">Hero Checkpoints (Key Highlights)</label>
        <div className="flex flex-wrap gap-2">
          {data.checkpoints?.map((pt, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 border border-slate-200"
            >
              <Check className="h-3 w-3 text-cyan-600" />
              <span>{pt}</span>
              <button
                type="button"
                onClick={() => removeCheckpoint(i)}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Add new checkpoint (e.g. CPCB Approved Design)"
            value={newCheckpoint}
            onChange={(e) => setNewCheckpoint(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCheckpoint())}
            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-[#0077B6] focus:outline-none"
          />
          <button
            type="button"
            onClick={addCheckpoint}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Hero Media Cloudinary Upload */}
      <div className="pt-3">
        <MediaUploadField
          label="Hero Background Media (Cloudinary Hosted)"
          mediaType={data.mediaType || "image"}
          mediaUrl={data.mediaUrl}
          onMediaTypeChange={(type) => onChange({ ...data, mediaType: type })}
          onMediaUrlChange={(url) => onChange({ ...data, mediaUrl: url })}
          showToast={showToast}
          recommendedAspect="Hero loop video (MP4) or ultra-sharp 1920x1080 plant photo"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   2. METRICS SECTION EDITOR
   ========================================================================= */

function MetricsEditor({
  data,
  onChange,
}: {
  data: MetricsSectionData;
  onChange: (updated: MetricsSectionData) => void;
}) {
  const updateItem = (index: number, patch: Partial<MetricItem>) => {
    const nextItems = [...data.items];
    nextItems[index] = { ...nextItems[index], ...patch };
    onChange({ ...data, items: nextItems });
  };

  const addItem = () => {
    const newItem: MetricItem = {
      id: `m_${Date.now()}`,
      value: 100,
      suffix: "+",
      decimals: 0,
      label: "New Metric Title",
      detail: "Operational description",
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700">Badge Label</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Section Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description Subtitle</label>
          <input
            type="text"
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">
            Metric Counter Cards ({data.items?.length || 0})
          </label>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            <Plus className="h-3 w-3" />
            <span>Add Counter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.items?.map((item, idx) => (
            <div key={item.id || idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-mono text-[11px] font-bold text-slate-500">#{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-slate-400 hover:text-red-500"
                  title="Remove metric"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Value</label>
                  <input
                    type="number"
                    step="any"
                    value={item.value}
                    onChange={(e) => updateItem(idx, { value: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Suffix</label>
                  <input
                    type="text"
                    value={item.suffix}
                    onChange={(e) => updateItem(idx, { suffix: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Decimals</label>
                  <input
                    type="number"
                    value={item.decimals}
                    onChange={(e) => updateItem(idx, { decimals: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-600">Metric Headline</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(idx, { label: e.target.value })}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-600">Supporting Context</label>
                <input
                  type="text"
                  value={item.detail}
                  onChange={(e) => updateItem(idx, { detail: e.target.value })}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. WHO WE ARE SECTION EDITOR
   ========================================================================= */

function WhoWeAreEditor({
  data,
  onChange,
  showToast,
}: {
  data: WhoWeAreSectionData;
  onChange: (updated: WhoWeAreSectionData) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const updateParagraph = (idx: number, val: string) => {
    const next = [...data.paragraphs];
    next[idx] = val;
    onChange({ ...data, paragraphs: next });
  };

  const addParagraph = () => {
    onChange({ ...data, paragraphs: [...data.paragraphs, ""] });
  };

  const removeParagraph = (idx: number) => {
    onChange({ ...data, paragraphs: data.paragraphs.filter((_, i) => i !== idx) });
  };

  const updateDeliveryPoint = (idx: number, val: string) => {
    const next = [...data.deliveryPoints];
    next[idx] = val;
    onChange({ ...data, deliveryPoints: next });
  };

  const addDeliveryPoint = () => {
    onChange({ ...data, deliveryPoints: [...data.deliveryPoints, "New turnkey delivery stage"] });
  };

  const removeDeliveryPoint = (idx: number) => {
    onChange({ ...data, deliveryPoints: data.deliveryPoints.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700">Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Main Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Primary Button Label</label>
          <input
            type="text"
            value={data.primaryBtnText}
            onChange={(e) => onChange({ ...data, primaryBtnText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Primary Button Link</label>
          <input
            type="text"
            value={data.primaryBtnLink}
            onChange={(e) => onChange({ ...data, primaryBtnLink: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Secondary Button Label</label>
          <input
            type="text"
            value={data.secondaryBtnText}
            onChange={(e) => onChange({ ...data, secondaryBtnText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Secondary Button Link</label>
          <input
            type="text"
            value={data.secondaryBtnLink}
            onChange={(e) => onChange({ ...data, secondaryBtnLink: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Image Floating Badge Title</label>
          <input
            type="text"
            value={data.imageBadgeTitle}
            onChange={(e) => onChange({ ...data, imageBadgeTitle: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Image Floating Badge Subtitle</label>
          <input
            type="text"
            value={data.imageBadgeSubtitle}
            onChange={(e) => onChange({ ...data, imageBadgeSubtitle: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">Editorial Paragraphs</label>
          <button
            type="button"
            onClick={addParagraph}
            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            <Plus className="h-3 w-3" />
            <span>Add Paragraph</span>
          </button>
        </div>
        {data.paragraphs?.map((p, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <textarea
              rows={2}
              value={p}
              onChange={(e) => updateParagraph(idx, e.target.value)}
              className="flex-1 rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeParagraph(idx)}
              className="mt-1 text-slate-400 hover:text-red-500"
              title="Delete paragraph"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Delivery Points */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">Delivery Checklist Steps</label>
          <button
            type="button"
            onClick={addDeliveryPoint}
            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            <Plus className="h-3 w-3" />
            <span>Add Point</span>
          </button>
        </div>
        {data.deliveryPoints?.map((dp, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              value={dp}
              onChange={(e) => updateDeliveryPoint(idx, e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-[#0077B6] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeDeliveryPoint(idx)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Media Upload */}
      <div className="pt-2">
        <MediaUploadField
          label="Who We Are Featured Plant Media"
          mediaType={data.mediaType || "image"}
          mediaUrl={data.mediaUrl}
          onMediaTypeChange={(type) => onChange({ ...data, mediaType: type })}
          onMediaUrlChange={(url) => onChange({ ...data, mediaUrl: url })}
          showToast={showToast}
          recommendedAspect="Crisp industrial installation photo or video"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   4. WATER PURIFICATION FLOW EDITOR
   ========================================================================= */

function WaterPurificationFlowEditor({
  data,
  onChange,
}: {
  data: WaterPurificationFlowData;
  onChange: (updated: WaterPurificationFlowData) => void;
}) {
  const updateStage = (idx: number, patch: Partial<TreatmentStageItem>) => {
    const next = [...data.stages];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...data, stages: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700">Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-800">
          Treatment Simulation Stages ({data.stages?.length || 0})
        </label>
        <div className="space-y-4">
          {data.stages?.map((stage, idx) => (
            <div key={stage.id || idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-xs text-[#0077B6]">
                  {stage.name} ({stage.shortName})
                </span>
                <span className="font-mono text-[10px] text-slate-500 uppercase">{stage.id}</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Full Name</label>
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => updateStage(idx, { name: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Short Name</label>
                  <input
                    type="text"
                    value={stage.shortName}
                    onChange={(e) => updateStage(idx, { shortName: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Tagline</label>
                  <input
                    type="text"
                    value={stage.tagline}
                    onChange={(e) => updateStage(idx, { tagline: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Raw Water Label</label>
                  <input
                    type="text"
                    value={stage.rawWaterLabel}
                    onChange={(e) => updateStage(idx, { rawWaterLabel: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Raw Water Description</label>
                  <input
                    type="text"
                    value={stage.rawWaterDesc}
                    onChange={(e) => updateStage(idx, { rawWaterDesc: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Technology Process</label>
                  <input
                    type="text"
                    value={stage.technology}
                    onChange={(e) => updateStage(idx, { technology: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Compliance Badge</label>
                  <input
                    type="text"
                    value={stage.complianceBadge}
                    onChange={(e) => updateStage(idx, { complianceBadge: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. SOLUTIONS GRID EDITOR
   ========================================================================= */

function SolutionsGridEditor({
  data,
  onChange,
}: {
  data: SolutionsGridSectionData;
  onChange: (updated: SolutionsGridSectionData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-3 text-xs text-cyan-900">
        💡 Individual plant specifications (STP, ETP, RO, DM, Softeners, WTP) are synchronized with the <strong>Product Catalog CMS</strong> (`/admin/products`). Here you configure the landing section headlines and highlight.
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Badge</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Section Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700">Featured Solution Slug</label>
          <input
            type="text"
            value={data.featuredSlug}
            onChange={(e) => onChange({ ...data, featuredSlug: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">View All Button Label</label>
          <input
            type="text"
            value={data.viewAllText}
            onChange={(e) => onChange({ ...data, viewAllText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. PLANT CALCULATOR EDITOR
   ========================================================================= */

function PlantCalculatorEditor({
  data,
  onChange,
}: {
  data: PlantCalculatorSectionData;
  onChange: (updated: PlantCalculatorSectionData) => void;
}) {
  const updateApp = (idx: number, patch: Partial<CalculatorApplication>) => {
    const next = [...data.applications];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...data, applications: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700">Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Capacity Quick Presets (Comma separated KLD values)</label>
          <input
            type="text"
            value={data.presets?.join(", ") || ""}
            onChange={(e) => {
              const nums = e.target.value
                .split(",")
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n));
              onChange({ ...data, presets: nums });
            }}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-800">
          Target Water Applications ({data.applications?.length || 0})
        </label>
        <div className="space-y-4">
          {data.applications?.map((app, idx) => (
            <div key={app.id || idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-xs text-slate-900">{app.name}</span>
                <span className="font-mono text-[10px] text-cyan-600 font-bold">{app.plantType}</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Application Name</label>
                  <input
                    type="text"
                    value={app.name}
                    onChange={(e) => updateApp(idx, { name: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Recovery %</label>
                  <input
                    type="number"
                    value={app.reusePercent}
                    onChange={(e) => updateApp(idx, { reusePercent: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Recommended Technology</label>
                  <input
                    type="text"
                    value={app.technology}
                    onChange={(e) => updateApp(idx, { technology: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Design Objective</label>
                  <input
                    type="text"
                    value={app.designObjective}
                    onChange={(e) => updateApp(idx, { designObjective: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   7. PROJECT TRACKER SECTION EDITOR
   ========================================================================= */

function ProjectTrackerEditor({
  data,
  onChange,
}: {
  data: ProjectTrackerSectionData;
  onChange: (updated: ProjectTrackerSectionData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-3 text-xs text-cyan-900">
        💡 Individual commissioned plants and case studies are managed under the <strong>Project Gallery CMS</strong> (`/admin/gallery`). Here you configure the live tracker section header and badge.
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Badge</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   8. VALUE PROPOSITION EDITOR
   ========================================================================= */

function ValuePropositionEditor({
  data,
  onChange,
}: {
  data: ValuePropositionSectionData;
  onChange: (updated: ValuePropositionSectionData) => void;
}) {
  const updateCap = (idx: number, patch: Partial<CapabilityItem>) => {
    const next = [...data.capabilities];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...data, capabilities: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700">Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">CTA Button Text</label>
          <input
            type="text"
            value={data.ctaText}
            onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">CTA Button Link</label>
          <input
            type="text"
            value={data.ctaLink}
            onChange={(e) => onChange({ ...data, ctaLink: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800">
          Turnkey Capabilities ({data.capabilities?.length || 0})
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.capabilities?.map((cap, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-600">{cap.number}</span>
                <input
                  type="text"
                  value={cap.title}
                  onChange={(e) => updateCap(idx, { title: e.target.value })}
                  className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold"
                />
              </div>
              <textarea
                rows={2}
                value={cap.description}
                onChange={(e) => updateCap(idx, { description: e.target.value })}
                className="w-full rounded border border-slate-300 bg-white p-2 text-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   9. CERTIFICATIONS SECTION EDITOR
   ========================================================================= */

function CertificationsEditor({
  data,
  onChange,
}: {
  data: CertificationsSectionData;
  onChange: (updated: CertificationsSectionData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-3 text-xs text-cyan-900">
        💡 Specific ISO, CPCB, and government certificates are managed under <strong>Certifications & ISO CMS</strong> (`/admin/certificates`). Here you configure the landing section headline and description.
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Badge</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   10. PARTNERS SECTION EDITOR
   ========================================================================= */

function PartnersEditor({
  data,
  onChange,
}: {
  data: PartnersSectionData;
  onChange: (updated: PartnersSectionData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-3 text-xs text-cyan-900">
        💡 Individual corporate logos and client partnerships are managed under <strong>Partners & Clients CMS</strong> (`/admin/partners`). Here you configure the section headers.
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Badge</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   11. CLIENT MARQUEE SECTORS EDITOR
   ========================================================================= */

function ClientMarqueeEditor({
  data,
  onChange,
}: {
  data: ClientMarqueeSectionData;
  onChange: (updated: ClientMarqueeSectionData) => void;
}) {
  const updateSector = (idx: number, patch: Partial<SectorItemData>) => {
    const next = [...data.sectors];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...data, sectors: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700">Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-800">
          Client Sectors & Custom Treatments ({data.sectors?.length || 0})
        </label>
        <div className="space-y-4">
          {data.sectors?.map((sec, idx) => (
            <div key={sec.id || idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-xs text-slate-900">{sec.name}</span>
                <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] uppercase font-bold text-slate-700">
                  {sec.category}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Sector Title</label>
                  <input
                    type="text"
                    value={sec.name}
                    onChange={(e) => updateSector(idx, { name: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Detail Summary</label>
                  <input
                    type="text"
                    value={sec.detail}
                    onChange={(e) => updateSector(idx, { detail: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Badge</label>
                  <input
                    type="text"
                    value={sec.badge}
                    onChange={(e) => updateSector(idx, { badge: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Recommended Plant</label>
                  <input
                    type="text"
                    value={sec.recommendedPlant}
                    onChange={(e) => updateSector(idx, { recommendedPlant: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Water Challenge</label>
                  <input
                    type="text"
                    value={sec.challenge}
                    onChange={(e) => updateSector(idx, { challenge: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-medium text-slate-600">Process Engineering Summary</label>
                  <textarea
                    rows={2}
                    value={sec.processSummary}
                    onChange={(e) => updateSector(idx, { processSummary: e.target.value })}
                    className="w-full rounded border border-slate-300 bg-white p-2 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   12. FAQS SECTION SETTINGS EDITOR
   ========================================================================= */

function FAQsEditor({
  data,
  onChange,
}: {
  data: FAQSectionSettingsData;
  onChange: (updated: FAQSectionSettingsData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-3 text-xs text-cyan-900">
        💡 Individual FAQ question-and-answer items are managed under <strong>FAQs Management CMS</strong> (`/admin/faqs`). Here you configure the homepage FAQ section title and badge.
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Badge</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-[#0077B6] focus:outline-none"
        />
      </div>
    </div>
  );
}
