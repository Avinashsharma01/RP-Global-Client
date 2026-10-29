"use client";

import { useState, type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, PLANT_SOLUTIONS } from "@/lib/constants";

import { HeaderWaterDrop } from "@/components/ui/HeaderWaterDrop";
import { WaterFluidButton } from "@/components/ui/WaterFluidButton";

export const Navbar: FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setSolutionsOpen(false);
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      window.dispatchEvent(new CustomEvent("trigger-water-drop"));
    }
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe5df] bg-white">
      <div className="mx-auto flex h-[68px] max-w-[1640px] items-center justify-between px-3 sm:h-[76px] sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="group flex min-w-0 shrink items-center gap-2 cursor-pointer sm:gap-3"
          aria-label="R P Global Projects home - Scroll to top"
        >
          <img
            id="navbar-logo-img"
            src="/images/Logo.png"
            alt="R P Global Projects logo"
            className="h-10 w-auto object-contain sm:h-12 md:h-14"
          />
          <span className="min-w-0 leading-tight">
            <span className="block text-[15px] font-bold tracking-[0.04em] text-[#172e34]">R P GLOBAL</span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6c7978] sm:block">Projects · Water Engineering</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={solutionsOpen}
                    aria-haspopup="true"
                    onClick={() => setSolutionsOpen((open) => !open)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setSolutionsOpen(false);
                    }}
                    className={`inline-flex min-h-11 items-center gap-1 px-3 text-[13px] font-medium transition-colors hover:text-[#0077B6] focus-visible:outline-[#0077B6] ${pathname.startsWith("/solutions") ? "text-[#0077B6]" : "text-[#435356]"}`}
                  >
                    {link.label}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {solutionsOpen && (
                    <div className="absolute left-1/2 top-full w-[440px] -translate-x-1/2 border border-[#e2e7e3] bg-white p-5 shadow-[0_20px_55px_rgba(20,45,49,0.14)]">
                      <div className="mb-3 flex items-end justify-between border-b border-[#e8ece8] pb-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">Treatment systems</p>
                          <p className="mt-1 text-sm font-medium text-[#172e34]">Find the right process</p>
                        </div>
                        <Link href="/solutions" className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B6] hover:underline">All solutions <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                      </div>
                      <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                        {PLANT_SOLUTIONS.map((plant) => (
                          <Link
                            key={plant.slug}
                            href={`/solutions/${plant.slug}`}
                            className="group border-b border-[#edf0ed] py-2.5"
                          >
                            <span className="block text-[13px] font-semibold text-[#263e43] group-hover:text-[#0077B6]">{plant.shortName}</span>
                            <span className="mt-1 block text-[10px] text-[#778482]">{plant.capacity}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`min-h-11 px-3 py-3 text-[13px] font-medium transition-colors hover:text-[#0077B6] focus-visible:outline-[#0077B6] ${active ? "text-[#0077B6]" : "text-[#435356]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action CTA Button */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <WaterFluidButton
            href="/contact-us#rfq"
            size="sm"
            className="px-5 py-2 text-xs font-semibold tracking-wide shadow-md shadow-[#0077b6]/25"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("open-quick-rfq", {
                    detail: { plant: "Sewage Treatment Plant (STP)" },
                  })
                );
              }
            }}
          >
            <span>Request a proposal</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </WaterFluidButton>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[#263e43] hover:text-[#0077B6] hover:bg-[#f0f9ff] focus-visible:outline-[#0077B6] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e4e8e4] bg-white px-3 pb-5 pt-2 shadow-lg sm:px-6 lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-[1640px]">
            {NAV_LINKS.map((link) => link.hasDropdown ? (
              <div key={link.label} className="border-b border-[#edf0ed] py-1">
                <button
                  type="button"
                  aria-expanded={solutionsOpen}
                  onClick={() => setSolutionsOpen((open) => !open)}
                  className="flex min-h-11 w-full items-center justify-between text-left text-sm font-medium text-[#263e43]"
                >
                  {link.label}<ChevronDown className={`h-4 w-4 text-[#6c7978] transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                </button>
                {solutionsOpen && <div className="grid grid-cols-1 gap-x-3 pb-3 pl-3 sm:grid-cols-2">
                  {PLANT_SOLUTIONS.map((plant) => <Link key={plant.slug} href={`/solutions/${plant.slug}`} className="flex min-h-11 items-center py-2 text-xs text-[#53666a] hover:text-[#0077B6]">{plant.shortName}</Link>)}
                </div>}
              </div>
            ) : (
              <Link key={link.label} href={link.href} className="block border-b border-[#edf0ed] py-3 text-sm font-medium text-[#263e43] hover:text-[#0077B6]">{link.label}</Link>
            ))}
            <WaterFluidButton
              href="/contact-us#rfq"
              size="md"
              className="mt-4 flex w-full"
            >
              Request a proposal <ArrowUpRight className="h-4 w-4" />
            </WaterFluidButton>
          </nav>
        </div>
      )}

      {/* Periodic Transparent Glass Water Droplet Effect */}
      <HeaderWaterDrop />
    </header>
  );
};
