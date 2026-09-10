import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HashFlash } from "@/components/HashFlash";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const text = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet", display: "swap" });

const site = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Juan Costa, full-stack engineer",
    template: "%s · Juan Costa",
  },
  description:
    "Full-stack engineer in São Paulo. Six years on .NET distributed systems, AI through the whole workflow, and models trained from scratch when a product needs one.",
  openGraph: {
    type: "website",
    url: site,
    title: "Juan Costa, full-stack engineer",
    description:
      "Full-stack engineer in São Paulo. Six years on .NET distributed systems, AI through the whole workflow, and models trained from scratch when a product needs one.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:text-bone"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <HashFlash />
        <Footer />
      </body>
    </html>
  );
}
