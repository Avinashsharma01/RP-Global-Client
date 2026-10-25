"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  FileText,
  Phone,
  CheckCircle2,
  X,
  Plus,
  Send,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Lead, LeadStatus } from "@/lib/types";

const DEMO_LEADS: Lead[] = [
  {
    _id: "lead-1",
    fullName: "Rajesh Singhania",
    companyName: "Vardhman Textiles Ltd",
    email: "rajesh.singhania@vardhman.com",
    phone: "+91 9876543210",
    plantCategory: "Effluent Treatment Plant (ETP)",
    requiredCapacityKLD: "250 KLD",
    rawWaterSource: "Industrial Chemical Effluent",
    inletParameters: { pH: "8.2", TDS: "3200", COD: "1850", BOD: "650", TSS: "420" },
    projectLocation: "Bhiwadi, Rajasthan",
    message: "Need turnkey ETP with filter press to achieve Zero Liquid Discharge (ZLD) before next SPCB audit.",
    status: "NEW",
    priority: "HIGH",
    internalNotes: [
      { text: "Spoke with client. Site inspection scheduled for Wednesday.", author: "Sales Team", createdAt: "2026-10-10T11:00:00Z" },
    ],
    source: "Homepage Calculator",
    createdAt: "2026-10-11T10:45:00Z",
    updatedAt: "2026-10-11T10:45:00Z",
  },
  {
    _id: "lead-2",
    fullName: "Col. Sanjeev Verma (Retd.)",
    companyName: "Ajnara Grand Heritage RWA",
    email: "estate.manager@ajnara.com",
    phone: "+91 9811223344",
    plantCategory: "Sewage Treatment Plant (STP)",
    requiredCapacityKLD: "500 KLD",
    rawWaterSource: "Domestic Sewage",
    inletParameters: { pH: "7.1", BOD: "350", COD: "700", TSS: "280" },
    projectLocation: "Sector 74, Noida, UP",
    message: "Upgrading existing civil STP to MBBR system with zero foul odor for toilet flushing and gardening.",
    status: "TECHNICAL_EVALUATION",
    priority: "HIGH",
    internalNotes: [
      { text: "Detailed biological sizing shared with MEP consultant.", author: "Process Desk", createdAt: "2026-10-10T15:30:00Z" },
    ],
    source: "Contact Us Form",
    createdAt: "2026-10-10T15:20:00Z",
    updatedAt: "2026-10-10T15:20:00Z",
  },
  {
    _id: "lead-3",
    fullName: "Dr. Arvind Mehta",
    companyName: "Apex Formulations & Labs",
    email: "arvind.mehta@apexlabs.in",
    phone: "+91 9723456789",
    plantCategory: "Demineralization (DM) Plant",
    requiredCapacityKLD: "50 m³/hr",
    rawWaterSource: "Borewell High TDS",
    inletParameters: { pH: "7.4", TDS: "1400", TSS: "10" },
    projectLocation: "Baddi, Himachal Pradesh",
    message: "Requires product water conductivity < 0.1 µS/cm for high pressure pharma boiler feed.",
    status: "PROPOSAL_SENT",
    priority: "MEDIUM",
    internalNotes: [
      { text: "Commercial quotation sent via email.", author: "Admin Desk", createdAt: "2026-10-09T18:00:00Z" },
    ],
    source: "Solution Page RFQ",
    createdAt: "2026-10-09T14:15:00Z",
    updatedAt: "2026-10-09T14:15:00Z",
  },
  {
    _id: "lead-4",
    fullName: "Sunil Kothari",
    companyName: "Radisson Blu Resorts",
    email: "sunil.k@radissonresorts.com",
    phone: "+91 9988776655",
    plantCategory: "Water Softening Plant",
    requiredCapacityKLD: "30 m³/hr",
    rawWaterSource: "Borewell Groundwater",
    projectLocation: "Gurugram, Haryana",
    message: "Hard water scale removal for HVAC cooling tower and central laundry facility.",
    status: "WON",
    priority: "MEDIUM",
    internalNotes: [
      { text: "Purchase order signed. Advance payment cleared.", author: "Sales Lead", createdAt: "2026-10-08T12:00:00Z" },
    ],
    source: "Website RFQ Portal",
    createdAt: "2026-10-08T09:30:00Z",
    updatedAt: "2026-10-08T09:30:00Z",
  },
];

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "TECHNICAL_EVALUATION",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  TECHNICAL_EVALUATION: "Technical review",
  PROPOSAL_SENT: "Proposal sent",
  WON: "Won",
  LOST: "Lost",
};

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 8000);

    const fetchLeads = async () => {
      try {
        const res = await api.getAdminLeads();
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setLeads(res.data);
        }
      } catch {
        // Fallback to DEMO_LEADS
      } finally {
        window.clearTimeout(fallbackTimer);
        if (isMounted) setLoading(false);
      }
    };
    fetchLeads();
    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: newStatus as LeadStatus } : l))
    );
    if (selectedLead && selectedLead._id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus as LeadStatus } : null));
    }

    try {
      await api.updateLeadStatus(leadId, newStatus);
    } catch {
      // Local state already updated
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    const noteObj = {
      text: newNote.trim(),
      author: "Admin Staff",
      createdAt: new Date().toISOString(),
    };

    const updatedLead = {
      ...selectedLead,
      internalNotes: [...(selectedLead.internalNotes || []), noteObj],
    };

    setSelectedLead(updatedLead);
    setLeads((prev) => prev.map((l) => (l._id === selectedLead._id ? updatedLead : l)));
    setNewNote("");

    try {
      await api.addLeadNote(selectedLead._id, noteObj.text);
    } catch {
      // Local state updated
    }
  };

  // Filtered list
  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      (lead.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.plantCategory || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.projectLocation || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeLeadCount = leads.filter((lead) => !["WON", "LOST"].includes(lead.status)).length;
  const newLeadCount = leads.filter((lead) => lead.status === "NEW").length;
  const evaluationCount = leads.filter((lead) => lead.status === "TECHNICAL_EVALUATION").length;
  const wonLeadCount = leads.filter((lead) => lead.status === "WON").length;
  const leadCountByStatus = (stage: LeadStatus) =>
    leads.filter((lead) => lead.status === stage).length;

  return (
    <div className="admin-page mx-auto max-w-7xl space-y-6" aria-busy={loading}>
      {/* Page Header */}
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <Inbox className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">Sales pipeline</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.8rem]">
              Leads & RFQ
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Review inquiries, move opportunities through the pipeline, and keep technical notes together.
            </p>
          </div>
        </div>
        {loading && <span role="status" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing leads…</span>}
      </header>

      <section aria-label="Lead pipeline summary" className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        {[
          { label: "Open inquiries", value: activeLeadCount, detail: "Awaiting resolution", color: "text-slate-900" },
          { label: "New leads", value: newLeadCount, detail: "Need first contact", color: "text-[#0077B6]" },
          { label: "In evaluation", value: evaluationCount, detail: "Technical review", color: "text-amber-700" },
          { label: "Won", value: wonLeadCount, detail: "Converted projects", color: "text-emerald-700" },
        ].map((metric) => (
          <div key={metric.label} className={`px-4 py-3.5 sm:px-5 ${metric.label === "Open inquiries" || metric.label === "New leads" ? "border-b border-slate-200 sm:border-b-0" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${metric.label === "New leads" ? "bg-[#0077B6]" : metric.label === "In evaluation" ? "bg-amber-500" : metric.label === "Won" ? "bg-emerald-500" : "bg-slate-400"}`} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className={`font-mono text-2xl font-semibold tabular-nums ${metric.color}`}>{metric.value}</span>
              <span className="text-xs text-slate-500">{metric.detail}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Filter and Search Bar */}
      <section aria-label="Lead filters" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Search leads by company, contact, plant type, location, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, contact, location…"
              className="min-h-10 w-full border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#0077B6]"
            />
          </div>
          <span className="text-xs text-slate-500" aria-live="polite">
            <strong className="font-semibold text-slate-800">{filteredLeads.length}</strong> of {leads.length} inquiries
          </span>
        </div>

        <div aria-label="Filter leads by pipeline stage" role="group" className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            aria-pressed={statusFilter === "ALL"}
            onClick={() => setStatusFilter("ALL")}
            className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "ALL"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All stages <span className="ml-1 opacity-70">{leads.length}</span>
          </button>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              type="button"
              aria-pressed={statusFilter === st}
              onClick={() => setStatusFilter(st)}
              className={`min-h-9 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === st
                  ? "border-blue-300 bg-blue-50 text-[#005f92]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {LEAD_STATUS_LABELS[st]} <span className="ml-1 opacity-70">{leadCountByStatus(st)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Leads Table */}
      <div className="space-y-3 xl:hidden">
        {filteredLeads.map((lead) => (
          <article key={lead._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900">{lead.companyName}</h2>
                <p className="mt-1 text-xs text-slate-500">{lead.fullName}</p>
              </div>
              <label className="sr-only" htmlFor={`lead-stage-${lead._id}`}>Pipeline stage for {lead.companyName}</label>
              <select
                id={`lead-stage-${lead._id}`}
                value={lead.status}
                onChange={(event) => handleStatusChange(lead._id, event.target.value)}
                className="min-h-9 max-w-44 border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
              >
                {STATUS_OPTIONS.map((stage) => <option key={stage} value={stage}>{LEAD_STATUS_LABELS[stage]}</option>)}
              </select>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
              <div><p className="text-slate-400">Plant solution</p><p className="mt-1 font-medium text-slate-800">{lead.plantCategory}</p></div>
              <div><p className="text-slate-400">Required capacity</p><p className="mt-1 font-mono font-semibold text-[#0077B6]">{lead.requiredCapacityKLD || "Standard"}</p></div>
              <div className="col-span-2"><p className="text-slate-400">Contact</p><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-slate-700"><a href={`mailto:${lead.email}`} className="break-all hover:text-[#0077B6]">{lead.email}</a><a href={`tel:${lead.phone}`} className="hover:text-[#0077B6]">{lead.phone}</a></div></div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              {lead.attachedReportUrl ? (
                <a href={lead.attachedReportUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-[#0077B6] hover:underline"><FileText className="h-3.5 w-3.5" /> View lab report</a>
              ) : <span className="text-xs text-slate-400">No report attached</span>}
              <button type="button" onClick={() => setSelectedLead(lead)} className="min-h-9 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0077B6] hover:text-[#0077B6]">Inspect details</button>
            </div>
          </article>
        ))}
        {filteredLeads.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><div className="font-semibold text-slate-800">No leads match these filters</div><p className="mt-1 text-sm text-slate-500">Try another search or pipeline stage.</p></div>}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:block">
        <div className="overflow-x-auto" role="region" aria-label="Leads pipeline table" tabIndex={0}>
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th scope="col" className="px-5 py-3.5">Company / Contact</th>
                <th scope="col" className="px-5 py-3.5">Plant Type</th>
                <th scope="col" className="px-5 py-3.5">Capacity</th>
                <th scope="col" className="px-5 py-3.5">Report</th>
                <th scope="col" className="px-5 py-3.5">Pipeline Stage</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{lead.companyName}</div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {lead.fullName} • {lead.phone}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                    {lead.plantCategory}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono font-bold text-[#0077B6]">
                    {lead.requiredCapacityKLD || "Standard"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {lead.attachedReportUrl ? (
                      <a
                        href={lead.attachedReportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[#0077B6] font-semibold hover:underline focus-visible:outline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Lab PDF</span>
                      </a>
                    ) : (
                      <span className="text-slate-400">None attached</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      aria-label={`Update pipeline stage for ${lead.companyName}`}
                      className="min-h-9 px-2.5 py-1 text-xs font-semibold bg-white cursor-pointer outline-none"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {LEAD_STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0077B6] hover:bg-[#0077B6] hover:text-white"
                    >
                      Inspect Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="font-semibold text-slate-800">No leads match these filters</div>
                    <p className="mt-1 text-sm text-slate-500">Try another search or pipeline stage.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-2 backdrop-blur-[2px] sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="lead-detail-title" className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92dvh]">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 bg-[#0f1d31] p-4 text-white sm:p-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
                  RFQ lead
                </span>
                <h3 id="lead-detail-title" className="mt-0.5 text-lg font-bold text-white">
                  {selectedLead.companyName}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close lead details"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="space-y-5 overflow-y-auto p-4 text-sm sm:p-6">
              {/* Contact Snapshot */}
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Client Name:</span>
                  <span className="font-bold text-slate-900">{selectedLead.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Direct Phone:</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-[#0077B6] hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address:</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-bold text-slate-900 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Plant Solution:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.plantCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target Capacity:</span>
                  <span className="font-bold font-mono text-[#0077B6]">{selectedLead.requiredCapacityKLD}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Water Source:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.rawWaterSource}</span>
                </div>
              </div>

              {/* Inlet Chemistry Parameters */}
              {selectedLead.inletParameters && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Inlet Water Chemistry Parameters:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 font-mono text-center sm:grid-cols-4">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">pH</span>
                      <span className="font-bold text-[#0077B6]">{selectedLead.inletParameters.pH || "N/A"}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">TDS (mg/L)</span>
                      <span className="font-bold text-[#0077B6]">{selectedLead.inletParameters.TDS || "N/A"}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">COD (mg/L)</span>
                      <span className="font-bold text-[#0077B6]">{selectedLead.inletParameters.COD || "N/A"}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">BOD (mg/L)</span>
                      <span className="font-bold text-[#0077B6]">{selectedLead.inletParameters.BOD || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Attached Lab Report */}
              {selectedLead.attachedReportUrl && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Laboratory Water Test Report</span>
                      <span className="text-[11px] text-slate-500">{selectedLead.attachedReportFilename || "water_analysis.pdf"}</span>
                    </div>
                  </div>
                  <a
                    href={selectedLead.attachedReportUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Open Document
                  </a>
                </div>
              )}

              {/* Project Message */}
              {selectedLead.message && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Client Requirements & Scope:
                  </h4>
                  <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              {/* Status Changer in Drawer */}
              <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg bg-slate-100 p-3 sm:flex-row sm:items-center">
                <span className="font-bold text-slate-800">Update Sales Pipeline Stage:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                  aria-label="Update sales pipeline stage"
                  className="min-h-10 bg-white px-3 py-1.5 text-xs font-semibold"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Sales & Technical Notes History */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                  Internal Engineering & Sales Remarks
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedLead.internalNotes && selectedLead.internalNotes.length > 0 ? (
                    selectedLead.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-700">{note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-800">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No remarks recorded yet.</p>
                  )}
                </div>

                {/* Add Note Input Form */}
                <form onSubmit={handleAddNote} className="flex flex-col gap-2 pt-1 sm:flex-row">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add follow-up remark or meeting note..."
                    aria-label="Add an internal note"
                    className="min-h-10 flex-1 px-3 py-2 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005f92]"
                  >
                    <span>Save</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
