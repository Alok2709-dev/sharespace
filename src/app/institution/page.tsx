'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, Sliders, Shield, Users, Save, CheckCircle2,
  AlertTriangle, ArrowLeft, Loader2, Award
} from 'lucide-react';

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
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Loading institutional governance node...
      </div>
    );
  }

  const isManager = ['institution_manager', 'admin'].includes(currentUser?.role);

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider">
              Institutional Governance
            </span>
            <h1 className="text-2xl font-bold text-[#F4F5EF]">
              {data?.institution?.name}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              📍 {data?.institution?.location} • Domain: {data?.institution?.domain}
            </p>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400">
            <span className="px-2.5 py-1 rounded bg-[#191F1B] border border-[#212824] text-[#C7FF55]">
              {data?.members?.length || 0} Registered Members
            </span>
          </div>
        </div>

        {/* 2 Columns: Policy Configuration & Institutional Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fair-Use Policy Controls */}
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#212824]">
              <div>
                <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C7FF55]" />
                  <span>Fair-Use Allocation & Quota Engine</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Defines fair access limits to avoid instrument hoarding across departments.
                </p>
              </div>
            </div>

            {message && (
              <div className="p-3 text-xs bg-[#12241A] border border-[#224A33] text-[#78D9A0] rounded-lg">
                {message}
              </div>
            )}

            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Max Active Reservations Per Seeker
                </label>
                <input
                  type="number"
                  disabled={!isManager}
                  value={maxActive}
                  onChange={e => setMaxActive(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF] disabled:opacity-60"
                />
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                  Prevents single researchers or research labs from monopolizing shared core facilities.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Advance Scheduling Limit (Days)
                </label>
                <input
                  type="number"
                  disabled={!isManager}
                  value={maxAdvance}
                  onChange={e => setMaxAdvance(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Cancellation Grace Period (Hours)
                </label>
                <input
                  type="number"
                  disabled={!isManager}
                  value={cancelLeadHours}
                  onChange={e => setCancelLeadHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Waiting List Promotion Model
                </label>
                <select
                  disabled={!isManager}
                  value={fairMode}
                  onChange={e => setFairMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF] disabled:opacity-60"
                >
                  <option value="explainable_fifo">Explainable FIFO (Transparent Queue Position)</option>
                  <option value="priority_thesis">Academic Thesis Priority Weighted</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    disabled={!isManager}
                    checked={requireTwoParty}
                    onChange={e => setRequireTwoParty(e.target.checked)}
                    className="rounded bg-[#0B0D0C] text-[#C7FF55]"
                  />
                  <span>Mandatory Two-Party Physical Handover Inspection Sign-off</span>
                </label>
              </div>

              {isManager && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d] transition-colors flex items-center gap-1.5"
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
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#212824]">
              <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C7FF55]" />
                <span>Verified Institutional Roster ({data?.members?.length || 0})</span>
              </h2>
              <span className="text-xs font-mono text-zinc-500">Database Records</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {data?.members?.map((m: any) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg bg-[#0B0D0C] border border-[#212824] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                      alt={m.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-[#2F3933]"
                    />
                    <div>
                      <div className="font-bold text-[#F4F5EF]">{m.full_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{m.email}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#191F1B] border border-[#2F3933] text-[10px] uppercase font-bold text-[#C7FF55]">
                      {m.role === 'institution_manager' ? 'Inst Mgr' : m.role}
                    </span>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{m.status}</div>
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
