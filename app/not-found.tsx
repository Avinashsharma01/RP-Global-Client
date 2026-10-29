import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Compass,
  Droplets,
  Factory,
  Home,
  PhoneCall,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata = {
  title: "404 — Industrial Pipeline Unreachable | R P Global Projects",
  description:
    "The requested plant specification, engineering document, or pipeline URL could not be found on the R P Global Projects portal.",
};

const POPULAR_SOLUTIONS = [
  { name: "Effluent Treatment Plant (ETP)", href: "/solutions/effluent-treatment-plants", tag: "Industrial ZLD" },
  { name: "Sewage Treatment Plant (STP)", href: "/solutions/sewage-treatment-plants", tag: "MBBR / MBR" },
  { name: "Reverse Osmosis (RO) Systems", href: "/solutions/reverse-osmosis-plants", tag: "High Recovery" },
  { name: "Demineralization (DM) Plant", href: "/solutions/demineralization-plants", tag: "Ultra Pure" },
  { name: "Water Treatment Plant (WTP)", href: "/solutions/water-treatment-plants", tag: "Surface Water" },
  { name: "Water Softener Systems", href: "/solutions/water-softener-plants", tag: "Ion-Exchange" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 flex flex-col justify-between selection:bg-[#00E5FF] selection:text-[#0A192F] relative overflow-hidden">
      {/* Background Technical Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d18_1px,transparent_1px),linear-gradient(to_bottom,#1f293d18_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col justify-center items-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wider mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>PAGE NOT FOUND // CHECK THE ADDRESS</span>
        </div>

        {/* Big Glitch Numeric 404 */}
        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tighter font-mono bg-gradient-to-b from-white via-slate-200 to-slate-600 bg-clip-text text-transparent select-none drop-shadow-2xl">
          4<span className="text-[#00E5FF]">0</span>4
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-2xl">
          This page is not available
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          The link may be out of date, or the address may have been entered incorrectly.
          Use one of the links below to continue.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-[#005f92] hover:to-[#0077B6] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#0077B6]/20 transition-all hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/solutions"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Factory className="w-4 h-4 text-[#00E5FF]" />
            <span>EPC Plant Solutions</span>
          </Link>

          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Compass className="w-4 h-4 text-[#10B981]" />
            <span>Project Gallery</span>
          </Link>

          <Link
            href="/contact-us"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>Contact Engineers</span>
          </Link>
        </div>

        {/* Quick Plant Solutions Directory */}
        <div className="mt-16 w-full max-w-4xl text-left bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
              <Droplets className="w-4 h-4" />
              <span>Plant solution directory</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              CPCB / SPCB Compliant EPC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {POPULAR_SOLUTIONS.map((sol) => (
              <Link
                key={sol.href}
                href={sol.href}
                className="group p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00E5FF]/40 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-[#00E5FF] transition-colors">
                    {sol.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{sol.tag}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00E5FF] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>
              Need urgent plant sizing or process troubleshooting? Call our direct line:
            </span>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="text-[#00E5FF] font-mono font-semibold hover:underline"
            >
              {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </main>

      {/* Technical Footer Telemetry Bar */}
      <footer className="relative z-10 border-t border-white/10 py-4 px-4 text-center font-mono text-[11px] text-slate-500 bg-[#071324]/80">
        R P GLOBAL PROJECTS • EPC INDUSTRIAL WATER & WASTEWATER SYSTEMS • ISO 9001:2015
      </footer>
    </div>
  );
}
