import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, AlertTriangle, FileText, CheckCircle2, Scale, Sparkles, Heart } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function TrustAndSafetyPage() {
  return (
    <div className="flex-1 bg-[#F7F5EF] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E1D3] text-xs font-bold text-[#4169E1] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community Care & Standards</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#20231F]">
            Trust & Safety by Design
          </h1>
          <p className="text-base sm:text-lg text-[#555B53] leading-relaxed font-sans">
            Sharing great things requires respect, clear communication, and thoughtful human oversight. Here is how ShareSpace keeps every handover accountable.
          </p>
        </div>

        {/* Core Pillars in 2-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF5FF] border border-[#BDD5FF] flex items-center justify-center text-[#4169E1] shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#20231F]">Verified Role Permissions</h3>
              <p className="text-xs text-[#555B53] leading-relaxed font-sans">
                Access controls are strictly enforced by our application backend. Ordinary seekers cannot grant themselves administrative privileges or approve their own bookings.
              </p>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] border border-[#FFD2BC] flex items-center justify-center text-[#FF7A45] shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#20231F]">Prerequisite Safety Gating</h3>
              <p className="text-xs text-[#555B53] leading-relaxed font-sans">
                High-consequence machinery (5-axis CNCs, cleanroom hoods, high-voltage lasers) requires verified orientation before requests can be filed, keeping everyone safe.
              </p>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFFF] border border-[#D9C8FF] flex items-center justify-center text-[#8A63D2] shadow-xs">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#20231F]">Human Dispute Resolution</h3>
              <p className="text-xs text-[#555B53] leading-relaxed font-sans">
                No financial penalties or account suspensions are decided by cold automated algorithms. Every reported incident or delay is reviewed with empathy by human managers.
              </p>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={4} scaleOnHover={1.02}>
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#EDFBF3] border border-[#B7ECCB] flex items-center justify-center text-[#22C55E] shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#20231F]">Two-Party Condition Checks</h3>
              <p className="text-xs text-[#555B53] leading-relaxed font-sans">
                Both the custodian and the seeker inspect the equipment together at check-in and checkout. Accessory counts and pre-existing wear are agreed upon so disputes disappear.
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Commitment to Truthful Data Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">
            Our Commitment
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#20231F]">Real Community. Genuine Inventory.</h2>
          <p className="text-sm text-[#555B53] leading-relaxed font-sans">
            ShareSpace is built for genuine accountability. Every item shown is backed by real campus inventory and institutional custodians. We do not use fictitious student reviews, fake partner logos, or fabricated statistics.
          </p>
          <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-[#7C837C] font-semibold border-t border-[#EFE9DD]">
            <span>• 100% Verified SQL Database Records</span>
            <span>• Cryptographic Password Scrypt Hashing</span>
            <span>• Complete Activity Audit Ledger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
