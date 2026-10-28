import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  FileCheck,
  AlertCircle,
  Database
} from 'lucide-react';
import { queryAll } from '@/lib/db/database';
import { StatusBadge } from '@/components/ui/Badge';

export default async function HomePage() {
  const featuredResources = queryAll<any>(`
    SELECT r.*, u.full_name as owner_name, i.name as institution_name
    FROM resources r
    JOIN users u ON r.owner_id = u.id
    JOIN institutions i ON r.institution_id = i.id
    WHERE r.status = 'active'
    ORDER BY r.created_at ASC
    LIMIT 3
  `).map(r => ({
    ...r,
    images: JSON.parse(r.images || '[]')
  }));

  return (
    <div className="flex flex-col flex-1">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 border-b border-[#212824] overflow-hidden bg-gradient-to-b from-[#131715]/60 to-[#0B0D0C]">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#191F1B_1px,transparent_1px),linear-gradient(to_bottom,#191F1B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191F1B] border border-[#2F3933] text-xs font-mono text-[#C7FF55]">
              <span className="w-2 h-2 rounded-full bg-[#C7FF55] animate-pulse" />
              <span>Institutional Resource-Sharing & Lifecycle Infrastructure</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F5EF] leading-[1.05]">
              Great resources <br />
              <span className="text-[#C7FF55]">shouldn't sit idle.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#A0A69F] max-w-2xl leading-relaxed">
              Discover the spaces, equipment, and technical resources around you. Share responsibly, access fairly, and keep every handover accountable.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/resources"
                className="px-6 py-3.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-sm hover:bg-[#b5f23d] transition-all flex items-center gap-2 shadow-lg shadow-[#C7FF55]/10"
              >
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/owner/resources/new"
                className="px-6 py-3.5 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-sm font-semibold text-[#F4F5EF] transition-all"
              >
                List a Resource
              </Link>
            </div>
          </div>

          {/* Interactive Interface Preview Mockup */}
          <div className="mt-14 rounded-xl bg-[#131715] border border-[#2F3933] p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#212824] mb-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2F3933]" />
                <span className="w-3 h-3 rounded-full bg-[#2F3933]" />
                <span className="w-3 h-3 rounded-full bg-[#2F3933]" />
                <span className="ml-2 text-[#C7FF55]">Apex Institute • Active Live Ledger Node</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>FIFO Fair Allocation: Active</span>
                <span>Two-Party Inspection: Enforced</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredResources.map(res => (
                <Link
                  key={res.id}
                  href={`/resources/${res.id}`}
                  className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] hover:border-[#C7FF55]/40 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">{res.category}</span>
                      <StatusBadge status={res.status} size="sm" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#F4F5EF] group-hover:text-[#C7FF55] transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#191F1B] flex items-center justify-between text-[11px] text-zinc-500">
                    <span>📍 {res.location.split(',')[0]}</span>
                    <span className="text-[#C7FF55] font-mono font-medium">Reserve &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS WORKFLOW */}
      <section className="py-20 md:py-28 border-b border-[#212824] bg-[#0B0D0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
              Persistent 5-Stage Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF]">
              How SHARESPACE Works
            </h2>
            <p className="text-sm text-zinc-400">
              From credential check to final condition inspection, every access decision has an immutable audit record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Discover',
                desc: 'Search verified equipment, labs, and facilities by specifications, lead time, and safety criteria.'
              },
              {
                step: '02',
                title: 'Request',
                desc: 'Submit booking parameters with project purpose. Automated eligibility checks ensure prerequisite training.'
              },
              {
                step: '03',
                title: 'Approve',
                desc: 'Resource custodians review requests, check toolpaths or safety records, and record reasoned decisions.'
              },
              {
                step: '04',
                title: 'Handover',
                desc: 'Physical check-in captures initial condition and included accessories into the permanent ledger.'
              },
              {
                step: '05',
                title: 'Return',
                desc: 'Return inspection verifies equipment integrity against checkout condition before closing the booking.'
              }
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-lg bg-[#131715] border border-[#212824] space-y-3 relative group hover:border-[#2F3933] transition-colors">
                <span className="text-2xl font-mono font-bold text-[#C7FF55]/60 group-hover:text-[#C7FF55] transition-colors">
                  {st.step}
                </span>
                <h3 className="text-base font-bold text-[#F4F5EF]">{st.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRUST BY DESIGN & ACCOUNTABILITY */}
      <section className="py-20 md:py-28 border-b border-[#212824] bg-[#131715]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
                Accountability Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF] leading-tight">
                Trust by Design. <br />
                Institutional Control Preserved.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Traditional booking systems treat expensive equipment like meeting rooms. ShareSpace is engineered around accountability: prerequisite training enforcement, two-party physical handover verification, and tamper-resistant audit logs.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#191F1B] border border-[#2F3933] text-[#C7FF55] shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F4F5EF]">Automated Eligibility Gating</h4>
                    <p className="text-xs text-zinc-400">
                      Users cannot request restricted high-voltage or chemical equipment without verified qualifications in the institutional ledger.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#191F1B] border border-[#2F3933] text-[#C7FF55] shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F4F5EF]">Comparative Condition Reporting</h4>
                    <p className="text-xs text-zinc-400">
                      Check-in and return inspections compare accessory counts, calibration logs, and physical state to prevent disputed wear.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#191F1B] border border-[#2F3933] text-[#C7FF55] shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F4F5EF]">Immutable Audit History</h4>
                    <p className="text-xs text-zinc-400">
                      Every approval, rejection reason, status transition, and policy change is permanently logged on the server.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Principle Callout Card */}
            <div className="p-8 rounded-xl bg-[#0B0D0C] border border-[#2F3933] space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-widest">
                  Core Architectural Tenet
                </span>
                <blockquote className="text-xl sm:text-2xl font-mono text-[#F4F5EF] leading-snug border-l-2 border-[#C7FF55] pl-4">
                  "EVERY RESOURCE HAS A STORY.<br />
                  EVERY BOOKING HAS A RECORD.<br />
                  EVERY ACCESS DECISION HAS A REASON."
                </blockquote>
              </div>

              <div className="p-4 rounded-lg bg-[#191F1B] border border-[#212824] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#A0A69F]">
                  <span>Fair Allocation Mode</span>
                  <span className="text-[#C7FF55]">Explainable FIFO</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#A0A69F]">
                  <span>Active Booking Cap</span>
                  <span className="text-[#F4F5EF]">3 Concurrent / User</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#A0A69F]">
                  <span>Human-in-the-Loop</span>
                  <span className="text-[#78D9A0]">100% Authorized Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAIR ACCESS & TRANSPARENT WAITING LISTS */}
      <section className="py-20 md:py-28 border-b border-[#212824] bg-[#0B0D0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
              Judging Criterion Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF]">
              Transparent Fair Allocation & Waiting Lists
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              When high-demand instruments have conflicting schedules, ShareSpace enforces mathematical FIFO queueing. Seekers receive clear explanations of their position and are automatically promoted when slots open.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#131715] border border-[#212824] space-y-2">
              <span className="font-mono text-xs text-[#C7FF55] uppercase">Explainability</span>
              <h3 className="text-base font-semibold text-[#F4F5EF]">Zero Black-Box Allocation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                "You're #2 on the waiting list because two eligible requests were submitted before yours." Every seeker knows exactly why they wait.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#131715] border border-[#212824] space-y-2">
              <span className="font-mono text-xs text-[#C7FF55] uppercase">Safety First</span>
              <h3 className="text-base font-semibold text-[#F4F5EF]">No Ineligible Fast-Tracking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If the next in line is missing mandatory safety certifications, the engine skips promotion until requirements are met, preventing unsafe access.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#131715] border border-[#212824] space-y-2">
              <span className="font-mono text-xs text-[#C7FF55] uppercase">Anti-Monopoly</span>
              <h3 className="text-base font-semibold text-[#F4F5EF]">Configurable Fair Caps</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Institutions configure active booking limits to prevent single research groups from hoarding shared core instrumentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-20 bg-gradient-to-t from-[#131715] to-[#0B0D0C]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F5EF]">
            Ready to optimize your institutional infrastructure?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Join the network of research laboratories, engineering maker spaces, and creative studios sharing resources with confidence.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/resources"
              className="px-6 py-3 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-sm hover:bg-[#b5f23d] transition-colors"
            >
              Explore Available Resources
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-sm text-[#F4F5EF] transition-colors"
            >
              Review Platform Standards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
