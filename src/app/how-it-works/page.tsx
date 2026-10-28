import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Database, Clock, RefreshCw } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 bg-[#0B0D0C] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
            Operational Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F4F5EF]">
            How SHARESPACE Works
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            A trusted digital infrastructure that guarantees institutional accountability, equipment safety, and fair access across laboratories, makerspaces, and shared facilities.
          </p>
        </div>

        {/* 5-Stage Step Breakdown */}
        <div className="space-y-8">
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
            <div key={i} className="p-8 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-mono font-black text-[#C7FF55]">{stage.num}</span>
                <h2 className="text-xl font-bold text-[#F4F5EF]">{stage.title}</h2>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{stage.desc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#191F1B]">
                {stage.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-[#C7FF55] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="p-8 rounded-xl bg-gradient-to-r from-[#131715] to-[#191F1B] border border-[#2F3933] text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#F4F5EF]">Ready to explore equipment?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Browse the active inventory of advanced instrumentation across the institutional network.
          </p>
          <div className="pt-2">
            <Link
              href="/resources"
              className="px-6 py-3 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d] transition-colors inline-flex items-center gap-2"
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
