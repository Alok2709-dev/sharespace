import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, AlertTriangle, FileText, CheckCircle2, Scale } from 'lucide-react';

export default function TrustAndSafetyPage() {
  return (
    <div className="flex-1 bg-[#0B0D0C] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
            Security & Institutional Governance
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F4F5EF]">
            Trust & Safety by Design
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            Institutional resource sharing requires uncompromising security, authenticated handovers, and rigorous human-in-the-loop oversight.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F5EF]">Server-Enforced Role Security</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Role permissions are strictly validated on the server and database layer, not merely by hiding UI buttons. Ordinary seekers cannot escalate themselves to administrators or approve their own bookings.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55]">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F5EF]">Prerequisite Verification Gating</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-consequence machinery (5-axis CNCs, Class 100 cleanrooms, high-voltage SEMs) requires verified operator certification. The system prevents uncertified users from initiating reservations.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F5EF]">Human-in-the-Loop Dispute Resolution</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No automatic financial penalties or permanent account suspensions are ever decided solely by an algorithm or AI model. All consequential incident reviews are assigned to authorized human managers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F5EF]">Two-Party Physical Handover Audit</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Possession changes require explicit sign-off by the custodian. Initial conditions and itemized accessories are recorded into the database so disputes over existing wear are eliminated.
            </p>
          </div>
        </div>

        {/* Institutional Principle Card */}
        <div className="p-8 rounded-xl bg-[#131715] border border-[#2F3933] space-y-4">
          <span className="text-xs font-mono uppercase text-[#C7FF55] tracking-widest font-bold">
            Commitment to Truthful Data
          </span>
          <h2 className="text-2xl font-bold text-[#F4F5EF]">No Fabricated Testimonials or Misleading Metrics</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            In compliance with our institutional build standards, ShareSpace displays only genuine records computed directly from live relational database rows. We do not use fictitious student testimonials, fake corporate logos, or unsubstantiated marketing statistics.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span>• 100% Normalized SQL Persistence</span>
            <span>• Cryptographic Password Scrypt Hashing</span>
            <span>• Full Audit Log History</span>
          </div>
        </div>
      </div>
    </div>
  );
}
