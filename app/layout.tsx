import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rpglobalprojects.com"),
  title: {
    default: "R P Global Projects — Industrial Water & Wastewater Treatment Plants",
    template: "%s | R P Global Projects",
  },
  description:
    "ISO 9001:2015 certified turnkey EPC contractor specializing in Demineralization (DM), Effluent Treatment (ETP), Reverse Osmosis (RO), Sewage Treatment (STP), Water Softeners, and WTP systems designed for CPCB/SPCB requirements.",
  keywords: [
    "water treatment plant manufacturer",
    "effluent treatment plant ETP Noida",
    "sewage treatment plant STP Bihar",
    "demineralization plant DM",
    "industrial reverse osmosis RO plant",
    "water softening plant",
    "CPCB compliance wastewater",
    "zero liquid discharge ZLD",
    "RP Global Projects",
  ],
  authors: [{ name: "R P Global Projects", url: "https://rpglobalprojects.com" }],
  creator: "R P Global Projects",
  publisher: "R P Global Projects",
  alternates: {
    canonical: "https://rpglobalprojects.com",
  },
  icons: {
    icon: "/images/Logo.png",
    shortcut: "/images/Logo.png",
    apple: "/images/Logo.png",
  },
  openGraph: {
    title: "R P Global Projects — Industrial Water & Wastewater Treatment Plants",
    description:
      "ISO 9001:2015 certified turnkey EPC contractor specializing in Demineralization (DM), Effluent Treatment (ETP), Reverse Osmosis (RO), Sewage Treatment (STP), Water Softeners, and WTP systems designed for CPCB/SPCB requirements.",
    url: "https://rpglobalprojects.com",
    siteName: "R P Global Projects",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "R P Global Projects Industrial Plant Systems",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "R P Global Projects — Turnkey Water & Wastewater EPC",
    description:
      "Turnkey industrial water and wastewater EPC engineering. CPCB/SPCB compliant STP, ETP, RO, DM & Softener plants.",
    images: ["/images/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
