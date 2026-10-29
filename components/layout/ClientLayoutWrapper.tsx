"use client";

import { useCallback, useEffect, useState, type FC, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { TopBar } from "./TopBar";
import { WhatsAppTrigger } from "./WhatsAppTrigger";
import { WaterLoadingScreen } from "@/components/ui/WaterLoadingScreen";
import { useMagneticButtons } from "@/components/ui/useMagneticButtons";
import { useWaterFluidButtons } from "@/components/ui/useWaterFluidButtons";

export const ClientLayoutWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  useMagneticButtons();
  useWaterFluidButtons();

  const pathname = usePathname();
  const isAdmin = Boolean(pathname?.startsWith("/admin"));
  const [forceIntro, setForceIntro] = useState(false);
  const [introDuration, setIntroDuration] = useState(2000);
  const [replayKey, setReplayKey] = useState(0);

  const handleIntroComplete = useCallback(() => setForceIntro(false), []);

  useEffect(() => {
    // Clean up any legacy sessionStorage key that was suppressing intro on reload
    try {
      sessionStorage.removeItem("rp_global_intro_seen");
    } catch {
      // In private browsing or environments where sessionStorage is blocked
    }
  }, []);

  useEffect(() => {
    const handleReplay = () => {
      setIntroDuration(3500);
      setReplayKey((k) => k + 1);
      setForceIntro(true);
    };
    window.addEventListener("replay_site_intro", handleReplay);
    return () => window.removeEventListener("replay_site_intro", handleReplay);
  }, []);

  if (isAdmin) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f3]">
      {forceIntro && (
        <WaterLoadingScreen
          key={replayKey}
          forceShow
          durationMs={introDuration}
          onComplete={handleIntroComplete}
        />
      )}
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppTrigger />
    </div>
  );
};
