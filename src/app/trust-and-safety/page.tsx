import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, AlertTriangle, FileText, CheckCircle2, Scale, Sparkles, Key } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function TrustAndSafetyPage() {
  return (
    <div className="flex-1 bg-[#080908] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header with High-End Editorial Presentation */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151D18] border border-[#253328] text-xs font-mono text-[#C7FF55]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Institutional Governance</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#F4F5EF]">
            Trust & Safety by Design
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed font-sans">
            Institutional resource sharing requires uncompromising security, authenticated physical handovers, and rigorous human-in-the-loop oversight.
          </p>
        </div>

        {/* Core Pillars in 3D Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202B23] space-y-4 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2C3D30] flex items-center justify-center text-[#C7FF55] shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F5EF]">Server-Enforced Role Security</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Role permissions are strictly validated on the server and database layer, not merely by hiding UI buttons. Ordinary seekers cannot escalate themselves to administrators or approve their own bookings.
              </p>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202B23] space-y-4 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2C3D30] flex items-center justify-center text-[#C7FF55] shadow-md">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F5EF]">Prerequisite Verification Gating</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                High-consequence machinery (5-axis CNCs, Class 100 cleanrooms, high-voltage SEMs) requires verified operator certification. The system prevents uncertified users from initiating reservations.
              </p>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202B23] space-y-4 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2C3D30] flex items-center justify-center text-[#C7FF55] shadow-md">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F5EF]">Human-in-the-Loop Dispute Resolution</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                No automatic financial penalties or permanent account suspensions are ever decided solely by an algorithm or AI model. All consequential incident reviews are assigned to authorized human managers.
              </p>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202B23] space-y-4 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2C3D30] flex items-center justify-center text-[#C7FF55] shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F5EF]">Two-Party Physical Handover Audit</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Possession changes require explicit sign-off by the custodian. Initial conditions and itemized accessories are recorded into the database so disputes over existing wear are eliminated.
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Institutional Principle Card */}
        <div className="p-8 rounded-3xl bg-[#111613] border border-[#253328] space-y-4 shadow-xl">
          <span className="text-xs font-mono uppercase text-[#C7FF55] tracking-widest font-bold">
            Commitment to Truthful Data
          </span>
          <h2 className="text-2xl font-bold text-[#F4F5EF]">No Fabricated Testimonials or Misleading Metrics</h2>
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            In compliance with our institutional build standards, ShareSpace displays only genuine records computed directly from live relational database rows. We do not use fictitious student testimonials, fake corporate logos, or unsubstantiated marketing statistics.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400 border-t border-[#1C251F]">
            <span>• 100% Normalized SQL Persistence</span>
            <span>• Cryptographic Password Scrypt Hashing</span>
            <span>• Tamper-Proof Server Audit Bus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
