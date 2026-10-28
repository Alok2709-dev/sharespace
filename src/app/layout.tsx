import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoSwitcher } from "@/components/layout/DemoSwitcher";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientSpotlight } from "@/components/ui/AmbientSpotlight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHARESPACE — Institutional Resource-Sharing and Lifecycle Management",
  description: "Access More. Own Less. Trusted digital infrastructure network allowing institutions, laboratories, and makerspaces to safely share and track technical resources.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080908] text-[#F4F5EF] selection:bg-[#C7FF55] selection:text-black">
        <AmbientSpotlight />
        <DemoSwitcher />
        <Navbar />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
