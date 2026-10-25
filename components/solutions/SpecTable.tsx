import React from "react";
import { Sliders, CheckCircle2 } from "lucide-react";
import { TechnicalSpec } from "@/lib/types";

interface SpecTableProps {
  specs: TechnicalSpec[];
  plantName: string;
}

export const SpecTable: React.FC<SpecTableProps> = ({ specs, plantName }) => {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0077B6] uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4 text-[#0077B6]" />
          <span>Technical Engineering Parameters</span>
        </div>
        <h3 className="text-xl font-bold text-[#0A192F]">
          {plantName} Performance & Mechanical Specifications
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Guaranteed effluent and mechanical parameters verified during factory acceptance testing (FAT)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-6">Specification Parameter</th>
              <th className="py-3 px-6">Engineering Value / Standard</th>
              <th className="py-3 px-6">Unit</th>
              <th className="py-3 px-6">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {specs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-6 font-sans font-semibold text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{spec.label}</span>
                </td>
                <td className="py-3.5 px-6 text-[#0077B6] font-bold">
                  {spec.value}
                </td>
                <td className="py-3.5 px-6 text-slate-500">
                  {spec.unit || "—"}
                </td>
                <td className="py-3.5 px-6 text-slate-400 font-sans">
                  {spec.category || "General"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
