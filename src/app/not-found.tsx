import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 bg-[#0B0D0C] flex items-center justify-center p-4 py-24 text-center">
      <div className="max-w-md space-y-4 p-8 rounded-xl bg-[#131715] border border-[#212824]">
        <div className="w-12 h-12 rounded-full bg-[#191F1B] border border-[#2F3933] text-[#C7FF55] flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#F4F5EF]">Resource Not Located</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The requested page or record does not exist in the institutional registry.
        </p>
        <div className="pt-2">
          <Link
            href="/resources"
            className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] text-xs font-bold hover:bg-[#b5f23d] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Active Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
