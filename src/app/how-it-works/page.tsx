import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Database, Clock, RefreshCw, Sparkles, Terminal } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 bg-[#080908] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header with High-End Editorial Presentation */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151D18] border border-[#253328] text-xs font-mono text-[#C7FF55]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Architecture</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#F4F5EF]">
            How SHARESPACE Works
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed font-sans">
            A trusted digital infrastructure that guarantees institutional accountability, equipment safety, and fair access across laboratories, makerspaces, and shared facilities.
          </p>
        </div>

        {/* 5-Stage Step Breakdown with Elevated 3D Bento Cards */}
        <div className="space-y-6">
          {[
            {
              num: '01',
              title: 'Discovery & Eligibility Gating',
              desc: 'Seekers explore the verified institutional catalog by domain, equipment capability, or facility specs. Built-in eligibility gating prevents unauthorized or dangerous access by cross-referencing safety training certifications before booking requests can be filed.',
              features: ['Real-time availability against operating hours', 'Automatic credential verification against institutional records', 'AI Concierge for natural language capability matching']
            },
            {
              num: '02',
              title: 'Conflict-Free Scheduling & FIFO Waiting Lists',
              desc: 'Bookings require specific start and end timestamps, research purpose, and safety acknowledgements. Concurrency-safe transactions guarantee that exclusive instruments cannot be double-booked. Overlapping requests join a transparent, explainable FIFO waiting list.',
              features: ['Zero simultaneous double-booking guarantees', 'Automatic position calculation and explainability text', 'Auto-promotion when slots open due to cancellations']
            },
            {
              num: '03',
              title: 'Custodian Review & Reasoned Decisions',
              desc: 'Authorized laboratory managers and resource custodians evaluate requests based on toolpath simulations, research merit, and specimen safety. Decisions cannot be made arbitrarily: approvals and rejections require recorded reasons stored in the audit trail.',
              features: ['Mandatory decision reasoning recorded in the database', 'Prevention of self-approvals and privilege escalation', 'Instant in-app notifications dispatched to seekers']
            },
            {
              num: '04',
              title: 'Two-Party Handover & Initial Condition Audit',
              desc: 'At checkout, the resource custodian and seeker inspect the equipment. The physical handover records initial condition (pristine, good, acceptable), verifies all included accessories, logs optional photographic proof, and timestamps physical possession.',
              features: ['Verified checkout by authorized custodians', 'Itemized accessory checklists (collets, probes, lenses, cables)', 'Immutable audit event linking the handover timestamp']
            },
            {
              num: '05',
              title: 'Comparative Return Inspection & Resolution',
              desc: 'Upon return, the custodian conducts a comparative inspection against the initial checkout report. If alterations, missing accessories, or damage are flagged, the booking transitions to inspection review and an incident ticket is generated for human resolution.',
              features: ['Side-by-side condition comparison', 'Automated incident generation upon damage or delay', 'Closes lifecycle and opens resource for next scheduled seeker']
            }
          ].map((stage, i) => (
            <TiltCard key={i} tiltMaxAngle={3} scaleOnHover={1.01}>
              <div className="p-8 rounded-3xl bg-[#111613] border border-[#202B23] space-y-5 shadow-xl hover:border-[#C7FF55]/40 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-mono font-black text-[#C7FF55]">{stage.num}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4F5EF]">{stage.title}</h2>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">{stage.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1C251F]">
                  {stage.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-[#C7FF55] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Call to action */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#111613] via-[#0E1310] to-[#0A0D0B] border border-[#253328] text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7FF55]/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F4F5EF]">
            Ready to explore university instrumentation?
          </h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Browse the active inventory of advanced core equipment across our institutional network.
          </p>
          <div className="pt-2">
            <Link
              href="/resources"
              className="px-7 py-3.5 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(199,255,85,0.25)] active:scale-95"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
