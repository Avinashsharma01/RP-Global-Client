"use client";

import React, { useState, useEffect, type FC } from "react";
import { ArrowUp } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const WhatsAppTrigger: FC = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6 pointer-events-none"
      aria-label="Floating page actions"
    >
      {/* Scroll to Top Button (Positioned directly ABOVE WhatsApp icon) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
        title="Go to top"
        className={`pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-[#0077B6] border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.14)] transition-all duration-300 hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] hover:shadow-[0_6px_22px_rgba(0,119,182,0.35)] hover:-translate-y-1 active:translate-y-0 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6] group ${
          showTopBtn
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5 sm:h-5.5 sm:w-5.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>

      {/* WhatsApp Trigger Button with Original WhatsApp Brand Icon */}
      <a
        href={COMPANY_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with R P Global Projects"
        title="Chat on WhatsApp"
        className="pointer-events-auto group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:bg-[#20ba59] hover:shadow-[0_6px_26px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      >
        {/* Subtle breathing ripple ring */}
        <span
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-30 animate-ping"
          style={{ animationDuration: "3s" }}
          aria-hidden="true"
        />

        {/* Authentic WhatsApp Original Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 sm:h-7 sm:w-7 fill-white drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.55 14.34C16.3 14.21 15.09 13.62 14.86 13.54C14.64 13.45 14.47 13.41 14.31 13.66C14.14 13.91 13.67 14.46 13.52 14.63C13.38 14.8 13.23 14.82 12.98 14.7C12.73 14.57 11.93 14.31 10.98 13.46C10.24 12.8 9.74 11.99 9.6 11.74C9.45 11.49 9.58 11.36 9.71 11.23C9.82 11.12 9.96 10.94 10.08 10.8C10.21 10.65 10.25 10.55 10.33 10.38C10.41 10.21 10.37 10.07 10.31 9.94C10.25 9.82 9.75 8.59 9.55 8.08C9.35 7.59 9.14 7.66 8.99 7.65C8.84 7.64 8.68 7.64 8.51 7.64C8.34 7.64 8.07 7.7 7.84 7.95C7.61 8.2 6.96 8.81 6.96 10.06C6.96 11.31 7.87 12.51 8 12.68C8.13 12.85 9.79 15.41 12.33 16.51C12.93 16.77 13.4 16.92 13.77 17.04C14.37 17.23 14.92 17.2 15.35 17.14C15.83 17.07 16.83 16.53 17.04 15.95C17.25 15.36 17.25 14.86 17.18 14.75C17.12 14.65 16.96 14.59 16.71 14.46L16.55 14.34Z" />
        </svg>
      </a>
    </div>
  );
};
