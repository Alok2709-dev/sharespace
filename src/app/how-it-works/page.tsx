import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Database, Clock, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 bg-[#F7F5EF] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E1D3] text-xs font-bold text-[#FF7A45] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Sharing Guide</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#20231F]">
            How ShareSpace Works
          </h1>
          <p className="text-base sm:text-lg text-[#555B53] leading-relaxed font-sans">
            A trusted digital network making it simple and fair for students, researchers, and creators to share valuable equipment and facilities.
          </p>
        </div>

        {/* 5-Stage Step Breakdown with Curated Colorful Cards */}
        <div className="space-y-6">
          {[
            {
              num: '01',
              title: 'Discover & Check Qualifications',
              desc: 'Explore verified campus tools, studios, and testing spaces. Transparent eligibility guidelines let you know upfront if an orientation or safety certification is needed.',
              color: 'text-[#4169E1]',
              bg: 'bg-white',
              features: ['Real-time calendar availability', 'Clear safety training prerequisites', 'AI Assistant for quick capability matching']
            },
            {
              num: '02',
              title: 'Fair Reservations & Transparent Waitlists',
              desc: 'Select your time window and explain your project purpose. Our scheduling engine ensures zero double-booking, and if someone is already using a slot, you join an explainable FIFO waitlist.',
              color: 'text-[#FF7A45]',
              bg: 'bg-white',
              features: ['No simultaneous double-booking', 'Visible position in the waitlist', 'Automatic promotion if a slot is cancelled']
            },
            {
              num: '03',
              title: 'Custodian Approval with Real Reasons',
              desc: 'Laboratory managers and tool owners review each request. Access decisions are recorded with clear notes, preventing arbitrary favoritism or silent rejections.',
              color: 'text-[#8A63D2]',
              bg: 'bg-white',
              features: ['Written reasons for every decision', 'Direct notifications to seekers', 'Protection against privilege misuse']
            },
            {
              num: '04',
              title: 'Two-Party Check-In & Checklist',
              desc: 'At pickup, both you and the custodian review the gear together. Condition notes and included accessories (cables, adapters, lenses) are logged so there are never surprises.',
              color: 'text-[#22C55E]',
              bg: 'bg-white',
              features: ['Custodian verification sign-off', 'Itemized accessory checklists', 'Tamper-proof handover timestamp']
            },
            {
              num: '05',
              title: 'Careful Return & Final Inspection',
              desc: 'Bring the item back when your session ends. A quick comparative inspection confirms condition against checkout, safely closing the loop for the next creator.',
              color: 'text-[#3B66F5]',
              bg: 'bg-white',
              features: ['Side-by-side condition comparison', 'Helpful resolution if damage occurs', 'Instant release of the slot for the community']
            }
          ].map((stage, i) => (
            <TiltCard key={i} tiltMaxAngle={3} scaleOnHover={1.01}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E1D3] space-y-5 shadow-warm-md hover:shadow-warm-xl transition-all">
                <div className="flex items-center gap-4">
                  <span className={`text-4xl font-editorial font-black ${stage.color}`}>{stage.num}</span>
                  <h2 className="font-editorial text-2xl font-bold text-[#20231F]">{stage.title}</h2>
                </div>
                <p className="text-sm text-[#555B53] leading-relaxed font-sans">{stage.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#EFE9DD]">
                  {stage.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-[#555B53] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Call to action */}
        <div className="p-10 rounded-3xl bg-[#EFE9DD]/70 border border-[#DCD5C4] text-center space-y-4 shadow-warm-sm">
          <h3 className="font-editorial text-3xl font-bold text-[#20231F]">
            Ready to share or book gear?
          </h3>
          <p className="text-sm text-[#555B53] max-w-md mx-auto">
            Explore the active campus catalog or list underused items from your lab or studio.
          </p>
          <div className="pt-2">
            <Link
              href="/resources"
              className="px-8 py-4 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all inline-flex items-center gap-2 shadow-color-cobalt active:scale-95"
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
