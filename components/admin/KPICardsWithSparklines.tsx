"use client";

import React from "react";
import {
  Inbox,
  TrendingUp,
  Droplets,
  DollarSign,
  Award,
} from "lucide-react";

interface KPICardsProps {
  stats: {
    totalLeads: number;
    newLeads: number;
    evaluationLeads: number;
    wonLeads: number;
    totalProducts: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
  };
  timeframe: string;
}

export const KPICardsWithSparklines: React.FC<KPICardsProps> = ({
  stats,
  timeframe,
}) => {
  // Sparkline data points for visual trends
  const leadsSparkline = [8, 9, 11, 10, 13, 12, 14];
  const valueSparkline = [2.4, 2.9, 3.2, 3.6, 4.1, 4.4, 4.85];
  const capacitySparkline = [3200, 3600, 4100, 4400, 4800, 5200, 5680];
  const winRateSparkline = [18, 20, 22, 21, 24, 26, 28.6];

  // Helper to generate smooth SVG path for sparklines
  const generateSparklinePath = (data: number[], width = 100, height = 32) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    const linePath = `M ${points.join(" L ")}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return { linePath, areaPath };
  };

  const leadsPaths = generateSparklinePath(leadsSparkline);
  const valuePaths = generateSparklinePath(valueSparkline);
  const capacityPaths = generateSparklinePath(capacitySparkline);
  const winRatePaths = generateSparklinePath(winRateSparkline);

  // Conversion rate calculation
  const winRate = stats.totalLeads > 0
    ? ((stats.wonLeads / stats.totalLeads) * 100).toFixed(1)
    : "21.4";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {/* Card 1: Total RFQ Inquiries */}
      <div className="group relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-all hover:border-[#0077B6]/40 hover:shadow-[0_4px_12px_rgba(0,119,182,0.08)] sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
              Total RFQ Inquiries
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2">
              <span className="font-mono text-2xl font-extrabold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                {stats.totalLeads}
              </span>
              <span className="text-xs text-slate-400 font-medium">leads</span>
            </div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6] sm:h-10 sm:w-10">
            <Inbox className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Sparkline & Trend */}
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-2.5 sm:mt-4 sm:pt-3">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>+18.4%</span>
              <span className="text-[10px] font-normal text-slate-400 sm:text-[11px]">prior {timeframe}</span>
            </div>
            <span className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
              <strong className="font-semibold text-slate-700">{stats.newLeads} new</strong> pending sizing
            </span>
          </div>

          <div className="h-8 w-20 shrink-0 overflow-hidden sm:h-9 sm:w-24">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="leadsGradMob" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0077B6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0077B6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={leadsPaths.areaPath} fill="url(#leadsGradMob)" />
              <path d={leadsPaths.linePath} fill="none" stroke="#0077B6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="100" cy="7" r="2.8" fill="#0077B6" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 2: Estimated Pipeline Value */}
      <div className="group relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-all hover:border-purple-300 hover:shadow-[0_4px_12px_rgba(139,92,246,0.08)] sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
              Pipeline Contract Value
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2">
              <span className="font-mono text-2xl font-extrabold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                ₹4.85
              </span>
              <span className="text-xs font-semibold text-purple-700">Crores</span>
            </div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 sm:h-10 sm:w-10">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Sparkline & Trend */}
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-2.5 sm:mt-4 sm:pt-3">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>+12.6%</span>
              <span className="text-[10px] font-normal text-slate-400 sm:text-[11px]">weighted MoM</span>
            </div>
            <span className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
              Avg ticket <strong className="font-semibold text-slate-700">₹34.6 L</strong>
            </span>
          </div>

          <div className="h-8 w-20 shrink-0 overflow-hidden sm:h-9 sm:w-24">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="valGradMob" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={valuePaths.areaPath} fill="url(#valGradMob)" />
              <path d={valuePaths.linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="100" cy="6" r="2.8" fill="#8b5cf6" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 3: Designed Capacity Pipeline */}
      <div className="group relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-all hover:border-cyan-300 hover:shadow-[0_4px_12px_rgba(6,182,212,0.08)] sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
              Treatment Capacity
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2">
              <span className="font-mono text-2xl font-extrabold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                5,680
              </span>
              <span className="text-xs font-semibold text-cyan-700">KLD</span>
            </div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 sm:h-10 sm:w-10">
            <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Sparkline & Trend */}
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-2.5 sm:mt-4 sm:pt-3">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>+24.1%</span>
              <span className="text-[10px] font-normal text-slate-400 sm:text-[11px]">capacity surge</span>
            </div>
            <span className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
              Across <strong className="font-semibold text-slate-700">14 sites</strong>
            </span>
          </div>

          <div className="h-8 w-20 shrink-0 overflow-hidden sm:h-9 sm:w-24">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="capGradMob" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={capacityPaths.areaPath} fill="url(#capGradMob)" />
              <path d={capacityPaths.linePath} fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="100" cy="5" r="2.8" fill="#06b6d4" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 4: Proposal-to-Win Conversion */}
      <div className="group relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-all hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)] sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
              Proposal Win Rate
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2">
              <span className="font-mono text-2xl font-extrabold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                {winRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-700">Win Index</span>
            </div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
            <Award className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Sparkline & Trend */}
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-2.5 sm:mt-4 sm:pt-3">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>+4.2%</span>
              <span className="text-[10px] font-normal text-slate-400 sm:text-[11px]">efficiency</span>
            </div>
            <span className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
              <strong className="font-semibold text-slate-700">{stats.wonLeads} plants</strong> won
            </span>
          </div>

          <div className="h-8 w-20 shrink-0 overflow-hidden sm:h-9 sm:w-24">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="winGradMob" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={winRatePaths.areaPath} fill="url(#winGradMob)" />
              <path d={winRatePaths.linePath} fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="100" cy="5" r="2.8" fill="#10b981" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
