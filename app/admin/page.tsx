"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Inbox,
  ArrowRight,
  TrendingUp,
  Loader2,
  Search,
  CheckCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { DashboardHeader, TimeframeOption, MetricViewMode } from "@/components/admin/DashboardHeader";
import { KPICardsWithSparklines } from "@/components/admin/KPICardsWithSparklines";
import { PipelineTrendChart } from "@/components/admin/PipelineTrendChart";
import { PlantCategoryDonutChart } from "@/components/admin/PlantCategoryDonutChart";
import { SectorCapacityBarChart } from "@/components/admin/SectorCapacityBarChart";
import { ConversionFunnelChart } from "@/components/admin/ConversionFunnelChart";
import { WaterQualityRadarChart } from "@/components/admin/WaterQualityRadarChart";
import { RegionalMapDistribution } from "@/components/admin/RegionalMapDistribution";

interface RecentLeadItem {
  _id: string;
  fullName: string;
  companyName: string;
  plantCategory: string;
  requiredCapacityKLD: string;
  status: string;
  createdAt: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeOption>("30D");
  const [viewMode, setViewMode] = useState<MetricViewMode>("overview");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalLeads: 14,
    newLeads: 5,
    evaluationLeads: 4,
    wonLeads: 3,
    totalProducts: 6,
    totalJobs: 3,
    activeJobs: 3,
    totalApplications: 8,
  });

  const [recentLeads, setRecentLeads] = useState<RecentLeadItem[]>([
    {
      _id: "lead-1",
      fullName: "Rajesh Singhania",
      companyName: "Vardhman Textiles Ltd",
      plantCategory: "Effluent Treatment Plant (ETP)",
      requiredCapacityKLD: "250 KLD",
      status: "NEW",
      createdAt: "Today, 10:45 AM",
      priority: "CRITICAL",
    },
    {
      _id: "lead-2",
      fullName: "Anand Verma",
      companyName: "Ajnara Grand Heritage",
      plantCategory: "Sewage Treatment Plant (STP)",
      requiredCapacityKLD: "500 KLD",
      status: "TECHNICAL_EVALUATION",
      createdAt: "Yesterday, 3:20 PM",
      priority: "HIGH",
    },
    {
      _id: "lead-3",
      fullName: "Dr. Arvind Mehta",
      companyName: "Apex Formulations & Labs",
      plantCategory: "Demineralization (DM) Plant",
      requiredCapacityKLD: "50 m³/hr",
      status: "PROPOSAL_SENT",
      createdAt: "Oct 9, 2026",
      priority: "HIGH",
    },
    {
      _id: "lead-4",
      fullName: "Sunil Kothari",
      companyName: "Radisson Blu Resorts",
      plantCategory: "Water Softening Plant",
      requiredCapacityKLD: "30 m³/hr",
      status: "WON",
      createdAt: "Oct 8, 2026",
      priority: "MEDIUM",
    },
    {
      _id: "lead-5",
      fullName: "Vikram Singhal",
      companyName: "Indo Rama Synthetics",
      plantCategory: "RO & Zero Liquid Discharge (ZLD)",
      requiredCapacityKLD: "800 KLD",
      status: "TECHNICAL_EVALUATION",
      createdAt: "Oct 6, 2026",
      priority: "CRITICAL",
    },
    {
      _id: "lead-6",
      fullName: "Harish Chandra",
      companyName: "Haldiram Snacks Pvt Ltd",
      plantCategory: "Effluent Treatment Plant (ETP)",
      requiredCapacityKLD: "150 KLD",
      status: "NEW",
      createdAt: "Oct 5, 2026",
      priority: "MEDIUM",
    },
  ]);

  const fetchSummary = async () => {
    try {
      const res = await api.getAdminSummary();
      if (res.success && res.data) {
        const data = res.data;
        if (data.metrics) setStats(data.metrics);
        if (data.recentLeads && data.recentLeads.length > 0) {
          setRecentLeads(data.recentLeads);
        }
      }
    } catch {
      // Kept default demo metrics
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSummary();
  };

  // Export CSV summary of leads & pipeline metrics
  const handleExport = () => {
    const headers = ["Lead ID", "Company", "Contact Person", "Plant Category", "Required Capacity", "Stage", "Submission Date"];
    const rows = recentLeads.map((l) => [
      l._id,
      `"${l.companyName}"`,
      `"${l.fullName}"`,
      `"${l.plantCategory}"`,
      `"${l.requiredCapacityKLD}"`,
      l.status,
      `"${l.createdAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RP_Global_Executive_Analytics_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Exported RP Global Analytics Report (${timeframe}) to CSV`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">NEW</span>;
      case "TECHNICAL_EVALUATION":
        return <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">EVALUATION</span>;
      case "PROPOSAL_SENT":
        return <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">PROPOSAL SENT</span>;
      case "WON":
        return <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">WON</span>;
      default:
        return <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{status}</span>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "CRITICAL":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600"><span className="h-1.5 w-1.5 rounded-full bg-rose-600" />CRITICAL</span>;
      case "HIGH":
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />HIGH</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />MEDIUM</span>;
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return recentLeads.filter((lead) => {
      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.plantCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [recentLeads, statusFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-7" aria-busy={loading}>
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-[#0f1d31] px-3.5 py-2.5 text-xs text-white shadow-xl animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Interactive Dashboard Header */}
      <DashboardHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onExport={handleExport}
      />

      {/* 4 KPI Summary Cards with Interactive Live Sparklines */}
      <KPICardsWithSparklines stats={stats} timeframe={timeframe} />

      {/* GRAPHS GRID: Adapts dynamically based on active View Mode */}
      {viewMode === "overview" && (
        <div className="space-y-5 sm:space-y-6">
          {/* Row 1: Pipeline Velocity Trend (8 cols) + Plant Demand Donut (4 cols) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 sm:gap-6">
            <div className="lg:col-span-8">
              <PipelineTrendChart timeframe={timeframe} />
            </div>
            <div className="lg:col-span-4">
              <PlantCategoryDonutChart stats={stats} />
            </div>
          </div>

          {/* Row 2: Industrial Sector Capacity (6 cols) + Conversion Funnel (6 cols) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 sm:gap-6">
            <SectorCapacityBarChart />
            <ConversionFunnelChart />
          </div>

          {/* Row 3: Water Lab Compliance Radar (6 cols) + Regional Cluster Map (6 cols) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 sm:gap-6">
            <WaterQualityRadarChart />
            <RegionalMapDistribution />
          </div>
        </div>
      )}

      {viewMode === "plants" && (
        <div className="space-y-5 sm:space-y-6">
          {/* Plant Capacity & Engineering View */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 sm:gap-6">
            <div className="lg:col-span-7">
              <SectorCapacityBarChart />
            </div>
            <div className="lg:col-span-5">
              <PlantCategoryDonutChart stats={stats} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 sm:gap-6">
            <div className="lg:col-span-7">
              <PipelineTrendChart timeframe={timeframe} />
            </div>
            <div className="lg:col-span-5">
              <RegionalMapDistribution />
            </div>
          </div>
        </div>
      )}

      {viewMode === "compliance" && (
        <div className="space-y-5 sm:space-y-6">
          {/* Water Quality & Lab Compliance View */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 sm:gap-6">
            <div className="lg:col-span-7">
              <WaterQualityRadarChart />
            </div>
            <div className="lg:col-span-5">
              <ConversionFunnelChart />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 sm:gap-6">
            <div className="lg:col-span-8">
              <PipelineTrendChart timeframe={timeframe} />
            </div>
            <div className="lg:col-span-4">
              <PlantCategoryDonutChart stats={stats} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Leads Feed Table with Mobile-Optimized Search & Filter Bar */}
      <section
        className="overflow-hidden border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
        aria-labelledby="recent-leads-heading"
      >
        <div className="flex flex-col justify-between gap-3.5 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="recent-leads-heading" className="text-sm font-bold text-slate-900 sm:text-base">
                Recent Plant RFQ Inquiries
              </h2>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-slate-600">
                {filteredLeads.length} of {recentLeads.length}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              Technical proposals requested via website portal, sizing calculator, and direct engineering requests.
            </p>
          </div>

          {/* Search, Filter Tabs & View Link */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            {/* Quick Search - full width on mobile */}
            <div className="relative w-full sm:w-52">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search company or plant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0077B6] focus:outline-none"
              />
            </div>

            {/* Filter Pills & View All Link */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs shrink-0">
                {["ALL", "NEW", "TECHNICAL_EVALUATION", "PROPOSAL_SENT", "WON"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-md px-2 py-1 text-[10px] sm:text-[11px] font-medium transition-all ${
                      statusFilter === st
                        ? "bg-white text-slate-900 shadow-sm font-semibold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {st === "TECHNICAL_EVALUATION" ? "EVAL" : st === "PROPOSAL_SENT" ? "PROPOSAL" : st}
                  </button>
                ))}
              </div>

              <Link
                href="/admin/leads"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0077B6] hover:underline"
              >
                <span>View CRM</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Responsive Table with horizontal swipe indicator */}
        <div className="overflow-x-auto" role="region" aria-label="Recent plant RFQ inquiries" tabIndex={0}>
          <table className="w-full min-w-[760px] text-left text-xs sm:min-w-[920px]">
            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th scope="col" className="min-w-[170px] whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">Company / Client</th>
                <th scope="col" className="min-w-[200px] whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">Plant Solution</th>
                <th scope="col" className="min-w-[95px] whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">Capacity</th>
                <th scope="col" className="min-w-[105px] whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">Priority</th>
                <th scope="col" className="min-w-[115px] whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">Stage</th>
                <th scope="col" className="min-w-[130px] whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">Submission Time</th>
                <th scope="col" className="min-w-[110px] whitespace-nowrap px-4 py-3 text-right sm:px-5 sm:py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 sm:px-5 sm:py-4 font-medium text-slate-900">
                      <div className="font-semibold text-xs sm:text-sm">{lead.companyName}</div>
                      <div className="text-[10px] text-slate-400 font-normal sm:text-[11px]">{lead.fullName}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4 font-medium text-slate-700">
                      {lead.plantCategory}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4 font-mono font-bold tabular-nums text-[#0077B6]">
                      {lead.requiredCapacityKLD || "Standard"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">
                      {getPriorityBadge(lead.priority)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4 text-slate-500 text-[11px]">
                      {lead.createdAt}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4 text-right">
                      <Link
                        href={`/admin/leads?id=${lead._id}`}
                        className="text-xs font-semibold text-[#0077B6] hover:underline"
                      >
                        Inspect lead <span aria-hidden="true">→</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-xs sm:text-sm text-slate-500">
                    No inquiries matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
