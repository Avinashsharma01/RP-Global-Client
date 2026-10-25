"use client";

import React from "react";
import Link from "next/link";
import {
  Inbox,
  Download,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  Activity,
} from "lucide-react";

export type TimeframeOption = "7D" | "30D" | "90D" | "1Y";
export type MetricViewMode = "overview" | "plants" | "compliance";

interface DashboardHeaderProps {
  timeframe: TimeframeOption;
  onTimeframeChange: (tf: TimeframeOption) => void;
  viewMode: MetricViewMode;
  onViewModeChange: (mode: MetricViewMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExport: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  onExport,
}) => {
  const timeframes: { id: TimeframeOption; shortLabel: string; fullLabel: string }[] = [
    { id: "7D", shortLabel: "7D", fullLabel: "7 Days" },
    { id: "30D", shortLabel: "30D", fullLabel: "30 Days" },
    { id: "90D", shortLabel: "90D", fullLabel: "Quarter" },
    { id: "1Y", shortLabel: "1Y", fullLabel: "Fiscal Year" },
  ];

  const viewModes: {
    id: MetricViewMode;
    shortLabel: string;
    fullLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "overview", shortLabel: "Overview", fullLabel: "Executive Overview", icon: Activity },
    { id: "plants", shortLabel: "Plants & Demand", fullLabel: "Plant Capacity & Demand", icon: Layers },
    { id: "compliance", shortLabel: "Water Lab", fullLabel: "Water Lab & Discharge", icon: Sparkles },
  ];

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:gap-5 sm:pb-6">
      {/* Top row: Title, Status Pill, and Mobile-Optimized Action Buttons */}
      <div className="flex flex-col justify-between gap-3.5 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              Executive Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 sm:text-[11px] sm:px-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse sm:h-2 sm:w-2" />
              Live Operations
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Real-time pipeline metrics, plant engineering capacities, RFQ conversions, and water lab analytics.
          </p>
        </div>

        {/* Action Buttons: 2-column grid on small mobile, row on tablet/desktop */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0077B6]"
            aria-label="Refresh dashboard analytics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 shrink-0 ${isRefreshing ? "animate-spin text-[#0077B6]" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0077B6]"
            aria-label="Export dashboard report"
          >
            <Download className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span>Export Report</span>
          </button>

          <Link
            href="/admin/leads"
            className="col-span-2 sm:col-span-1 inline-flex min-h-9 items-center justify-center gap-2 bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#005f92] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6]"
          >
            <Inbox className="h-4 w-4 shrink-0" />
            <span>Open Leads CRM</span>
          </Link>
        </div>
      </div>

      {/* Bottom row: Horizontally scrollable View Tabs and Timeframe Selector */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Metric View Tabs (Horizontal swipeable on mobile) */}
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/90 p-1 text-xs flex-nowrap shrink-0">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onViewModeChange(mode.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#0077B6]" : "text-slate-400"}`} />
                  <span className="sm:hidden">{mode.shortLabel}</span>
                  <span className="hidden sm:inline">{mode.fullLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe Selector (Compact on mobile) */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium shrink-0">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden xs:inline">Period:</span>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs sm:p-1 shrink-0">
            {timeframes.map((tf) => {
              const isActive = timeframe === tf.id;
              return (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => onTimeframeChange(tf.id)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold transition-all sm:px-2.5 ${
                    isActive
                      ? "bg-[#0077B6] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="sm:hidden">{tf.shortLabel}</span>
                  <span className="hidden sm:inline">{tf.fullLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
