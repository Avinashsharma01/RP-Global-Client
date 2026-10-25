import React from "react";
import { GitCompare } from "lucide-react";
import { ComparisonRow } from "@/lib/types";

interface TechnologyComparisonProps {
  rows?: ComparisonRow[];
  plantName: string;
}

export const TechnologyComparison: React.FC<TechnologyComparisonProps> = ({
  rows,
  plantName,
}) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0077B6] uppercase tracking-wider mb-1">
          <GitCompare className="w-4 h-4 text-[#0077B6]" />
          <span>Technology Evaluation Matrix</span>
        </div>
        <h3 className="text-xl font-bold text-[#0A192F]">
          Comparative Analysis for {plantName}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Compare treatment process options to identify the ideal balance of CAPEX, footprint, and effluent quality
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A192F] text-white">
            <tr>
              <th className="py-3.5 px-6 font-semibold">Evaluation Criteria</th>
              <th className="py-3.5 px-6 font-semibold text-[#00E5FF]">Option A (Conventional)</th>
              <th className="py-3.5 px-6 font-semibold text-[#10B981]">Option B (Advanced EPC)</th>
              <th className="py-3.5 px-6 font-semibold text-amber-400">Option C (Ultra-Purity)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-slate-900 bg-slate-50/50">
                  {row.parameter}
                </td>
                <td className="py-3.5 px-6 text-slate-600">
                  {row.techOptionA}
                </td>
                <td className="py-3.5 px-6 text-slate-800 font-medium bg-[#10B981]/5">
                  {row.techOptionB}
                </td>
                <td className="py-3.5 px-6 text-slate-600">
                  {row.techOptionC || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
