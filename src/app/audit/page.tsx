'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database, Filter, Search, Download, ShieldCheck, ArrowRight, Activity, Terminal } from 'lucide-react';

export default function AuditPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    fetchAuditEvents();
  }, [entityFilter, actionFilter]);

  async function fetchAuditEvents() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (entityFilter !== 'all') params.set('entityType', entityFilter);
      if (actionFilter !== 'all') params.set('actionType', actionFilter);

      const res = await fetch(`/api/audit?${params.toString()}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sharespace-audit-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#3B66F5]">
              <Database className="w-3.5 h-3.5" />
              <span>Tamper-Resistant Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#20231F] mt-1">
              Immutable Audit Ledger
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Server-recorded transactional history. All state changes, decisions, and access permissions are captured with forensic traceability.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-5 py-3 rounded-2xl bg-[#20231F] hover:bg-[#3B66F5] text-white text-xs font-bold flex items-center gap-2 self-start sm:self-center transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#FFD76A]" />
            <span>Export Ledger (JSON)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-5 rounded-2xl bg-white border border-[#EFE9DD] flex flex-wrap items-center justify-between gap-4 text-xs shadow-warm-md">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 uppercase font-bold text-[10px]">Entity Scope:</span>
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] font-bold focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
            >
              <option value="all">All Entities</option>
              <option value="booking">Bookings</option>
              <option value="resource">Resources</option>
              <option value="check_in">Handovers / Returns</option>
              <option value="incident">Incidents</option>
              <option value="user">User Accounts</option>
              <option value="institution">Institutional Policy</option>
            </select>
          </div>

          <div className="text-zinc-500 font-medium">
            Showing <strong className="text-[#3B66F5] font-black">{events.length}</strong> immutable events
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-3xl bg-white border border-[#EFE9DD] overflow-hidden shadow-warm-md">
          {loading ? (
            <div className="py-24 text-center text-zinc-400 font-medium text-sm flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#3B66F5] border-t-transparent animate-spin" />
              <span>Querying persistent audit database...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-sm font-medium">
              No audit records match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5EF] border-b border-[#EFE9DD] text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Timestamp</th>
                    <th className="py-4 px-5">Action Event</th>
                    <th className="py-4 px-5">Actor</th>
                    <th className="py-4 px-5">Entity</th>
                    <th className="py-4 px-5">State Transition</th>
                    <th className="py-4 px-5">Recorded Decision Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DD]">
                  {events.map(evt => (
                    <tr key={evt.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                      <td className="py-4 px-5 text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                        {evt.created_at}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3B66F5] border border-blue-100 font-bold whitespace-nowrap text-[11px]">
                          {evt.action_type}
                        </span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="text-[#20231F] font-bold">{evt.actor_name}</span>
                        <span className="text-zinc-400 text-[10px] block">[{evt.actor_role}]</span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap text-zinc-500">
                        {evt.entity_type} ({evt.entity_id})
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        {evt.prev_state && evt.new_state ? (
                          <span className="text-zinc-600 font-medium">
                            <span className="text-zinc-400">{evt.prev_state}</span> &rarr;{' '}
                            <span className="text-emerald-700 font-bold">{evt.new_state}</span>
                          </span>
                        ) : evt.new_state ? (
                          <span className="text-emerald-700 font-bold">{evt.new_state}</span>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-zinc-600 max-w-xs truncate font-medium" title={evt.decision_reason}>
                        {evt.decision_reason || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
