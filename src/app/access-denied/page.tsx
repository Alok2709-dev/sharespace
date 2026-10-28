import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="flex-1 bg-[#0B0D0C] flex items-center justify-center p-4 py-20 text-center">
      <div className="max-w-md space-y-4 p-8 rounded-xl bg-[#131715] border border-[#212824]">
        <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#F4F5EF]">Access Restricted</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your current account role does not have authorization to access this administrative or custodial endpoint. Access decisions are strictly enforced on the server.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-[#191F1B] border border-[#2F3933] text-xs font-semibold text-[#C7FF55] hover:bg-[#232B26] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
