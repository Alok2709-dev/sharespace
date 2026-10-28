import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0B0D0C] border-t border-[#212824] pt-16 pb-12 text-[#A0A69F] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#212824]">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55]">
                <span className="font-mono font-black text-xs">SS</span>
              </div>
              <span className="font-mono font-bold tracking-tight text-sm text-[#F4F5EF]">
                SHARESPACE
              </span>
            </div>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
              Institutional resource-sharing and lifecycle management platform. Enabling research institutions, laboratories, and universities to safely allocate underused scientific equipment, cleanrooms, and facilities with auditable accountability.
            </p>
            <div className="p-3 rounded bg-[#131715] border border-[#212824] max-w-md">
              <span className="text-[10px] font-mono uppercase text-[#C7FF55] block mb-1">
                Guiding Institutional Principle:
              </span>
              <p className="font-mono text-[11px] text-[#F4F5EF] tracking-tight">
                EVERY RESOURCE HAS A STORY.<br />
                EVERY BOOKING HAS A RECORD.<br />
                EVERY ACCESS DECISION HAS A REASON.
              </p>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-xs font-semibold text-[#F4F5EF] mb-3">
              Infrastructure
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="hover:text-[#C7FF55] transition-colors">
                  Resource Marketplace
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#C7FF55] transition-colors">
                  Lifecycle Workflow
                </Link>
              </li>
              <li>
                <Link href="/trust-and-safety" className="hover:text-[#C7FF55] transition-colors">
                  Trust & Safety Architecture
                </Link>
              </li>
              <li>
                <Link href="/institution" className="hover:text-[#C7FF55] transition-colors">
                  Fair-Use Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-xs font-semibold text-[#F4F5EF] mb-3">
              Governance & Integrity
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/audit" className="hover:text-[#C7FF55] transition-colors">
                  Immutable Audit Ledger
                </Link>
              </li>
              <li>
                <Link href="/incidents" className="hover:text-[#C7FF55] transition-colors">
                  Incident & Damage Protocols
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#C7FF55] transition-colors">
                  Institutional Utilization Metrics
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#C7FF55] transition-colors">
                  Prerequisite Credentials
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} SHARESPACE Platform. Built for Institutional Integrity.</p>
          <div className="flex items-center gap-6">
            <span>Server Engine: Node.js 24 + SQLite WAL</span>
            <span>Zero-Trust Role Enforcement</span>
            <span className="text-[#C7FF55]">Status: 100% Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
