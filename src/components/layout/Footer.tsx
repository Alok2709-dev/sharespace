import React from 'react';
import Link from 'next/link';
import { Share2, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#EFE9DD] border-t border-[#E2DAC9] pt-16 pb-12 text-[#555B53] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#DCD5C4]">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF9466] to-[#4169E1] flex items-center justify-center text-white shadow-xs">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="font-editorial font-extrabold tracking-tight text-lg text-[#20231F]">
                ShareSpace
              </span>
            </div>
            <p className="text-[#555B53] text-xs max-w-md leading-relaxed font-sans">
              The modern resource-sharing platform for campus communities, laboratories, makerspaces, and creators. Share what you have, discover what you need, and make more happen together.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-[#DFD8C6] max-w-md shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#FF7A45] block mb-1">
                Guiding Community Principle
              </span>
              <p className="font-editorial text-sm font-bold text-[#20231F] leading-snug">
                Every resource has a story. Every booking has a record. Every access decision has a reason.
              </p>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="uppercase tracking-wider text-xs font-bold text-[#20231F] mb-3 font-sans">
              Explore
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/resources" className="hover:text-[#4169E1] transition-colors">
                  Resource Directory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#4169E1] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/trust-and-safety" className="hover:text-[#4169E1] transition-colors">
                  Trust & Safety Standards
                </Link>
              </li>
              <li>
                <Link href="/institution" className="hover:text-[#4169E1] transition-colors">
                  Fair-Use Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Community */}
          <div>
            <h4 className="uppercase tracking-wider text-xs font-bold text-[#20231F] mb-3 font-sans">
              Accountability
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/audit" className="hover:text-[#4169E1] transition-colors">
                  Activity Audit Ledger
                </Link>
              </li>
              <li>
                <Link href="/incidents" className="hover:text-[#4169E1] transition-colors">
                  Incident Resolution
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#4169E1] transition-colors">
                  Campus Utilization Metrics
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#4169E1] transition-colors">
                  Prerequisite Credentials
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7C837C] font-medium">
          <p>© {new Date().getFullYear()} ShareSpace. Made for students, faculty, and collaborative teams.</p>
          <div className="flex items-center gap-4">
            <span>High-Speed Relational Persistence</span>
            <span>•</span>
            <span>Fair FIFO Allocation Engine</span>
            <span>•</span>
            <span className="text-[#22C55E] font-bold">System Status: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
