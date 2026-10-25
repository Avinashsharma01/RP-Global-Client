"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  FileQuestion,
  Sparkles,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { api } from "@/lib/api";
import { FAQItem } from "@/lib/types";

const PREDEFINED_CATEGORIES = [
  "General",
  "STP & ETP Plants",
  "RO & DM Systems",
  "Compliance & Approvals",
  "Operations & Maintenance",
];

const DEFAULT_FALLBACK_FAQS: FAQItem[] = [
  {
    _id: "faq-1",
    question: "What types of industrial water and wastewater treatment plants does RP Global design and manufacture?",
    answer: "RP Global Projects engineers, manufactures, and commissions a complete turnkey portfolio: Sewage Treatment Plants (STP) using MBBR, SBR, and MBR technologies; Effluent Treatment Plants (ETP) with chemical, biological, and tertiary polishing; Industrial Reverse Osmosis (RO) plants; Demineralization (DM) two-bed and mixed-bed systems; Industrial Water Softeners; and Zero Liquid Discharge (ZLD) plants with Multi-Effect Evaporators (MEE) and ATFDs.",
    category: "General",
    order: 1,
    isActive: true,
    tags: ["EPC", "Plant Types", "Turnkey"],
  },
  {
    _id: "faq-2",
    question: "How does RP Global ensure compliance with CPCB and State Pollution Control Board (SPCB) discharge norms?",
    answer: "Every plant is custom-engineered around the client's inlet effluent characteristics (BOD, COD, TSS, TDS, Heavy Metals, pH) and designed strictly to meet or exceed CPCB/SPCB discharge standards. We provide treated effluent quality guarantees, process validation reports, and integrate online Continuous Emission/Effluent Monitoring Systems (OCEMS) with cloud telemetry directly linked to SPCB/CPCB server gateways.",
    category: "Compliance & Approvals",
    order: 2,
    isActive: true,
    tags: ["CPCB", "SPCB", "OCEMS", "Compliance"],
  },
  {
    _id: "faq-3",
    question: "What is the difference between MBBR, SBR, and MBR technologies for STP plants?",
    answer: "Moving Bed Biofilm Reactor (MBBR) uses virgin plastic media carriers for compact biological digestion with minimal footprint and low maintenance. Sequencing Batch Reactor (SBR) operates in batch phases (fill, react, settle, decant) offering high biological nutrient removal without separate clarifiers. Membrane Bioreactor (MBR) combines biological treatment with ultrafiltration membranes (<0.04 micron), producing crystal-clear water with BOD < 5 mg/L suitable for direct cooling tower reuse and flushing.",
    category: "STP & ETP Plants",
    order: 3,
    isActive: true,
    tags: ["STP", "MBBR", "SBR", "MBR"],
  },
  {
    _id: "faq-4",
    question: "What is Zero Liquid Discharge (ZLD) and when is it required for industrial facilities?",
    answer: "Zero Liquid Discharge (ZLD) is an advanced wastewater treatment process where all industrial effluent is purified, recycled back into operations, and concentrated into solid dry salts—leaving zero liquid discharge into municipal drains or surrounding environment. ZLD is mandatory for highly polluting 'Red Category' industries (Textiles, Distilleries, Pharmaceuticals, Tannery, Petrochemicals) under CPCB mandates.",
    category: "STP & ETP Plants",
    order: 4,
    isActive: true,
    tags: ["ZLD", "MEE", "Effluent", "Recycling"],
  },
  {
    _id: "faq-5",
    question: "What conductivity and purity levels can RP Global Demineralization (DM) plants achieve?",
    answer: "Our two-bed ion exchange DM systems (SAC + SBA) consistently produce treated water with electrical conductivity < 10 µS/cm. When integrated with a Mixed Bed (MB) Polishing unit or Electrodeionization (EDI), conductivity drops below 0.1 µS/cm with reactive silica < 0.02 ppm, satisfying critical boiler feedwater requirements (IBR standards) and USP-grade pharmaceutical formulations.",
    category: "RO & DM Systems",
    order: 5,
    isActive: true,
    tags: ["DM Plant", "Conductivity", "Ion Exchange", "Boiler Feed"],
  },
  {
    _id: "faq-6",
    question: "What is the typical project execution timeline from order placement to commercial commissioning?",
    answer: "Turnkey project execution typically ranges from 4 to 8 weeks for packaged skid-mounted systems (10 KLD to 250 KLD), and 12 to 24 weeks for large-scale custom civil-reinforced EPC installations (500 KLD to 10,000+ KLD). Timeline includes detailed engineering drawings (P&ID, GA), statutory vetting, fabrication, factory acceptance testing (FAT), on-site installation, and wet commissioning with bacterial seeding.",
    category: "General",
    order: 6,
    isActive: true,
    tags: ["Timeline", "EPC", "Commissioning"],
  },
  {
    _id: "faq-7",
    question: "Do you offer Annual Maintenance Contracts (AMC) and Plant Operation & Maintenance (O&M)?",
    answer: "Yes. RP Global provides full-spectrum Operation & Maintenance (O&M) contracts with dedicated, trained site engineers, chemical dosing management, daily laboratory testing logs, preventative maintenance, and statutory audit compliance. We also offer Comprehensive and Non-Comprehensive AMCs with 24/7 breakdown support across North India.",
    category: "Operations & Maintenance",
    order: 7,
    isActive: true,
    tags: ["AMC", "O&M", "Maintenance", "Service"],
  },
  {
    _id: "faq-8",
    question: "Can RP Global retrofit, upgrade, or expand existing under-performing water treatment plants?",
    answer: "Absolutely. We specialize in plant audits and brownfield upgrades. Typical revamps include upgrading conventional ASP/civil plants to high-rate MBBR/MBR to double throughput within the same physical tanks, replacing aging sand/carbon filters with automated multi-port disc filtration, upgrading RO membranes, and retrofitting PLC/SCADA automation.",
    category: "Operations & Maintenance",
    order: 8,
    isActive: true,
    tags: ["Retrofit", "Upgrade", "Audits", "Capacity Expansion"],
  },
];

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FALLBACK_FAQS);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);

  // Form State
  const [formQuestion, setFormQuestion] = useState<string>("");
  const [formAnswer, setFormAnswer] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("General");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formTags, setFormTags] = useState<string>("");

  // Action status / feedback
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Load FAQs from API
  const loadFAQs = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminFAQs();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setFaqs(res.data);
      }
    } catch {
      // Keep fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  // Compute categories
  const allCategories = useMemo(() => {
    const set = new Set<string>(PREDEFINED_CATEGORIES);
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "ALL" || faq.category === selectedCategory;

      const isActive = faq.isActive !== false;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "INACTIVE" && !isActive);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q) ||
        faq.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [faqs, selectedCategory, statusFilter, searchQuery]);

  // Metrics
  const activeCount = faqs.filter((f) => f.isActive !== false).length;
  const inactiveCount = faqs.length - activeCount;

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormQuestion("");
    setFormAnswer("");
    setFormCategory("General");
    setCustomCategory("");
    setFormOrder(faqs.length + 1);
    setFormIsActive(true);
    setFormTags("");
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  // Open modal for Edit
  const handleOpenEditModal = (item: FAQItem) => {
    setEditingItem(item);
    setFormQuestion(item.question);
    setFormAnswer(item.answer);
    if (PREDEFINED_CATEGORIES.includes(item.category)) {
      setFormCategory(item.category);
      setCustomCategory("");
    } else {
      setFormCategory("OTHER");
      setCustomCategory(item.category);
    }
    setFormOrder(item.order || 1);
    setFormIsActive(item.isActive !== false);
    setFormTags(item.tags ? item.tags.join(", ") : "");
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  // Submit Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formQuestion.trim() || !formAnswer.trim()) {
      setStatusMsg({ text: "Please enter both a question and answer.", type: "error" });
      return;
    }

    const resolvedCategory =
      formCategory === "OTHER"
        ? customCategory.trim() || "General"
        : formCategory;

    const parsedTags = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSubmitting(true);
    setStatusMsg(null);

    const payload: Partial<FAQItem> = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      category: resolvedCategory,
      order: Number(formOrder) || 1,
      isActive: formIsActive,
      tags: parsedTags,
    };

    try {
      if (editingItem && (editingItem._id || editingItem.id)) {
        const id = editingItem._id || editingItem.id!;
        const res = await api.updateFAQ(id, payload);

        if (res.success && res.data) {
          setFaqs((prev) =>
            prev.map((f) => ((f._id || f.id) === id ? (res.data as FAQItem) : f))
          );
        } else {
          // Local optimistic update
          setFaqs((prev) =>
            prev.map((f) =>
              (f._id || f.id) === id
                ? {
                    ...f,
                    ...payload,
                    updatedAt: new Date().toISOString(),
                  }
                : f
            )
          );
        }
        setStatusMsg({ text: "FAQ updated successfully!", type: "success" });
      } else {
        const res = await api.createFAQ(payload);

        if (res.success && res.data) {
          setFaqs((prev) => [...prev, res.data as FAQItem]);
        } else {
          // Local fallback creation
          const newItem: FAQItem = {
            _id: `faq-${Date.now()}`,
            question: payload.question!,
            answer: payload.answer!,
            category: payload.category!,
            order: payload.order!,
            isActive: payload.isActive!,
            tags: payload.tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setFaqs((prev) => [...prev, newItem]);
        }
        setStatusMsg({ text: "New FAQ published successfully!", type: "success" });
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMsg(null);
      }, 700);
    } catch {
      setStatusMsg({ text: "Failed to save FAQ. Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (item: FAQItem) => {
    const id = item._id || item.id!;
    const newStatus = !(item.isActive !== false);

    // Optimistic UI update
    setFaqs((prev) =>
      prev.map((f) => ((f._id || f.id) === id ? { ...f, isActive: newStatus } : f))
    );

    try {
      await api.updateFAQ(id, { isActive: newStatus });
    } catch {
      // Revert if API fails
      setFaqs((prev) =>
        prev.map((f) => ((f._id || f.id) === id ? { ...f, isActive: !newStatus } : f))
      );
    }
  };

  // Delete FAQ
  const handleDelete = async (id: string) => {
    // Optimistic delete
    setFaqs((prev) => prev.filter((f) => (f._id || f.id) !== id));
    setDeleteId(null);

    try {
      await api.deleteFAQ(id);
    } catch {
      // Local deletion was already performed
    }
  };

  return (
    <div className="admin-page mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#1a5962]">
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1a5962]">
              Website Knowledge Base
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.8rem]">
              FAQ Management
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Create, edit, toggle visibility, and organize frequently asked questions for the public landing page.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadFAQs}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            title="Refresh FAQs from server"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1a5962] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#14474e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </header>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total FAQs
            </span>
            <FileQuestion className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{faqs.length}</p>
          <span className="text-[10px] text-slate-400">Total in repository</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Live on Site
            </span>
            <Eye className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{activeCount}</p>
          <span className="text-[10px] text-slate-400">Displayed to visitors</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Hidden / Drafts
            </span>
            <EyeOff className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{inactiveCount}</p>
          <span className="text-[10px] text-slate-400">Not shown on landing page</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-cyan-700">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Categories
            </span>
            <Layers className="h-4 w-4 text-cyan-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{allCategories.length}</p>
          <span className="text-[10px] text-slate-400">Knowledge topics</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, answers, tags, or categories..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1a5962] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
            >
              <option value="ALL">All Categories ({faqs.length})</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only ({activeCount})</option>
            <option value="INACTIVE">Hidden Only ({inactiveCount})</option>
          </select>
        </div>
      </div>

      {/* FAQs List Table / Cards */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-slate-700">No questions found</h3>
            <p className="mt-1 text-xs text-slate-500">
              {searchQuery || selectedCategory !== "ALL" || statusFilter !== "ALL"
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first FAQ question."}
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#1a5962] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#14474e]"
            >
              <Plus className="h-4 w-4" />
              <span>Add FAQ</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, index) => {
              const id = faq._id || faq.id || `faq-${index}`;
              const isActive = faq.isActive !== false;

              return (
                <div
                  key={id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Order Badge */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-600">
                      #{faq.order || index + 1}
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Category & Status Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1a5962] border border-[#1a5962]/15">
                          {faq.category}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(faq)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all cursor-pointer ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                          }`}
                          title={isActive ? "Click to hide from site" : "Click to publish to site"}
                        >
                          {isActive ? (
                            <>
                              <Eye className="h-3 w-3" />
                              <span>Live on Website</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              <span>Hidden Draft</span>
                            </>
                          )}
                        </button>

                        {faq.tags && faq.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded px-1.5 py-0.5 text-[9px] font-medium bg-slate-100 text-slate-600"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Question */}
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                        {faq.question}
                      </h3>

                      {/* Answer preview */}
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(faq)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      title="Edit FAQ"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#1a5962]">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingItem ? "Edit FAQ Item" : "Create New FAQ"}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {editingItem
                      ? "Update question content, categorization, and order."
                      : "Add a new technical or statutory clarification for visitors."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {statusMsg && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
                    statusMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {statusMsg.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* Question Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g., What is the difference between MBBR, SBR, and MBR technologies?"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
                />
              </div>

              {/* Category & Order in grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
                  >
                    {PREDEFINED_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="OTHER">+ Custom Category</option>
                  </select>

                  {formCategory === "OTHER" && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Type custom category name..."
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
                  />
                  <p className="text-[10px] text-slate-400">
                    Lower numbers appear higher on the landing page.
                  </p>
                </div>
              </div>

              {/* Answer Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Detailed Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Provide comprehensive, engineering-backed explanations..."
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed text-slate-900 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Tags (Comma separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g., CPCB, SPCB, MBBR, Compliance"
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-[#1a5962] focus:outline-none focus:ring-1 focus:ring-[#1a5962]"
                  />
                </div>
              </div>

              {/* Live Switch */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="form-is-active"
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1a5962] focus:ring-[#1a5962]"
                />
                <label htmlFor="form-is-active" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Publish live to website immediately
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1a5962] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#14474e] transition-colors disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingItem ? "Update FAQ" : "Publish FAQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete FAQ Question?</h3>
                <p className="text-xs text-slate-500">This action will remove the question permanently.</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
