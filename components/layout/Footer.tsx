"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Play } from "lucide-react";
import { COMPANY_INFO, OFFICES, PLANT_SOLUTIONS } from "@/lib/constants";

export const Footer = () => {
  const [year] = useState(() =>
    typeof window !== "undefined" ? new Date().getFullYear() : 2026
  );

  const handleLogoClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#0077B6] via-[#006fa8] to-[#005785] text-white">
      {/* Pre-Footer Action Banner */}
      <div className="border-b border-white/15 bg-black/10">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-cyan-200">
              A practical next step
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-3xl text-white">
              Let’s plan a water system that fits your site.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/85">
              Share your process and water requirements with our engineering team.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-[#0077B6]"
            >
              <Phone className="h-4 w-4" /> Call engineering
            </a>
            <Link
              href="/contact-us#rfq"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#0077B6] shadow-md transition-all hover:bg-cyan-50 hover:shadow-lg"
            >
              Send an enquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links Area */}
      <div className="mx-auto grid max-w-[1640px] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:px-8 lg:py-14">
        <div>
          <Link
            href="/"
            onClick={handleLogoClick}
            className="inline-flex items-center gap-3 cursor-pointer"
            aria-label="R P Global Projects home - Scroll to top"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 p-1.5 backdrop-blur-sm border border-white/20 shadow-sm">
              <img
                src="https://rpglobalprojects.com/wp-content/uploads/2025/08/cropped-cropped-imgi_34_LOGO-RPGP-removebg-preview.png"
                alt="R P Global Projects logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <span>
              <span className="block text-sm font-bold tracking-[0.05em] text-white">R P GLOBAL</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-cyan-200/90 font-medium">
                Projects · Water Engineering
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">
            Turnkey engineering for industrial water treatment, wastewater recovery, and reuse across India.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse" /> ISO 9001:2015 quality management
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/90">
            Treatment systems
          </h3>
          <ul className="mt-4 space-y-2.5">
            {PLANT_SOLUTIONS.map((plant) => (
              <li key={plant.slug}>
                <Link
                  href={`/solutions/${plant.slug}`}
                  className="text-sm text-white/85 transition-colors hover:text-white hover:underline"
                >
                  {plant.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/90">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            <li><Link href="/about-us" className="hover:text-white transition-colors">About us</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Project gallery</Link></li>
            <li><Link href="/career" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/admin/login" className="hover:text-white transition-colors">Staff portal</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/90">
            Our offices
          </h3>
          <div className="mt-4 space-y-4 text-sm text-white/85">
            <div>
              <p className="font-semibold text-white">{OFFICES.corporate.title}</p>
              <p className="mt-1 flex items-start gap-2 leading-5 text-white/80">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00E5FF]" />
                {OFFICES.corporate.address}, {OFFICES.corporate.city}
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">{OFFICES.registered.title}</p>
              <p className="mt-1 flex items-start gap-2 leading-5 text-white/80">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00E5FF]" />
                {OFFICES.registered.address}, {OFFICES.registered.city}
              </p>
            </div>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="inline-flex items-center gap-2 text-cyan-200 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-[#00E5FF]" />
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Intro Trigger */}
      <div className="border-t border-white/15 bg-black/15">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-2 px-4 py-5 text-[11px] text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} {COMPANY_INFO.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>Engineering water systems for a more resilient future.</p>
            <button
              type="button"
              id="replay-site-intro-btn"
              aria-label="View site introduction"
              onClick={() => window.dispatchEvent(new CustomEvent("replay_site_intro"))}
              className="inline-flex items-center gap-1.5 text-cyan-200 transition-colors hover:text-white cursor-pointer"
            >
              <Play className="h-3 w-3" /> View site introduction
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
