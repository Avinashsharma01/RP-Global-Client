"use client";

import React, { useState } from "react";
import { Filter, Clock, UserCheck } from "lucide-react";

interface FunnelStep {
  id: string;
  stageName: string;
  count: number;
  conversionPercent: number;
  dropPercent: number;
  avgDuration: string;
  color: string;
  bgClass: string;
  borderClass: string;
}

export const ConversionFunnelChart: React.FC = () => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const funnelSteps: FunnelStep[] = [
    {
      id: "rfq",
      stageName: "1. RFQ Inquiries Submitted",
      count: 14,
      conversionPercent: 100,
      dropPercent: 0,
      avgDuration: "Day 0",
      color: "#0077B6",
      bgClass: "bg-[#0077B6]",
      borderClass: "border-[#0077B6]",
    },
    {
      id: "audit",
      stageName: "2. Water Analysis & Site Audit",
      count: 11,
      conversionPercent: 78.6,
      dropPercent: 21.4,
      avgDuration: "1.8 Days",
      color: "#0284c7",
      bgClass: "bg-[#0284c7]",
      borderClass: "border-[#0284c7]",
    },
    {
      id: "sizing",
      stageName: "3. Tech Sizing & BoQ Proposal",
      count: 7,
      conversionPercent: 50.0,
      dropPercent: 28.6,
      avgDuration: "3.2 Days",
      color: "#7c3aed",
      bgClass: "bg-[#7c3aed]",
      borderClass: "border-[#7c3aed]",
    },
    {
      id: "eval",
      stageName: "4. Technical Evaluation / Review",
      count: 4,
      conversionPercent: 28.6,
      dropPercent: 21.4,
      avgDuration: "5.4 Days",
      color: "#d97706",
      bgClass: "bg-[#d97706]",
      borderClass: "border-[#d97706]",
    },
    {
      id: "won",
      stageName: "5. Contract Won & Commissioned",
      count: 3,
      conversionPercent: 21.4,
      dropPercent: 7.2,
      avgDuration: "14.2 Days",
      color: "#10b981",
      bgClass: "bg-[#10b981]",
      borderClass: "border-[#10b981]",
    },
  ];

  return (
    <div className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
                Pipeline Conversion Funnel
              </h2>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                21.4% Win Rate
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              End-to-end B2B sales velocity from RFQ lead submission to commercial plant commissioning.
            </p>
          </div>
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>

        {/* Funnel Steps */}
        <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {funnelSteps.map((step, idx) => {
            const isHovered = hoveredStage === step.id;
            return (
              <div
                key={step.id}
                onMouseEnter={() => setHoveredStage(step.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`group rounded-lg border p-2.5 sm:p-3 transition-all ${
                  isHovered
                    ? "border-slate-300 bg-slate-50/80 shadow-sm"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="h-2 w-2 rounded-full shrink-0 sm:h-2.5 sm:w-2.5"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="font-semibold text-slate-800 text-[11px] sm:text-xs truncate">
                      {step.stageName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-4 sm:pl-0 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{step.avgDuration}</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {step.count} <span className="text-[10px] font-normal text-slate-500 sm:text-[11px]">leads</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 flex items-center gap-2.5 sm:gap-3">
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 sm:h-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${step.bgClass}`}
                      style={{ width: `${step.conversionPercent}%` }}
                    />
                  </div>
                  <span className="min-w-10 text-right font-mono text-[11px] sm:text-xs font-bold text-slate-700 tabular-nums">
                    {step.conversionPercent}%
                  </span>
                </div>

                {/* Drop-off helper indicator */}
                {idx > 0 && (
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 pl-4 sm:pl-0">
                    <span>Drop: -{step.dropPercent.toFixed(1)}%</span>
                    <span className="text-emerald-600 font-medium">Optimal</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 flex flex-col gap-1 border-t border-slate-100 pt-2.5 text-xs text-slate-600 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
        <div className="flex items-center gap-1.5">
          <UserCheck className="h-3.5 w-3.5 text-[#0077B6]" />
          <span>Avg sales cycle: <strong className="text-slate-900">14.2 days</strong></span>
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-emerald-600">
          +3.8% MoM Conversion Gain
        </span>
      </div>
    </div>
  );
};
