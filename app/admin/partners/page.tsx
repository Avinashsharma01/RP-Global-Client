"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Handshake,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  Check,
  X,
  AlertCircle,
  Building2,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Layers,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Partner } from "@/lib/types";
import { resolveLogoUrl } from "@/components/home/PartnersSection";

const PREDEFINED_CATEGORIES = [
  "Industrial Enterprise",
  "Pharma & Biotech",
  "Technology Licensor",
  "EPC & Infrastructure",
  "OEM Equipment",
  "Municipal / PSU",
];

const DEFAULT_FALLBACK_PARTNERS: Partner[] = [
  {
    _id: "partner-1",
    name: "Tata Chemicals Ltd",
    category: "Industrial Enterprise",
    logoUrl: "/images/partners/tata.svg",
    website: "https://www.tatachemicals.com",
    description: "1,200 KLD ZLD Effluent Recovery & Desalination Infrastructure",
    order: 1,
    isActive: true,
  },
  {
    _id: "partner-2",
    name: "Cipla Pharmaceuticals",
    category: "Pharma & Biotech",
    logoUrl: "/images/partners/cipla.svg",
    website: "https://www.cipla.com",
    description: "Ultra-pure Demineralized Water (DM) & Sanitary RO Skids",
    order: 2,
    isActive: true,
  },
  {
    _id: "partner-3",
    name: "Reliance Industries",
    category: "Industrial Enterprise",
    logoUrl: "/images/partners/reliance.svg",
    website: "https://www.ril.com",
    description: "Heavy Hydrocarbon & Petrochemical ETP Clarification Systems",
    order: 3,
    isActive: true,
  },
  {
    _id: "partner-4",
    name: "Grundfos Water Technology",
    category: "OEM Equipment",
    logoUrl: "/images/partners/grundfos.svg",
    website: "https://www.grundfos.com",
    description: "High-Efficiency Submersible & Multistage Booster Pump Skids",
    order: 4,
    isActive: true,
  },
  {
    _id: "partner-5",
    name: "Larsen & Toubro (L&T)",
    category: "EPC & Infrastructure",
    logoUrl: "/images/partners/lt.svg",
    website: "https://www.larsentoubro.com",
    description: "Turnkey Municipal & Mega Industrial Effluent Treatment EPC",
    order: 5,
    isActive: true,
  },
  {
    _id: "partner-6",
    name: "Dow Water Solutions",
    category: "Technology Licensor",
    logoUrl: "/images/partners/dow.svg",
    website: "https://www.dow.com",
    description: "FilmTec™ Reverse Osmosis & Ion Exchange Resin Media",
    order: 6,
    isActive: true,
  },
  {
    _id: "partner-7",
    name: "Thermax Global",
    category: "Technology Licensor",
    logoUrl: "/images/partners/thermax.svg",
    website: "https://www.thermaxglobal.com",
    description: "Condensate Polishing Units & Boiler Feed Demineralizers",
    order: 7,
    isActive: true,
  },
  {
    _id: "partner-8",
    name: "Sun Pharma Laboratories",
    category: "Pharma & Biotech",
    logoUrl: "/images/partners/sunpharma.svg",
    website: "https://sunpharma.com",
    description: "Zero Discharge Sterile API Wastewater Treatment Systems",
    order: 8,
    isActive: true,
  },
];

interface FormState {
  name: string;
  category: string;
  website: string;
  description: string;
  order: number;
  isActive: boolean;
  logoUrl: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  category: "Industrial Enterprise",
  website: "",
  description: "",
  order: 1,
  isActive: true,
  logoUrl: "",
};

const PartnerTableLogo: React.FC<{ partner: Partner }> = ({ partner }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => resolveLogoUrl(partner.logoUrl));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(resolveLogoUrl(partner.logoUrl));
    setHasError(false);
  }, [partner.logoUrl]);

  const handleError = () => {
    const defaultPartner = DEFAULT_FALLBACK_PARTNERS.find(
      (p: Partner) => p._id === partner._id || p.name.toLowerCase() === partner.name.toLowerCase()
    );
    if (defaultPartner && defaultPartner.logoUrl && imgSrc !== defaultPartner.logoUrl) {
      setImgSrc(defaultPartner.logoUrl);
    } else {
      setHasError(true);
    }
  };

  if (!imgSrc || hasError) {
    return (
      <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-center">
        <span className="text-[10px] font-bold text-slate-600 truncate px-1">
          {partner.name.slice(0, 10)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <img
        src={imgSrc}
        alt={partner.name}
        className="max-h-9 max-w-[68px] object-contain"
        onError={handleError}
      />
    </div>
  );
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadPartners = async () => {
    try {
      const res = await api.getAllPartners();
      if (res.success && res.data && res.data.length > 0) {
        setPartners(res.data);
      } else {
        setPartners(DEFAULT_FALLBACK_PARTNERS);
      }
    } catch {
      setPartners(DEFAULT_FALLBACK_PARTNERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPartners();
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedPartner(null);
    setFormData({
      ...INITIAL_FORM,
      order: partners.length + 1,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (partner: Partner) => {
    setIsEditing(true);
    setSelectedPartner(partner);
    setFormData({
      name: partner.name,
      category: partner.category || "Industrial Enterprise",
      website: partner.website || "",
      description: partner.description || "",
      order: partner.order || 0,
      isActive: partner.isActive !== false,
      logoUrl: partner.logoUrl || "",
    });
    setSelectedFile(null);
    setPreviewUrl(resolveLogoUrl(partner.logoUrl));
    setIsModalOpen(true);
  };

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Please enter a partner company name.", "error");
      return;
    }

    if (!selectedFile && !formData.logoUrl.trim()) {
      showToast("Please upload a logo file or provide a logo image URL.", "error");
      return;
    }

    setSubmitting(true);

    try {
      let payload: FormData | Record<string, unknown>;

      if (selectedFile) {
        const data = new FormData();
        data.append("name", formData.name.trim());
        data.append("category", formData.category.trim());
        data.append("website", formData.website.trim());
        data.append("description", formData.description.trim());
        data.append("order", String(formData.order));
        data.append("isActive", String(formData.isActive));
        data.append("logo", selectedFile);
        payload = data;
      } else {
        payload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          website: formData.website.trim(),
          description: formData.description.trim(),
          order: formData.order,
          isActive: formData.isActive,
          logoUrl: formData.logoUrl.trim(),
        };
      }

      if (isEditing && selectedPartner) {
        const res = await api.updatePartner(selectedPartner._id, payload);
        if (res.success) {
          showToast(`Partner "${formData.name}" updated successfully!`);
          setIsModalOpen(false);
          loadPartners();
        } else {
          showToast(res.message || "Failed to update partner.", "error");
        }
      } else {
        const res = await api.createPartner(payload);
        if (res.success) {
          showToast(`Partner "${formData.name}" added successfully!`);
          setIsModalOpen(false);
          loadPartners();
        } else {
          showToast(res.message || "Failed to create partner.", "error");
        }
      }
    } catch (err: any) {
      showToast(err.message || "An unexpected error occurred.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await api.deletePartner(deleteTarget._id);
      if (res.success) {
        showToast(`Partner "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        loadPartners();
      } else {
        showToast(res.message || "Failed to delete partner.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to delete partner.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Quick toggle active status
  const handleToggleStatus = async (partner: Partner) => {
    try {
      // Optimistic update
      setPartners((prev) =>
        prev.map((p) => (p._id === partner._id ? { ...p, isActive: !p.isActive } : p))
      );

      const res = await api.togglePartnerStatus(partner._id);
      if (res.success) {
        showToast(
          `"${partner.name}" is now ${res.data?.isActive ?? !partner.isActive ? "active" : "hidden"} on landing page.`
        );
      } else {
        // Revert on error
        loadPartners();
        showToast(res.message || "Failed to update status", "error");
      }
    } catch {
      loadPartners();
      showToast("Network error while updating status", "error");
    }
  };

  // Filtered partners
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || partner.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? partner.isActive !== false
        : partner.isActive === false;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metrics
  const totalCount = partners.length;
  const activeCount = partners.filter((p) => p.isActive !== false).length;
  const industrialCount = partners.filter((p) => p.category === "Industrial Enterprise").length;
  const techOEMCount = partners.filter(
    (p) => p.category === "Technology Licensor" || p.category === "OEM Equipment"
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="cursor-pointer ml-2 hover:opacity-80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0077B6]/15 text-[#0077B6]">
              <Handshake className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Partners & Industrial Clients
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage company logos, sectors, and active visibility for the Landing Page partners showcase.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
            title="Refresh Partners List"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#0077B6]" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#0077b6]/20 transition-all hover:bg-[#005f92] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Directory</span>
            <Building2 className="h-4 w-4 text-[#0077B6]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</p>
          <span className="mt-1 block text-[11px] text-slate-500">Registered partners</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Live on Site</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{activeCount}</p>
          <span className="mt-1 block text-[11px] text-emerald-600">Visible to public</span>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#0077B6]">
            <span className="text-xs font-semibold uppercase tracking-wider">Industrial Giants</span>
            <ShieldCheck className="h-4 w-4 text-[#0077B6]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0077B6]">{industrialCount}</p>
          <span className="mt-1 block text-[11px] text-sky-700">Chemical, Energy & FMCG</span>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Tech & OEM</span>
            <Layers className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-700">{techOEMCount}</p>
          <span className="mt-1 block text-[11px] text-purple-600">Licensors & Pump OEMs</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company name, category, or project scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0077B6] focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0077B6] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0077B6] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Hidden / Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Listing Table / Cards */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-[#0077B6]" />
            <span className="ml-2 text-xs font-semibold text-slate-600">Loading directory...</span>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Building2 className="h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">No partners found</h3>
            <p className="mt-1 text-xs text-slate-500">
              {searchQuery || categoryFilter !== "ALL"
                ? "Try adjusting your search criteria or category filter."
                : "Get started by adding your first industrial partner or client logo."}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="cursor-pointer mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#005f92]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Partner</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Logo & Partner</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Project Scope / Detail</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4 text-center">Live Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPartners.map((partner) => (
                  <tr
                    key={partner._id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    {/* Display Order */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      #{partner.order || 0}
                    </td>

                    {/* Logo & Company Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <PartnerTableLogo partner={partner} />
                        <div>
                          <p className="font-bold text-slate-900">{partner.name}</p>
                          <span className="text-[10px] text-slate-500 block">
                            ID: {partner._id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block rounded-md bg-[#e0f2fe] px-2.5 py-1 text-[11px] font-semibold text-[#0077B6]">
                        {partner.category || "General"}
                      </span>
                    </td>

                    {/* Description / Scope */}
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={partner.description}>
                      {partner.description || "—"}
                    </td>

                    {/* Website */}
                    <td className="py-3.5 px-4">
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer inline-flex items-center gap-1 font-semibold text-[#0077B6] hover:underline"
                        >
                          <span>Visit</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(partner)}
                        className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                          partner.isActive !== false
                            ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title="Click to toggle landing page visibility"
                      >
                        {partner.isActive !== false ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(partner)}
                          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#0077B6] hover:bg-[#0077B6]/10 hover:text-[#0077B6] transition-colors"
                          title="Edit Partner"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(partner)}
                          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Delete Partner"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0077B6] text-white">
                  <Handshake className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEditing ? "Edit Partner Details" : "Add New Partner"}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Appears directly in the landing page collaborator showcase
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Partner Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Partner / Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Chemicals, Cipla, Reliance, etc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0077B6] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Industry Category / Partnership Type <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="cursor-pointer w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  >
                    {PREDEFINED_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Logo Selection: File Upload OR URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Partner Logo <span className="text-red-500">*</span>
                </label>

                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-colors hover:border-[#0077B6] hover:bg-[#f0f9ff]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-[#0077B6]" />
                  <p className="mt-1.5 text-xs font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : "Click to upload logo image"}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    PNG, SVG, WEBP, or JPG up to 10MB
                  </span>
                </div>

                {/* Or image URL */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">Or enter image URL:</span>
                  <input
                    type="url"
                    placeholder="https://... logo.png or .svg"
                    value={formData.logoUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, logoUrl: e.target.value });
                      if (!selectedFile) {
                        setPreviewUrl(e.target.value);
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                {/* Logo Preview */}
                {previewUrl && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-1">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-10 max-w-[80px] object-contain"
                      />
                    </div>
                    <span className="text-xs text-slate-600 font-medium">
                      Logo preview as it will appear on the landing page
                    </span>
                  </div>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Website URL (Optional)
                </label>
                <div className="relative mt-1">
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Project Scope / Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Water Treatment Scope / Project Highlight (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1,200 KLD Zero Liquid Discharge (ZLD) plant engineering & commissioned skids"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0077B6] focus:outline-none"
                />
              </div>

              {/* Order & Active Status */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    Display Order (1 = First)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    Landing Page Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`cursor-pointer mt-1 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                      formData.isActive
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-slate-300 bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span>{formData.isActive ? "Visible on Site" : "Hidden (Draft)"}</span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        formData.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[#0077B6] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#0077b6]/20 hover:bg-[#005f92] disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isEditing ? "Save Changes" : "Create Partner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Delete Partner &quot;{deleteTarget.name}&quot;?
            </h3>

            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              This will permanently delete this partner and remove their logo from the landing page. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Partner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
