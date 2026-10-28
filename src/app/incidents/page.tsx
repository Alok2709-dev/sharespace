'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, Filter,
  ArrowRight, PlusCircle, Search, Shield
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

export default function IncidentsPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter]);

  async function fetchIncidents() {
    setLoading(true);
    try {
      const url = statusFilter === 'all' ? '/api/incidents' : `/api/incidents?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setIncidents(data.incidents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 bg-[#080908] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-[#141010] via-[#0E0B0B] to-[#0A0808] border border-[#2D1B1B] relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201414] border border-[#3A1E1E] text-xs font-mono text-[#F17D78]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Trust & Safety Resolution Console</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF] mt-1">
              Incident & Damage Triage
            </h1>
            <p className="text-xs text-zinc-400 font-sans">
              Human-in-the-loop dispute evaluation. All discrepancies flagged at handover or return are formally resolved.
            </p>
          </div>

          <span className="text-xs font-mono text-zinc-500 self-start sm:self-center">
            {incidents.length} incident record(s) on file
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1E2621] pb-3 overflow-x-auto">
          {['all', 'open', 'under_review', 'resolved', 'escalated'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase transition-all whitespace-nowrap border ${
                statusFilter === st
                  ? 'bg-[#18221B] text-[#C7FF55] border-[#C7FF55]/40 font-bold shadow-sm'
                  : 'bg-[#101412] hover:bg-[#161D18] text-zinc-400 border-[#1C251F]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#F17D78] border-t-transparent animate-spin" />
            <span>Loading incident records...</span>
          </div>
        ) : incidents.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#111613] border border-[#202C23] rounded-3xl p-8 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-[#78D9A0] mx-auto" />
            <p className="text-base font-semibold text-[#F4F5EF]">No Incidents Flagged</p>
            <p className="text-xs text-zinc-400">All equipment handovers and returns are currently verified intact and operational.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map(inc => (
              <TiltCard key={inc.id} tiltMaxAngle={3} scaleOnHover={1.01}>
                <div className="p-6 rounded-2xl bg-[#111613] border border-[#202C23] hover:border-[#2E3C32] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs text-[#F17D78] font-bold">
                        {inc.incident_reference}
                      </span>
                      <StatusBadge status={inc.status} size="sm" />
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                        inc.severity === 'critical' ? 'bg-red-950/60 text-red-400 border-red-800' :
                        inc.severity === 'high' ? 'bg-orange-950/60 text-orange-400 border-orange-800' :
                        'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {inc.severity} Severity
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        [{inc.category.replace('_', ' ')}]
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F4F5EF]">
                      {inc.resource_title}
                    </h3>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-1">
                      <span>Reported by: {inc.reporter_name}</span>
                      <span>•</span>
                      <span>Date: {inc.created_at}</span>
                      {inc.reviewer_name && (
                        <>
                          <span>•</span>
                          <span className="text-[#C7FF55]">Assigned: {inc.reviewer_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="px-4 py-2.5 rounded-xl bg-[#151D18] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-[#F4F5EF] flex items-center gap-2 transition-all hover:border-[#C7FF55]/40"
                    >
                      <span>Investigate & Resolve</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C7FF55]" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
