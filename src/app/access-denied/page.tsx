import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="flex-1 bg-[#F7F5EF] flex items-center justify-center p-4 py-24 text-center">
      <div className="max-w-md space-y-5 p-8 rounded-2xl bg-white border border-[#EFE9DD] shadow-warm-md">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#20231F] tracking-tight">Access Restricted</h1>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            Your current account role does not have authorization to view this section. Use the Demo Switcher bar above to quickly switch personas (e.g. Lab Manager or Auditor).
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#20231F] text-white text-xs font-bold hover:bg-[#3B66F5] transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
