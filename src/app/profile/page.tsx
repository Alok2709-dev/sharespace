'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, ShieldCheck, ShieldAlert, Clock, CheckCircle2,
  Building, Mail, Calendar, FileText, ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const sessRes = await fetch('/api/auth/session');
      const sess = await sessRes.json();
      if (!sess.user) {
        router.push('/login');
        return;
      }
      setUser(sess.user);

      const vRes = await fetch('/api/eligibility');
      const vData = await vRes.json();
      setVerifications(vData.verifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-medium text-sm">
        Loading credential wallet...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={user?.full_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-[#EFE9DD]"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#3B66F5] tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
                Institutional Member
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#20231F] tracking-tight">
                {user?.full_name}
              </h1>
              <p className="text-sm text-zinc-500 font-medium">
                {user?.email} • Role: <strong className="text-[#3B66F5] uppercase">{user?.role}</strong>
              </p>
              <p className="text-xs text-zinc-400">
                {user?.department} • Apex Institute of Science & Technology
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Status:</span>
              <span className="text-emerald-700 font-bold uppercase text-sm">{user?.status}</span>
            </div>
          </div>
        </div>

        {/* Verified Prerequisite Credentials Wallet */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFE9DD]">
            <div>
              <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3B66F5]" />
                <span>Verified Prerequisite Credentials & Certifications</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                These authenticated credentials unlock access to high-consequence laboratories and machinery.
              </p>
            </div>
            <span className="text-xs font-bold text-zinc-500 bg-[#F7F5EF] px-3 py-1 rounded-full border border-[#EFE9DD]">
              {verifications.length} credential(s)
            </span>
          </div>

          {verifications.length === 0 ? (
            <p className="text-sm text-zinc-400 py-8 text-center font-medium">
              No certifications on record yet. Complete baseline training modules or request manager authorization.
            </p>
          ) : (
            <div className="space-y-3">
              {verifications.map((v: any) => {
                const isVerified = v.status === 'verified';
                const isExpired = v.expires_at && new Date(v.expires_at) < new Date();

                return (
                  <div
                    key={v.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isVerified
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-[#F7F5EF] border-[#EFE9DD]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#20231F]">{v.requirement_type.toUpperCase()}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-zinc-500 border border-zinc-200">
                          Apex Institute
                        </span>
                      </div>
                      {v.verification_notes && (
                        <p className="text-xs text-zinc-600 italic">
                          "{v.verification_notes}"
                        </p>
                      )}
                      <div className="text-[11px] text-zinc-500">
                        {v.verifier_name && <span>Verified by: {v.verifier_name} • </span>}
                        {v.expires_at && <span>Expires: {v.expires_at}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Authenticated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {v.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
