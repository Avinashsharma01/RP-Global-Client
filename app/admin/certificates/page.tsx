"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Award,
  CheckCircle2,
  Edit,
  ExternalLink,
  Eye,
  FileCheck2,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Maximize2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Certificate } from "@/lib/types";

const CATEGORIES = [
  "ALL",
  "ISO",
  "GOVERNMENT",
  "LABOUR",
  "CONTRACTOR",
  "COMPLIANCE",
  "OTHER",
] as const;

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    issuingAuthority: "",
    certificateNumber: "",
    category: "ISO" as Certificate["category"],
    issueDate: "",
    expiryDate: "Permanent / Active",
    verificationUrl: "",
    pdfUrl: "",
    description: "",
    order: 1,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const fetchCertificates = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.getCertificates({ includeInactive: true });
      if (res.success && res.data) {
        setCertificates(res.data);
      }
    } catch {
      showToast("Failed to fetch certificates from server.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    api.getCertificates({ includeInactive: true })
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setCertificates(res.data);
        }
      })
      .catch(() => {
        if (isMounted) showToast("Failed to fetch certificates from server.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleOpenCreate = () => {
    setEditingCert(null);
    setFormData({
      title: "",
      subtitle: "",
      issuingAuthority: "",
      certificateNumber: "",
      category: "ISO",
      issueDate: "",
      expiryDate: "Permanent / Active",
      verificationUrl: "",
      pdfUrl: "",
      description: "",
      order: certificates.length + 1,
      isActive: true,
    });
    setSelectedFile(null);
    setFilePreview(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      subtitle: cert.subtitle || "",
      issuingAuthority: cert.issuingAuthority,
      certificateNumber: cert.certificateNumber,
      category: cert.category,
      issueDate: cert.issueDate || "",
      expiryDate: cert.expiryDate || "Permanent / Active",
      verificationUrl: cert.verificationUrl || "",
      pdfUrl: cert.pdfUrl || "",
      description: cert.description || "",
      order: cert.order || 1,
      isActive: cert.isActive !== false,
    });
    setSelectedFile(null);
    setFilePreview(cert.imageUrl);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issuingAuthority || !formData.certificateNumber) {
      showToast("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("subtitle", formData.subtitle);
      submitData.append("issuingAuthority", formData.issuingAuthority);
      submitData.append("certificateNumber", formData.certificateNumber);
      submitData.append("category", formData.category);
      submitData.append("issueDate", formData.issueDate);
      submitData.append("expiryDate", formData.expiryDate);
      submitData.append("verificationUrl", formData.verificationUrl);
      submitData.append("pdfUrl", formData.pdfUrl);
      submitData.append("description", formData.description);
      submitData.append("order", String(formData.order));
      submitData.append("isActive", String(formData.isActive));

      if (selectedFile) {
        submitData.append("image", selectedFile);
      } else if (editingCert) {
        submitData.append("imageUrl", editingCert.imageUrl);
      }

      let res;
      if (editingCert) {
        res = await api.updateCertificate(editingCert._id, submitData);
      } else {
        res = await api.createCertificate(submitData);
      }

      if (res.success) {
        showToast(editingCert ? "Certificate updated successfully!" : "Certificate created successfully!");
        setIsFormOpen(false);
        fetchCertificates();
      } else {
        showToast(res.message || "Operation failed.");
      }
    } catch {
      showToast("An error occurred while saving certificate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(id);
    try {
      const res = await api.deleteCertificate(id);
      if (res.success) {
        showToast("Certificate deleted successfully.");
        setCertificates((prev) => prev.filter((c) => c._id !== id));
      } else {
        showToast(res.message || "Failed to delete certificate.");
      }
    } catch {
      showToast("Failed to delete certificate.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleActive = async (cert: Certificate) => {
    try {
      const newActive = !cert.isActive;
      const res = await api.updateCertificate(cert._id, {
        isActive: newActive,
      });
      if (res.success) {
        setCertificates((prev) =>
          prev.map((c) => (c._id === cert._id ? { ...c, isActive: newActive } : c))
        );
        showToast(`Certificate is now ${newActive ? "visible" : "hidden"} on the landing page.`);
      }
    } catch {
      showToast("Failed to update certificate visibility.");
    }
  };

  // Filtered List
  const filteredCertificates = certificates.filter((c) => {
    const matchesCategory = categoryFilter === "ALL" || c.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.certificateNumber.toLowerCase().includes(q) ||
      c.issuingAuthority.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const activeCount = certificates.filter((c) => c.isActive !== false).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-cyan-500/30 bg-[#0f1d31] px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#00E5FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-50 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077B6]">
            <ShieldCheck className="h-3 w-3" />
            <span>Official Accreditations &amp; Registrations</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Certifications &amp; ISO Compliance CMS
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Upload and manage the official documents and statutory licenses displayed in the &quot;Certified for Excellence&quot; showcase on the landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void fetchCertificates(true)}
            disabled={loading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Certificates"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284c7] px-4 text-xs font-semibold text-white shadow-md shadow-[#0077B6]/20 hover:from-[#005f92] hover:to-[#0077B6] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Certificate</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Certificates</div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900">{certificates.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Archived in registry</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active on Landing Page</div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-600">{activeCount}</div>
          <div className="mt-1 text-[11px] text-emerald-600/80">Publicly visible</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ISO Standards</div>
          <div className="mt-1 font-mono text-2xl font-bold text-[#0077B6]">
            {certificates.filter((c) => c.category === "ISO").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Quality management</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Government &amp; Labour</div>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-600">
            {certificates.filter((c) => c.category === "GOVERNMENT" || c.category === "LABOUR" || c.category === "CONTRACTOR").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Statutory licenses</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, number, or authority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0077B6] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-[#0077B6] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#0077B6]" />
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((cert) => (
            <div
              key={cert._id}
              className={`group flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                cert.isActive !== false ? "border-slate-200" : "border-slate-300/70 bg-slate-50/60 opacity-80"
              }`}
            >
              <div>
                {/* Top Header Card Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="rounded-md bg-cyan-50 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-[#0077B6] border border-cyan-200">
                    {cert.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(cert)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold cursor-pointer transition-colors ${
                      cert.isActive !== false
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                    title="Click to toggle landing page visibility"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cert.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                    <span>{cert.isActive !== false ? "Active on Page" : "Hidden"}</span>
                  </button>
                </div>

                {/* Document Thumbnail Preview */}
                <div
                  onClick={() => setPreviewCert(cert)}
                  className="relative aspect-[1/1.35] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 cursor-pointer transition-transform group-hover:scale-[1.01]"
                >
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-md">
                      <Eye className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <h3 className="mt-3.5 text-sm font-bold text-slate-900 line-clamp-2">
                  {cert.title}
                </h3>
                {cert.subtitle && (
                  <p className="mt-0.5 text-xs text-[#0077B6] font-medium line-clamp-1">
                    {cert.subtitle}
                  </p>
                )}

                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Code/No:</span>
                    <span className="font-mono font-bold text-slate-800">{cert.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Authority:</span>
                    <span className="text-slate-700 text-right truncate max-w-[180px]">{cert.issuingAuthority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Validity:</span>
                    <span className="text-emerald-700 font-semibold">{cert.expiryDate || "Active"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setPreviewCert(cert)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0077B6] cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cert)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:border-[#0077B6] hover:text-[#0077B6] transition-colors cursor-pointer"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cert._id)}
                    disabled={isDeleting === cert._id}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Delete certificate"
                  >
                    {isDeleting === cert._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-semibold text-slate-800">No certificates found</h3>
          <p className="mt-1 text-xs text-slate-500">
            {searchQuery || categoryFilter !== "ALL"
              ? "Try adjusting your search query or filters."
              : "Upload your first ISO or Government certificate to get started."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload Certificate</span>
          </button>
        </div>
      )}

      {/* Modal: Create / Edit Certificate Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#0077B6]" />
                <span>{editingCert ? "Edit Certificate Record" : "Upload New Certificate"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISO 9001:2015 Quality Management System"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Magnitude Management Services (IAF)"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Registration / Certificate Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20EQCK10 or 0212019727"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 font-mono focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Certificate["category"] })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  >
                    <option value="ISO">ISO Standard</option>
                    <option value="GOVERNMENT">Government of India / DGFT</option>
                    <option value="LABOUR">Labour / EPFO / ESIC</option>
                    <option value="CONTRACTOR">Government Contractor</option>
                    <option value="COMPLIANCE">CPCB / SPCB Compliance</option>
                    <option value="OTHER">Other Accreditation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Subtitle / Dept Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Directorate General of Foreign Trade"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18/05/2023"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Validity / Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Permanent / Active or 04/08/2026"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Verification Portal Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://dgft.gov.in"
                    value={formData.verificationUrl}
                    onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Description &amp; Authorized Scope
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Scope of works, registered address, or compliance notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                {/* Upload Certificate Image File */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Certificate File (JPG, PNG, WEBP, or SVG)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4">
                    {filePreview ? (
                      <div className="relative aspect-[1/1.3] h-32 overflow-hidden rounded-lg border border-slate-300 bg-white">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                        <Upload className="h-6 w-6" />
                      </div>
                    )}

                    <div className="flex-1 text-center sm:text-left">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0077B6] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#0284c7] cursor-pointer"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        High-resolution scanned certificate document. Max 10MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Order & Active Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Display Order (1 = First)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#0077B6] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0077B6] focus:ring-[#0077B6]"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Active (Display in Landing Page Carousel)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#0077B6]/25 hover:bg-[#0284c7] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingCert ? "Save Changes" : "Upload Certificate"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Certificate Modal */}
      {previewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewCert(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col lg:flex-row max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setPreviewCert(null)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex-1 bg-slate-100 p-6 flex items-center justify-center">
              <div className="aspect-[1/1.4] max-h-[70vh] rounded-xl overflow-hidden shadow-xl bg-white border border-slate-300">
                <img
                  src={previewCert.imageUrl}
                  alt={previewCert.title}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="p-6 lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 bg-white">
              <div>
                <span className="rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#0077B6]">
                  {previewCert.category}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  {previewCert.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {previewCert.issuingAuthority}
                </p>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400">Reg No:</span>
                    <span className="ml-2 font-mono font-bold text-slate-900">{previewCert.certificateNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Validity:</span>
                    <span className="ml-2 font-semibold text-emerald-600">{previewCert.expiryDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {previewCert.verificationUrl && (
                  <a
                    href={previewCert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0077B6] py-2 text-xs font-semibold text-white hover:bg-[#0284c7]"
                  >
                    <span>Verify Live</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <a
                  href={previewCert.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>Open Original File</span>
                  <Maximize2 className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
