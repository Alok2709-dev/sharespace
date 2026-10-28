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
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Trust & Safety Resolution Console</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#20231F] mt-1">
              Incident & Damage Triage
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Human-in-the-loop dispute evaluation. All discrepancies flagged at handover or return are formally resolved.
            </p>
          </div>

          <span className="text-xs font-bold text-zinc-500 bg-[#F7F5EF] px-3.5 py-1.5 rounded-full border border-[#EFE9DD] self-start sm:self-center">
            {incidents.length} incident record(s) on file
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EFE9DD] pb-3 overflow-x-auto">
          {['all', 'open', 'under_review', 'resolved', 'escalated'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs uppercase font-bold transition-all whitespace-nowrap border ${
                statusFilter === st
                  ? 'bg-[#3B66F5] text-white border-[#3B66F5] shadow-sm'
                  : 'bg-white hover:bg-[#EFE9DD] text-zinc-600 border-[#EFE9DD]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 font-medium text-sm flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#3B66F5] border-t-transparent animate-spin" />
            <span>Loading incident records...</span>
          </div>
        ) : incidents.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white border border-[#EFE9DD] rounded-3xl p-8 shadow-warm-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-lg font-bold text-[#20231F]">No Incidents Flagged</p>
            <p className="text-xs text-zinc-500">All equipment handovers and returns are currently verified intact and operational.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map(inc => (
              <TiltCard key={inc.id} tiltMaxAngle={3} scaleOnHover={1.01}>
                <div className="p-7 rounded-3xl bg-white border border-[#EFE9DD] hover:border-[#3B66F5]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-warm-md">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                        {inc.incident_reference}
                      </span>
                      <StatusBadge status={inc.status} size="sm" />
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        inc.severity === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        inc.severity === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}>
                        {inc.severity} Severity
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">
                        [{inc.category.replace('_', ' ')}]
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#20231F]">
                      {inc.resource_title}
                    </h3>

                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span>Reported by: {inc.reporter_name}</span>
                      <span>•</span>
                      <span>Date: {inc.created_at}</span>
                      {inc.reviewer_name && (
                        <>
                          <span>•</span>
                          <span className="text-[#3B66F5] font-bold">Assigned: {inc.reviewer_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="px-5 py-2.5 rounded-xl bg-[#F7F5EF] hover:bg-[#3B66F5] hover:text-white border border-[#EFE9DD] text-xs font-bold text-[#20231F] flex items-center gap-2 transition-all shadow-sm"
                    >
                      <span>Investigate & Resolve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
