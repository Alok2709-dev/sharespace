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
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Loading credential wallet...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 rounded-full object-cover border border-[#2F3933]"
            />
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider">
                Institutional Member
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F4F5EF]">
                {user?.full_name}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">
                {user?.email} • Role: <strong className="text-[#C7FF55] uppercase">{user?.role}</strong>
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                {user?.department} • Apex Institute of Science & Technology
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400">
            <div className="p-2 rounded bg-[#0B0D0C] border border-[#212824]">
              <span className="text-[10px] text-zinc-500 block">Status:</span>
              <span className="text-[#78D9A0] font-bold uppercase">{user?.status}</span>
            </div>
          </div>
        </div>

        {/* Verified Prerequisite Credentials Wallet */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#212824]">
            <div>
              <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C7FF55]" />
                <span>Verified Prerequisite Credentials & Certifications</span>
              </h2>
              <p className="text-xs text-zinc-400">
                These authenticated credentials unlock access to high-consequence laboratories and machinery.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {verifications.length} credential(s) on file
            </span>
          </div>

          {verifications.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
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
                    className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isVerified
                        ? 'bg-[#12241A]/30 border-[#224A33]'
                        : 'bg-[#0B0D0C] border-[#212824]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F4F5EF]">{v.requirement_type.toUpperCase()}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-zinc-400">
                          Apex Institute
                        </span>
                      </div>
                      {v.verification_notes && (
                        <p className="text-xs text-zinc-300 italic font-mono">
                          "{v.verification_notes}"
                        </p>
                      )}
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {v.verifier_name && <span>Verified by: {v.verifier_name} • </span>}
                        {v.expires_at && <span>Expires: {v.expires_at}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241A] text-[#78D9A0] font-mono text-xs font-bold border border-[#224A33]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Authenticated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#292212] text-[#F0BE67] font-mono text-xs font-bold border border-[#4E3E1C]">
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
