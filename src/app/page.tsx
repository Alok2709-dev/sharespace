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
  Camera,
  Laptop,
  BookOpen,
  Calendar,
  Share2,
  PlusCircle,
  Heart,
  ChevronRight
} from 'lucide-react';
import { queryAll } from '@/lib/db/database';
import { StatusBadge } from '@/components/ui/Badge';
import { PlayfulHeroVisual } from '@/components/3d/PlayfulHeroVisual';
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

  const categoryThemes = [
    {
      category: 'Media & Optics',
      bgCard: 'bg-[#FFF0E8]',
      badgeBg: 'bg-white text-[#D9531E] border-[#FFD2BC]',
      accentBtn: 'hover:bg-[#FF7A45] hover:text-white',
      tag: 'Creative & Video'
    },
    {
      category: 'Microscopy & Imaging',
      bgCard: 'bg-[#EEF4FF]',
      badgeBg: 'bg-white text-[#2550C0] border-[#BDD5FF]',
      accentBtn: 'hover:bg-[#4169E1] hover:text-white',
      tag: 'Science & Optics'
    },
    {
      category: 'Additive Manufacturing',
      bgCard: 'bg-[#F4EFFF]',
      badgeBg: 'bg-white text-[#6941C6] border-[#D9C8FF]',
      accentBtn: 'hover:bg-[#8A63D2] hover:text-white',
      tag: 'Prototyping & 3D'
    }
  ];

  const highlights = [
    { label: 'Available Core Resources', value: '12', sub: 'Cameras, Labs & Studios' },
    { label: 'Fair Waitlist Guarantee', value: '100%', sub: 'FIFO Automatic Queueing' },
    { label: 'Scheduling Conflicts', value: '0.0%', sub: 'Real-time Time-slot Locks' },
    { label: 'Verified Handovers', value: '100%', sub: 'Easy Check-in & Return' }
  ];

  return (
    <div className="flex flex-col flex-1 bg-[#F7F5EF] text-[#20231F] overflow-hidden">
      {/* 1. PLAYFUL & WARM HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E7E1D3] overflow-hidden bg-[#F7F5EF]">
        {/* Soft Organic Warm Pastel Blobs */}
        <div className="absolute top-0 right-1/4 w-[480px] h-[340px] bg-[#FFEBDD] rounded-full blur-3xl opacity-70 pointer-events-none -z-10" />
        <div className="absolute top-20 left-10 w-[360px] h-[360px] bg-[#EEF4FF] rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Expressive Warm Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E1D3] text-xs font-bold text-[#FF7A45] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF7A45] animate-ping" />
                <span>The Community Resource-Sharing Network</span>
              </div>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#20231F] leading-[1.04]">
                Good stuff should <br />
                <span className="text-[#4169E1] underline decoration-[#FFD76A] decoration-wavy decoration-from-font">
                  get shared.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#555B53] max-w-2xl leading-relaxed font-sans">
                From cameras and creative equipment to study spaces and lab essentials — find what you need, share what you have, and make more happen together.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/resources"
                  className="px-8 py-4 rounded-full bg-[#4169E1] text-white font-bold text-sm hover:bg-[#3256c9] transition-all flex items-center gap-2.5 shadow-color-cobalt active:scale-95 group"
                >
                  <span>Explore resources</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/owner/resources/new"
                  className="px-7 py-4 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#DCD5C4] text-sm font-bold text-[#20231F] transition-all active:scale-95 flex items-center gap-2 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-[#FF7A45]" />
                  <span>Share something</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#555B53] font-medium border-t border-[#E7E1D3]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#EDFBF3] text-[#22C55E] flex items-center justify-center font-bold text-xs">✓</span>
                  <span>Free & verified campus gear</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#EFF5FF] text-[#4169E1] flex items-center justify-center font-bold text-xs">✓</span>
                  <span>Fair waitlists for everyone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF0E8] text-[#FF7A45] flex items-center justify-center font-bold text-xs">✓</span>
                  <span>Two-party condition check-in</span>
                </div>
              </div>
            </div>

            {/* Right Column: Playful Interactive 3D / Floating Composition */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <PlayfulHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & COMMUNITY COUNTER BAR */}
      <section className="border-b border-[#E7E1D3] bg-[#EFE9DD]/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/70 border border-[#E7E1D3] shadow-xs space-y-1">
                <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#4169E1]">
                  {st.value}
                </div>
                <div className="text-xs font-bold text-[#20231F]">{st.label}</div>
                <div className="text-[11px] text-[#7C837C] font-medium">{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED CURATED RESOURCES WITH COLORFUL CARD IDENTITIES */}
      <section className="py-20 md:py-28 border-b border-[#E7E1D3] bg-[#F7F5EF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF5FF] text-xs font-bold text-[#4169E1] border border-[#BDD5FF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured On Campus</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#20231F]">
                Popular gear & spaces ready for you
              </h2>
              <p className="text-sm text-[#555B53] max-w-xl font-sans">
                Real tools and creative setups shared by campus departments, student makerspaces, and verified faculty.
              </p>
            </div>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4169E1] hover:underline"
            >
              <span>Explore all 12 items in catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Curated Colorful Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.map((res, idx) => {
              const theme = categoryThemes[idx % categoryThemes.length];

              return (
                <TiltCard key={res.id} tiltMaxAngle={6} scaleOnHover={1.025}>
                  <Link
                    href={`/resources/${res.id}`}
                    className={`block h-full rounded-3xl ${theme.bgCard} border border-[#E7E1D3] hover:border-[#D0C5B0] transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-warm-md hover:shadow-warm-xl`}
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative aspect-video w-full overflow-hidden p-3 pb-0">
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-white/50 relative">
                          <img
                            src={res.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
                            alt={res.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-xs ${theme.badgeBg}`}>
                              {theme.tag}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <StatusBadge status={res.status} size="sm" />
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-[#7C837C] font-semibold">
                          <span>📍 {res.location.split(',')[0]}</span>
                          <span>{res.lead_time_hours}h advance request</span>
                        </div>

                        <h3 className="font-editorial text-lg font-bold text-[#20231F] group-hover:text-[#4169E1] transition-colors line-clamp-1">
                          {res.title}
                        </h3>

                        <p className="text-xs text-[#555B53] line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-medium text-[#555B53]">
                          <span className="px-2.5 py-1 rounded-full bg-white/80 border border-[#E7E1D3]">
                            Max {Math.round(res.max_duration_minutes / 60)}h reservation
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/80 border border-[#E7E1D3]">
                            {res.deposit_amount > 0 ? `$${res.deposit_amount} Deposit` : 'Free to Book'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom CTA */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                        <span className="text-[#7C837C] font-medium text-[11px]">
                          Managed by {res.owner_name.split(' ')[0]}
                        </span>
                        <span className="text-[#4169E1] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Check Availability</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: SIMPLE, FRIENDLY 4-STAGE JOURNEY */}
      <section className="py-20 md:py-28 border-b border-[#E7E1D3] bg-[#EFE9DD]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A45]">
              Effortless & Responsible Sharing
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#20231F]">
              How ShareSpace Works
            </h2>
            <p className="text-sm sm:text-base text-[#555B53] leading-relaxed">
              No complicated bureaucratic paperwork. Just simple discovery, fair reservations, and verified handovers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discover Gear & Spaces',
                desc: 'Browse what your campus or community has to offer — from camera setups and 3D printers to soundproof pods.',
                bg: 'bg-white',
                numberColor: 'text-[#4169E1]'
              },
              {
                step: '02',
                title: 'Reserve Your Time',
                desc: 'Pick your hours and tell the owner what you are creating. If a slot is busy, join a transparent fair waitlist.',
                bg: 'bg-white',
                numberColor: 'text-[#FF7A45]'
              },
              {
                step: '03',
                title: 'Check In & Inspect',
                desc: 'Meet the custodian for a quick two-party checklist so everyone knows the items and condition are in great shape.',
                bg: 'bg-white',
                numberColor: 'text-[#8A63D2]'
              },
              {
                step: '04',
                title: 'Return with Confidence',
                desc: 'Drop off the gear when you finish. Condition is verified together, closing the record so the next student can create.',
                bg: 'bg-white',
                numberColor: 'text-[#22C55E]'
              }
            ].map((st, i) => (
              <div 
                key={i}
                className="p-7 rounded-3xl bg-white border border-[#E7E1D3] shadow-warm-md hover:shadow-warm-xl transition-all duration-300 space-y-3 relative group"
              >
                <span className={`text-4xl font-editorial font-black ${st.numberColor}`}>
                  {st.step}
                </span>
                <h3 className="text-lg font-bold text-[#20231F] pt-1">{st.title}</h3>
                <p className="text-xs text-[#555B53] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRUST & COMMUNITY CONFIDENCE */}
      <section className="py-20 md:py-28 border-b border-[#E7E1D3] bg-[#F7F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Values */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">
                Built on Trust & Respect
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#20231F] leading-tight">
                Designed to make sharing safe, simple, and fair.
              </h2>
              <p className="text-sm sm:text-base text-[#555B53] leading-relaxed">
                When equipment is expensive and spaces are in high demand, clarity matters. ShareSpace ensures everyone gets a fair turn and every item is returned just as it was received.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#E7E1D3] shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF5FF] text-[#4169E1] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#20231F]">Safety & Training Checks</h4>
                    <p className="text-xs text-[#555B53] mt-0.5">
                      Dangerous or delicate instruments require verified orientation first, ensuring safety for everyone.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E7E1D3] shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0E8] text-[#FF7A45] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#20231F]">Transparent Waitlists (No Favoritism)</h4>
                    <p className="text-xs text-[#555B53] mt-0.5">
                      If an item is booked, queue in order. You are automatically promoted when a spot opens.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E7E1D3] shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EDFBF3] text-[#22C55E] flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#20231F]">Two-Party Condition Inspections</h4>
                    <p className="text-xs text-[#555B53] mt-0.5">
                      Both parties confirm the condition at check-in and checkout, eliminating disputes over pre-existing wear.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Core Principle Card */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#4169E1] to-[#2546B0] text-white space-y-6 shadow-color-cobalt">
                <span className="text-[11px] font-sans uppercase tracking-widest text-[#FFD76A] font-bold">
                  The ShareSpace Principle
                </span>
                <blockquote className="font-editorial text-2xl sm:text-3xl font-bold leading-snug">
                  "Every resource has a story.<br />
                  Every booking has a record.<br />
                  Every access decision has a reason."
                </blockquote>
                <p className="text-xs text-blue-100 leading-relaxed font-sans">
                  We believe institutional creativity flourishes when resources are shared openly and cared for responsibly by the whole community.
                </p>

                <div className="pt-4 border-t border-white/20 flex flex-wrap gap-4 text-xs font-semibold">
                  <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md">
                    Max 3 Active Bookings / Student
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md">
                    100% Genuine Inventory
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 bg-[#EFE9DD]/50 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E1D3] text-xs font-bold text-[#FF7A45] shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-[#FF7A45]" />
            <span>Join Your Campus Sharing Network</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#20231F] leading-tight">
            Ready to find what you need to build what you imagine?
          </h2>

          <p className="text-base text-[#555B53] max-w-xl mx-auto leading-relaxed">
            Browse through cameras, fabrication tools, computing power, and quiet spaces right across your institution.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/resources"
              className="px-8 py-4 rounded-full bg-[#4169E1] text-white font-bold text-sm hover:bg-[#3256c9] transition-all shadow-color-cobalt active:scale-95"
            >
              Explore Available Resources
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-4 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#DCD5C4] text-sm text-[#20231F] font-bold transition-all shadow-xs"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
