"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Layers,
  Briefcase,
  Camera,
  LogOut,
  ExternalLink,
  Droplets,
  Menu,
  X,
  User,
  ShieldCheck,
  Handshake,
  HelpCircle,
} from "lucide-react";
import { useMagneticButtons } from "@/components/ui/useMagneticButtons";
import { useWaterFluidButtons } from "@/components/ui/useWaterFluidButtons";

const ADMIN_NAV = [
  { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Leads CRM & RFQ", href: "/admin/leads", icon: Inbox },
  { label: "Product Catalog CMS", href: "/admin/products", icon: Layers },
  { label: "Careers & ATS Pipeline", href: "/admin/jobs", icon: Briefcase },
  { label: "Project Gallery", href: "/admin/gallery", icon: Camera },
  { label: "Certifications & ISO", href: "/admin/certificates", icon: ShieldCheck },
  { label: "Partners & Clients", href: "/admin/partners", icon: Handshake },
  { label: "FAQs Management", href: "/admin/faqs", icon: HelpCircle },
];

interface AdminUserSummary {
  fullName: string;
  role: string;
  email?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useMagneticButtons();
  useWaterFluidButtons();

  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUserSummary | null>(null);

  // If on login page, render without admin sidebar shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (typeof window !== "undefined") {
      // If no token and not on login page, redirect
      const token = localStorage.getItem("rpglobal_admin_token");
      if (!token && !isLoginPage) {
        router.push("/admin/login");
      }

      const timer = setTimeout(() => {
        const userStr = localStorage.getItem("rpglobal_admin_user");
        if (userStr) {
          try {
            setCurrentUser(JSON.parse(userStr));
          } catch {
            setCurrentUser({ fullName: "Admin Desk", role: "SUPER_ADMIN" });
          }
        } else {
          setCurrentUser({ fullName: "Admin Desk", role: "SUPER_ADMIN" });
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("rpglobal_admin_token");
    localStorage.removeItem("rpglobal_admin_user");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7fa] md:flex">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f1d31] px-4 text-white md:hidden">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center bg-[#0077B6] text-white">
            <Droplets className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-bold tracking-wide">R P GLOBAL</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Operations admin</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
          aria-controls="admin-primary-navigation"
          onClick={() => setIsMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-950/45 md:hidden"
        />
      )}

      {/* Primary navigation */}
      <aside
        id="admin-primary-navigation"
        className={`fixed left-0 top-16 z-40 flex h-[calc(100dvh-4rem)] w-72 shrink-0 flex-col justify-between border-r border-slate-800 bg-[#0f1d31] text-slate-300 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:w-64 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-6">
            <div className="flex h-9 w-9 items-center justify-center bg-[#0077B6] text-white">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">R P GLOBAL</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                Operations Admin
              </span>
            </div>
          </div>

          <nav aria-label="Admin navigation" className="space-y-1.5 p-3.5 text-xs">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-3 px-3.5 py-2.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                    isActive
                      ? "bg-[#087db5] font-semibold text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-800 p-3.5 text-xs">
          <div className="flex items-center gap-3 border border-white/5 bg-white/5 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#0077B6]/25 text-cyan-300">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <span className="font-semibold text-white truncate block">
                {currentUser?.fullName || "Admin Team"}
              </span>
              <span className="block font-mono text-[10px] text-slate-400">
                {currentUser?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 border border-slate-700 px-3 py-2 text-center text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center border border-red-500/30 bg-red-500/10 text-red-300 transition-colors hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              aria-label="Sign out"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-[calc(100dvh-4rem)] min-w-0 flex-1 bg-[#f4f7fa] px-3 py-4 sm:px-6 sm:py-8 xl:px-10 xl:py-10 md:min-h-screen">
        {children}
      </main>
    </div>
  );
}
