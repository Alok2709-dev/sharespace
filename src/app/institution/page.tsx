'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, Sliders, Shield, Users, Save, CheckCircle2,
  AlertTriangle, ArrowLeft, Loader2, Award
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function InstitutionPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Policy Form State
  const [maxActive, setMaxActive] = useState(3);
  const [maxAdvance, setMaxAdvance] = useState(30);
  const [cancelLeadHours, setCancelLeadHours] = useState(12);
  const [fairMode, setFairMode] = useState('explainable_fifo');
  const [requireTwoParty, setRequireTwoParty] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      setCurrentUser(sess.user);

      const res = await fetch('/api/institution');
      const d = await res.json();
      setData(d);

      const p = d.institution?.policy_settings || {};
      setMaxActive(p.max_active_bookings_per_user || 3);
      setMaxAdvance(p.max_advance_booking_days || 30);
      setCancelLeadHours(p.cancellation_lead_hours || 12);
      setFairMode(p.fair_allocation_mode || 'explainable_fifo');
      setRequireTwoParty(p.require_two_party_handover !== false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePolicy(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/institution', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_settings: {
            max_active_bookings_per_user: Number(maxActive),
            max_advance_booking_days: Number(maxAdvance),
            cancellation_lead_hours: Number(cancelLeadHours),
            fair_allocation_mode: fairMode,
            require_two_party_handover: requireTwoParty
          }
        })
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to save policy');

      setMessage('Institutional fair-use policy updated and recorded in the audit history.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-3 text-zinc-500 font-medium text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-[#3B66F5] border-t-transparent animate-spin" />
        <span>Loading institutional governance node...</span>
      </div>
    );
  }

  const isManager = ['institution_manager', 'admin'].includes(currentUser?.role);

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#3B66F5]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Institutional Governance</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#20231F] mt-1">
              {data?.institution?.name}
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              📍 {data?.institution?.location} • Domain: {data?.institution?.domain}
            </p>
          </div>

          <div className="text-right">
            <span className="px-4 py-2 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#3B66F5] font-bold text-xs shadow-sm inline-block">
              {data?.members?.length || 0} Registered Members
            </span>
          </div>
        </div>

        {/* 2 Columns: Policy Configuration & Institutional Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fair-Use Policy Controls */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DD]">
              <div>
                <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#3B66F5]" />
                  <span>Fair-Use Allocation & Quota Engine</span>
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                  Defines fair access limits to avoid instrument hoarding across departments.
                </p>
              </div>
            </div>

            {message && (
              <div className="p-4 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold">
                {message}
              </div>
            )}

            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Max Active Reservations Per Seeker
                </label>
                <input
                  type="number"
                  disabled={!isManager}
                  value={maxActive}
                  onChange={e => setMaxActive(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-bold text-[#20231F] disabled:opacity-60 focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Prevents single researchers or research labs from monopolizing shared core facilities.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Advance Scheduling Limit (Days)
                </label>
                <input
                  type="number"
                  disabled={!isManager}
                  value={maxAdvance}
                  onChange={e => setMaxAdvance(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-bold text-[#20231F] disabled:opacity-60 focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Cancellation Grace Period (Hours)
                </label>
                <input
                  type="number"
                  disabled={!isManager}
                  value={cancelLeadHours}
                  onChange={e => setCancelLeadHours(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-bold text-[#20231F] disabled:opacity-60 focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Waiting List Promotion Model
                </label>
                <select
                  disabled={!isManager}
                  value={fairMode}
                  onChange={e => setFairMode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-bold text-[#20231F] disabled:opacity-60 focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
                >
                  <option value="explainable_fifo">Explainable FIFO (Transparent Queue Position)</option>
                  <option value="priority_thesis">Academic Thesis Priority Weighted</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-zinc-700 font-medium p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!isManager}
                    checked={requireTwoParty}
                    onChange={e => setRequireTwoParty(e.target.checked)}
                    className="rounded accent-[#3B66F5]"
                  />
                  <span>Mandatory Two-Party Physical Handover Inspection Sign-off</span>
                </label>
              </div>

              {isManager && (
                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-2xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Policy Configuration</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Institutional Member Directory */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DD]">
              <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3B66F5]" />
                <span>Verified Institutional Roster ({data?.members?.length || 0})</span>
              </h2>
              <span className="text-xs font-bold text-zinc-500 bg-[#F7F5EF] px-3 py-1 rounded-full border border-[#EFE9DD]">Database Records</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {data?.members?.map((m: any) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                      alt={m.full_name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#EFE9DD]"
                    />
                    <div>
                      <div className="font-bold text-[#20231F]">{m.full_name}</div>
                      <div className="text-[11px] text-zinc-500 font-medium">{m.email}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] uppercase font-bold text-[#3B66F5]">
                      {m.role === 'institution_manager' ? 'Inst Mgr' : m.role}
                    </span>
                    <div className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold">{m.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
