'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, Filter,
  ArrowRight, PlusCircle, Search
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

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
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#F17D78]">
              Trust & Safety Resolution Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF] mt-1">
              Incident & Damage Management
            </h1>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            {incidents.length} incident record(s) on file
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#212824] pb-2 overflow-x-auto">
          {['all', 'open', 'under_review', 'resolved', 'escalated'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-[#191F1B] text-[#C7FF55] border border-[#2F3933] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs">
            Loading incident records...
          </div>
        ) : incidents.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#131715] border border-[#212824] rounded-xl p-8">
            <CheckCircle2 className="w-8 h-8 text-[#78D9A0] mx-auto" />
            <p className="text-base font-semibold text-[#F4F5EF]">No Incidents Found</p>
            <p className="text-xs text-zinc-400">All equipment handovers and returns are currently verified intact.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map(inc => (
              <div
                key={inc.id}
                className="p-5 rounded-xl bg-[#131715] border border-[#212824] hover:border-[#2F3933] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-[#F17D78] font-bold">
                      {inc.incident_reference}
                    </span>
                    <StatusBadge status={inc.status} size="sm" />
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      inc.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                      inc.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      'bg-zinc-800 text-zinc-300'
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

                  <p className="text-xs text-zinc-300 leading-relaxed">
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
                    className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Investigate & Resolve</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C7FF55]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
