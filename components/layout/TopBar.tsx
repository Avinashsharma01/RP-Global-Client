import Link from "next/link";
import { Clock3, Mail, Phone, ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const TopBar = () => (
  <div className="hidden bg-[#0A192F] text-[10px] text-white/95 sm:block border-b border-white/10">
    <div className="mx-auto flex min-h-9 max-w-[1640px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-5">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-[#00E5FF]" /> ISO 9001:2015 certified
        </span>
        <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="inline-flex items-center gap-1.5 hover:text-cyan-200 transition-colors">
          <Phone className="h-3 w-3" />
          {COMPANY_INFO.phone}
        </a>
        <a href={`mailto:${COMPANY_INFO.email}`} className="inline-flex items-center gap-1.5 hover:text-cyan-200 transition-colors">
          <Mail className="h-3 w-3" />
          {COMPANY_INFO.email}
        </a>
      </div>
      <div className="flex items-center gap-5">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3 w-3" /> Mon–Sat, 10:00–18:00 IST
        </span>
        <Link href="/admin/login" className="border-l border-white/25 pl-5 transition-colors hover:text-cyan-200">
          Staff portal
        </Link>
      </div>
    </div>
  </div>
);
