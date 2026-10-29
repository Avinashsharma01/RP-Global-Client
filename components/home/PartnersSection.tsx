"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Handshake, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { Partner, PartnersSectionData } from "@/lib/types";

const FALLBACK_PARTNERS: Partner[] = [
  {
    _id: "partner-1",
    name: "Tata Chemicals Ltd",
    category: "Industrial Enterprise",
    logoUrl: "/images/partners/tata.svg",
    website: "https://www.tatachemicals.com",
    order: 1,
    isActive: true,
  },
  {
    _id: "partner-2",
    name: "Cipla Pharmaceuticals",
    category: "Pharma & Biotech",
    logoUrl: "/images/partners/cipla.svg",
    website: "https://www.cipla.com",
    order: 2,
    isActive: true,
  },
  {
    _id: "partner-3",
    name: "Reliance Industries",
    category: "Industrial Enterprise",
    logoUrl: "/images/partners/reliance.svg",
    website: "https://www.ril.com",
    order: 3,
    isActive: true,
  },
  {
    _id: "partner-4",
    name: "Grundfos Water Technology",
    category: "OEM Equipment",
    logoUrl: "/images/partners/grundfos.svg",
    website: "https://www.grundfos.com",
    order: 4,
    isActive: true,
  },
  {
    _id: "partner-5",
    name: "Larsen & Toubro (L&T)",
    category: "EPC & Infrastructure",
    logoUrl: "/images/partners/lt.svg",
    website: "https://www.larsentoubro.com",
    order: 5,
    isActive: true,
  },
  {
    _id: "partner-6",
    name: "Dow Water Solutions",
    category: "Technology Licensor",
    logoUrl: "/images/partners/dow.svg",
    website: "https://www.dow.com",
    order: 6,
    isActive: true,
  },
  {
    _id: "partner-7",
    name: "Thermax Global",
    category: "Technology Licensor",
    logoUrl: "/images/partners/thermax.svg",
    website: "https://www.thermaxglobal.com",
    order: 7,
    isActive: true,
  },
  {
    _id: "partner-8",
    name: "Sun Pharma Laboratories",
    category: "Pharma & Biotech",
    logoUrl: "/images/partners/sunpharma.svg",
    website: "https://sunpharma.com",
    order: 8,
    isActive: true,
  },
];

export function resolveLogoUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\/(localhost|127\.0\.0\.1):5000\/uploads\//i.test(trimmed)) {
    return trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5000/i, "");
  }
  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }
  return trimmed;
}

interface PartnerLogoCardProps {
  partner: Partner;
}

const PartnerLogoCard: React.FC<PartnerLogoCardProps> = ({ partner }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => resolveLogoUrl(partner.logoUrl));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(resolveLogoUrl(partner.logoUrl));
    setHasError(false);
  }, [partner.logoUrl]);

  const handleError = () => {
    const defaultPartner = FALLBACK_PARTNERS.find(
      (p) => p._id === partner._id || p.name.toLowerCase() === partner.name.toLowerCase()
    );
    if (defaultPartner && defaultPartner.logoUrl && imgSrc !== defaultPartner.logoUrl) {
      setImgSrc(defaultPartner.logoUrl);
    } else {
      setHasError(true);
    }
  };

  const content = (
    <div className="group relative flex h-24 w-56 sm:w-64 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#0077B6] hover:bg-white hover:shadow-lg hover:shadow-[#0077B6]/15 hover:-translate-y-0.5">
      {imgSrc && !hasError ? (
        <div className="relative flex h-14 w-full items-center justify-center">
          <img
            src={imgSrc}
            alt={partner.name}
            className="max-h-12 max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={handleError}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
          <Building2 className="h-4 w-4 text-[#0077B6]" />
          <span className="truncate">{partner.name}</span>
        </div>
      )}
    </div>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer block focus:outline-none"
        title={`Visit ${partner.name}`}
      >
        {content}
      </a>
    );
  }

  return <div className="cursor-pointer">{content}</div>;
};

interface PartnersSectionProps {
  data?: Partial<PartnersSectionData>;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ data }) => {
  const badge = data?.badge || "Our Partners & Clients";
  const title = data?.title || "Clients and project partners";
  const description =
    data?.description ||
    "Engineering zero liquid discharge and mission-critical water treatment systems for premier manufacturing giants.";
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);

  useEffect(() => {
    let isMounted = true;

    async function loadPartners() {
      try {
        const res = await api.getPartners();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setPartners(res.data);
        }
      } catch (err) {
        console.warn("Using fallback partners:", err);
      }
    }

    loadPartners();

    return () => {
      isMounted = false;
    };
  }, []);

  // Split partners for the double side marquee (Row 1 and Row 2)
  const safePartners = partners.length >= 4 ? partners : [...partners, ...FALLBACK_PARTNERS];
  const half = Math.ceil(safePartners.length / 2);
  const row1Partners = safePartners.slice(0, half);
  const row2Partners = safePartners.slice(half);

  // Duplicate for seamless infinite loop
  const loopRow1 = [...row1Partners, ...row1Partners, ...row1Partners];
  const loopRow2 = [...row2Partners, ...row2Partners, ...row2Partners];

  return (
    <section id="partners-section" className="relative overflow-hidden bg-white py-14 sm:py-20">
      {/* Subtle aquatic background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,119,182,0.04),transparent_65%)]" />

      {/* Clean Header */}
      <div className="mx-auto max-w-[1600px] px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/20 bg-[#e0f2fe]/60 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6] shadow-sm">
          <Handshake className="h-3.5 w-3.5 text-[#0077B6]" />
          <span>{badge}</span>
        </div>

        <h2 className="mt-3.5 text-2xl font-bold tracking-tight text-[#0f2d38] sm:text-3xl md:text-4xl">
          {title}
        </h2>

        <p className="mx-auto mt-2.5 max-w-xl text-xs text-[#45616b] sm:text-sm">
          {description}
        </p>
      </div>

      {/* Double Side Marquee Container */}
      <div className="relative mt-10 space-y-4 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]">
        {/* Row 1: Flowing Left (Right to Left) */}
        <motion.div
          className="flex w-max items-center gap-4 sm:gap-5"
          animate={{
            x: ["0%", "-33.333%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: Math.max(22, row1Partners.length * 6),
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {loopRow1.map((partner, idx) => (
            <PartnerLogoCard key={`row1-${partner._id}-${idx}`} partner={partner} />
          ))}
        </motion.div>

        {/* Row 2: Flowing Right (Left to Right - Double Side!) */}
        <motion.div
          className="flex w-max items-center gap-4 sm:gap-5"
          animate={{
            x: ["-33.333%", "0%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: Math.max(24, row2Partners.length * 6.5),
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {loopRow2.map((partner, idx) => (
            <PartnerLogoCard key={`row2-${partner._id}-${idx}`} partner={partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
