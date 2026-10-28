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
  title: "SHARESPACE — Good stuff should get shared",
  description: "From cameras and creative gear to study rooms and lab essentials — find what you need, share what you have, and make more happen together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sharespace_theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F5EF] text-[#20231F] selection:bg-[#FFD76A] selection:text-[#20231F]">
        <AmbientSpotlight />
        <DemoSwitcher />
        <Navbar />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
