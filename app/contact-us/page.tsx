import React, { Suspense } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building2,
  Headphones,
  Waves,
  Droplets,
} from "lucide-react";
import { COMPANY_INFO, OFFICES } from "@/lib/constants";
import { RFQForm } from "@/components/contact/RFQForm";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

export const metadata = {
  title: "Contact Us & Engineering RFQ — R P Global Projects",
  description:
    "Get in touch with R P Global Projects corporate office in Noida and head office in Gopalganj. Submit your technical RFQ for industrial water & wastewater plants.",
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff]/60 via-[#f8fafc] to-[#e6f4f8]/40">
      {/* Header Banner with Aquatic Streamlines */}
      <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="azure" className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3.5 py-1 text-xs font-semibold text-[#0077b6] backdrop-blur-sm">
              <Headphones className="w-4 h-4 text-[#10B981]" />
              <span>Direct Engineering Consultations</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-4xl lg:text-5xl">
              Contact Us & Engineering RFQ Portal
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#45616b] sm:text-base">
              Reach out to our dual-office locations in Noida and Gopalganj. Submit your raw water laboratory parameters
              for preliminary sizing and techno-commercial proposals.
            </p>
          </div>
        </WaterBackgroundEffect>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Dual-Office Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Corporate Office Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0077B6] bg-[#0077B6]/10 px-3 py-1 rounded-full">
                  Primary Headquarters
                </span>
                <span className="text-xs text-slate-400 font-mono">NCR Office</span>
              </div>

              <h3 className="text-xl font-bold text-[#0A192F] mb-3">
                {OFFICES.corporate.title}
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                  <span>
                    {OFFICES.corporate.address},<br />
                    {OFFICES.corporate.city}, {OFFICES.corporate.country}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <a
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                    className="font-semibold text-slate-800 hover:text-[#0077B6] transition-colors"
                  >
                    {OFFICES.corporate.phone}
                  </a>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#0077B6] shrink-0" />
                  <a
                    href={`mailto:${OFFICES.corporate.email}`}
                    className="text-slate-800 hover:underline"
                  >
                    {OFFICES.corporate.email}
                  </a>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{COMPANY_INFO.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="rounded-xl overflow-hidden border border-slate-200 h-52 w-full">
              <iframe
                title="R P Global Projects Corporate Office Noida"
                src={OFFICES.corporate.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Registered / Head Office Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full">
                  Registered Entity
                </span>
                <span className="text-xs text-slate-400 font-mono">Bihar Entity</span>
              </div>

              <h3 className="text-xl font-bold text-[#0A192F] mb-3">
                {OFFICES.registered.title}
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>
                    {OFFICES.registered.address},<br />
                    {OFFICES.registered.city}, {OFFICES.registered.country}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#10B981] shrink-0" />
                  <a
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                    className="font-semibold text-slate-800 hover:text-[#0077B6] transition-colors"
                  >
                    {OFFICES.registered.phone}
                  </a>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
                  <a
                    href={`mailto:${OFFICES.registered.email}`}
                    className="text-slate-800 hover:underline"
                  >
                    {OFFICES.registered.email}
                  </a>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{COMPANY_INFO.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Direct Engineering Assurance Banner */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Single Point Turnkey EPC Accountability:</span>
              <p className="text-slate-600 leading-relaxed">
                Whether you are setting up a 10 KLD package STP or a 5 MLD municipal water treatment plant,
                our engineering directors personally supervise all project milestones.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-[#0077B6]">
                Response Guaranteed Within 24 Business Hours
              </div>
            </div>
          </div>
        </div>

        {/* Technical RFQ Form (Wrapped in Suspense for searchParams) */}
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading RFQ Form...</div>}>
          <RFQForm />
        </Suspense>
      </div>
    </div>
  );
}
