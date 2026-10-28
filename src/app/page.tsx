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
  Database,
  ExternalLink,
  Cpu,
  Activity,
  ChevronRight,
  Fingerprint,
  Sliders,
  Award
} from 'lucide-react';
import { queryAll } from '@/lib/db/database';
import { StatusBadge } from '@/components/ui/Badge';
import { HeroVisual3D } from '@/components/3d/HeroVisual3D';
import { TiltCard } from '@/components/ui/TiltCard';

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

  const stats = [
    { label: 'Active Core Instruments', value: '12', sub: 'Verified & Calibrated' },
    { label: 'Audit Trail Integrity', value: '100%', sub: 'Immutable Server Ledger' },
    { label: 'Scheduling Conflict Rate', value: '0.0%', sub: 'Transactional Locks' },
    { label: 'Dual-Party Inspections', value: '100%', sub: 'Pre & Post Checkout' }
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 1. HERO SECTION WITH 3D INTERACTIVE VISUAL */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#1E2621] overflow-hidden bg-gradient-to-b from-[#0F1411] via-[#080908] to-[#080908]">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161E19_1px,transparent_1px),linear-gradient(to_bottom,#161E19_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#C7FF55]/12 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Expressive Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141C16] border border-[#27352B] text-xs font-mono text-[#C7FF55] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C7FF55] animate-ping" />
                <span className="font-semibold tracking-wider uppercase text-[11px]">
                  Institutional Infrastructure Network
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F5EF] leading-[1.04]">
                Great resources <br />
                <span className="text-gradient-accent">shouldn't sit idle.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#9BA39B] max-w-2xl leading-relaxed">
                Discover the high-end laboratories, cleanrooms, and fabrication equipment around you. 
                Share responsibly, allocate through fair FIFO queues, and ensure every physical handover is tamper-proof.
              </p>

              {/* Action Buttons with High-End Styling */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/resources"
                  className="px-7 py-4 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-sm hover:bg-[#b5f23d] transition-all flex items-center gap-2.5 shadow-[0_0_25px_rgba(199,255,85,0.25)] hover:shadow-[0_0_35px_rgba(199,255,85,0.4)] active:scale-98 group"
                >
                  <span>Explore 12 Core Resources</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="px-6 py-4 rounded-xl bg-[#141A16] hover:bg-[#1E2621] border border-[#27352B] text-sm font-semibold text-[#F4F5EF] transition-all active:scale-98 flex items-center gap-2"
                >
                  <span>Architecture Guide</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </Link>
              </div>

              {/* Micro specs ticker */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-500 border-t border-[#1C241E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C7FF55]" />
                  <span>Prerequisite Training Gating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C7FF55]" />
                  <span>Explainable FIFO Waiting Lists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C7FF55]" />
                  <span>Dual Condition Checklists</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Holographic Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full relative rounded-2xl bg-gradient-to-b from-[#131915]/60 to-[#0A0D0B] border border-[#243128] p-2 shadow-2xl backdrop-blur-sm">
                <HeroVisual3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & ARCHITECTURAL METRICS BAR */}
      <section className="border-b border-[#1E2621] bg-[#0C100E] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#C7FF55] tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs font-semibold text-[#F4F5EF]">{st.label}</div>
                <div className="text-[11px] font-mono text-zinc-500">{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED RESOURCES SHOWCASE WITH 3D TILT CARDS */}
      <section className="py-20 md:py-28 border-b border-[#1E2621] bg-[#080908] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141C16] border border-[#27352B] text-[11px] font-mono text-[#C7FF55] uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>Verified Laboratory Assets</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF]">
                Engineered for High-Stakes Research
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Real instruments backed by operational safety rules, lead-time protocols, and institutional supervision.
              </p>
            </div>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#C7FF55] hover:underline"
            >
              <span>View all 12 resources in catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3D Interactive Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.map(res => (
              <TiltCard key={res.id} tiltMaxAngle={7} scaleOnHover={1.025}>
                <Link
                  href={`/resources/${res.id}`}
                  className="block h-full rounded-2xl bg-[#111613] border border-[#222E26] hover:border-[#C7FF55]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Image Container with Smooth Zoom on Hover */}
                    <div className="relative aspect-video w-full overflow-hidden bg-[#1A221D]">
                      <img
                        src={res.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
                        alt={res.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111613] via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#080908]/85 backdrop-blur-md border border-[#28362D] text-[10px] font-mono uppercase text-[#C7FF55] font-semibold">
                          {res.category.split('&')[0]}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <StatusBadge status={res.status} size="sm" />
                      </div>

                      <div className="absolute bottom-3 left-3 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF55]" />
                        <span>{res.institution_name}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-[#F4F5EF] group-hover:text-[#C7FF55] transition-colors line-clamp-1">
                        {res.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400">
                        <span className="px-2 py-0.5 rounded bg-[#18201A] border border-[#243026]">
                          Lead: {res.lead_time_hours}h
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#18201A] border border-[#243026]">
                          Max: {Math.round(res.max_duration_minutes / 60)}h
                        </span>
                        {res.supervision_required ? (
                          <span className="px-2 py-0.5 rounded bg-[#352516] border border-[#523A22] text-[#F0BE67]">
                            Supervision Req
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[#1C251F] flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono text-[11px]">📍 {res.location.split(',')[0]}</span>
                      <span className="text-[#C7FF55] font-mono font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Inspect & Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: THE 5-STAGE LIFECYCLE PIPELINE */}
      <section className="py-20 md:py-28 border-b border-[#1E2621] bg-[#0A0E0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
              Audited 5-Stage Access Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF]">
              How SHARESPACE Works
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              From credential check to final comparative return inspection, every access transition is backed by a permanent server audit event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Discover',
                subtitle: 'Specifications & Lead-Times',
                desc: 'Search verified core equipment and laboratories by tool capabilities, safety criteria, and availability windows.'
              },
              {
                step: '02',
                title: 'Request',
                subtitle: 'Prerequisite Training Gating',
                desc: 'Submit booking parameters with project purpose. Automated checks guarantee necessary safety credentials.'
              },
              {
                step: '03',
                title: 'Approve',
                subtitle: 'Custodian Reasoned Review',
                desc: 'Laboratory custodians review requests, check toolpaths or safety records, and record reasoned approval or denial.'
              },
              {
                step: '04',
                title: 'Handover',
                subtitle: 'Dual-Party Condition Capture',
                desc: 'Physical check-in records initial physical condition, serials, and included accessories into the permanent ledger.'
              },
              {
                step: '05',
                title: 'Return',
                subtitle: 'Comparative Integrity Inspection',
                desc: 'Return inspection verifies equipment against check-in condition, catching damage or missing items immediately.'
              }
            ].map((st, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-[#121714] border border-[#202B24] hover:border-[#C7FF55]/40 transition-all duration-300 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-black text-[#C7FF55]/60 group-hover:text-[#C7FF55] transition-colors">
                    {st.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#202B24] group-hover:bg-[#C7FF55] transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F5EF]">{st.title}</h3>
                  <div className="text-[10px] font-mono text-[#C7FF55] uppercase tracking-wider">{st.subtitle}</div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRUST BY DESIGN & LIVE SIMULATED AUDIT TERMINAL */}
      <section className="py-20 md:py-28 border-b border-[#1E2621] bg-[#080908]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Architectural Principles */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
                Accountability Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF] leading-tight">
                Trust by Design. <br />
                Institutional Oversight Preserved.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Traditional booking systems treat \$500,000 electron microscopes like meeting rooms. 
                ShareSpace is built around institutional accountability: mandatory training verification, 
                bilateral physical handovers, and tamper-resistant audit logs.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-[#111713] border border-[#202C23] flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#18211A] border border-[#29382C] text-[#C7FF55] shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F4F5EF]">Automated Eligibility Gating</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Seekers cannot request hazardous or delicate equipment without verified qualifications in the institutional database.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111713] border border-[#202C23] flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#18211A] border border-[#29382C] text-[#C7FF55] shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F4F5EF]">Comparative Condition Reporting</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Check-in and return inspections capture itemized accessory tallies and condition notes to resolve disputes objectively.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111713] border border-[#202C23] flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#18211A] border border-[#29382C] text-[#C7FF55] shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F4F5EF]">Immutable Audit History</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Every approval, rejection rationale, status transition, and administrative intervention is permanently logged.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Tenet & Live Ledger Terminal */}
            <div className="lg:col-span-6 space-y-6">
              {/* Product Principle Quote */}
              <div className="p-7 rounded-2xl bg-gradient-to-br from-[#121814] to-[#0A0D0B] border border-[#253328] space-y-4 shadow-xl">
                <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-widest">
                  Core Product Principle
                </span>
                <blockquote className="text-xl sm:text-2xl font-mono text-[#F4F5EF] leading-snug border-l-2 border-[#C7FF55] pl-4">
                  "EVERY RESOURCE HAS A STORY.<br />
                  EVERY BOOKING HAS A RECORD.<br />
                  EVERY ACCESS DECISION HAS A REASON."
                </blockquote>
              </div>

              {/* Simulated Live Ledger Terminal Component */}
              <div className="rounded-2xl bg-[#0B0F0D] border border-[#202B24] p-5 font-mono text-xs shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C251F] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C7FF55] animate-pulse" />
                    <span className="text-[#F4F5EF] font-bold">SHA-256 LEDGER AUDIT FEED</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">LIVE SERVER EVENT BUS</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded bg-[#111713] border border-[#1A231C] space-y-1">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-[#C7FF55] font-bold">BOOKING_APPROVED</span>
                      <span className="text-[10px] text-zinc-500">ref: BK-9128 • 10m ago</span>
                    </div>
                    <p className="text-zinc-300">
                      Dr. Aris Thorne approved reservation for Elena Rostova. Reason: "Laser safety clearance verified."
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#111713] border border-[#1A231C] space-y-1">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-[#38BDF8] font-bold">HANDOVER_CHECKIN_COMPLETE</span>
                      <span className="text-[10px] text-zinc-500">ref: HO-4421 • 32m ago</span>
                    </div>
                    <p className="text-zinc-300">
                      Bilateral physical inspection recorded: All 4 lens adapters present. Baseline condition verified.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#111713] border border-[#1A231C] space-y-1">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-[#F0BE67] font-bold">FIFO_WAITLIST_PROMOTED</span>
                      <span className="text-[10px] text-zinc-500">ref: WL-1089 • 1h ago</span>
                    </div>
                    <p className="text-zinc-300">
                      Slot cancelled by user. Next eligible seeker in queue automatically promoted with 4h claim window.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-[#1C251F]">
                  <span>HASH CHAIN VALIDATED: OK</span>
                  <Link href="/audit" className="text-[#C7FF55] hover:underline flex items-center gap-1">
                    <span>Inspect Full Ledger</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL IMMERSIVE CALL TO ACTION */}
      <section className="py-24 bg-gradient-to-t from-[#111713] via-[#080908] to-[#080908] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(199,255,85,0.08),transparent_80%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141C16] border border-[#27352B] text-xs font-mono text-[#C7FF55]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for University & Institutional Deployment</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#F4F5EF] leading-tight">
            Ready to unlock the idle power of your laboratories?
          </h2>

          <p className="text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Join the researchers, laboratory managers, and campus makerspaces sharing high-value equipment with complete accountability.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/resources"
              className="px-8 py-4 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-sm hover:bg-[#b5f23d] transition-all shadow-[0_0_25px_rgba(199,255,85,0.25)] hover:shadow-[0_0_35px_rgba(199,255,85,0.4)]"
            >
              Browse Available Resources
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-4 rounded-xl bg-[#141A16] hover:bg-[#1E2621] border border-[#27352B] text-sm text-[#F4F5EF] font-semibold transition-all"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
