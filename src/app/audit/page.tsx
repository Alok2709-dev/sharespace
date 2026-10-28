'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database, Filter, Search, Download, ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
              Institutional Governance & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF] mt-1">
              Immutable Audit Ledger
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Server-recorded transactional history. All state changes, decisions, and access permissions are captured.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] flex items-center gap-1.5 self-start"
          >
            <Download className="w-3.5 h-3.5 text-[#C7FF55]" />
            <span>Export Audit Records (JSON)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase">Entity Scope:</span>
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF]"
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

          <div className="text-zinc-500 ml-auto">
            Showing {events.length} immutable events
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-xl bg-[#131715] border border-[#212824] overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-zinc-500 font-mono text-xs">
              Querying persistent audit database...
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs">
              No audit records match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#191F1B] border-b border-[#212824] text-zinc-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action Event</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">State Transition</th>
                    <th className="py-3 px-4">Recorded Decision Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#191F1B]">
                  {events.map(evt => (
                    <tr key={evt.id} className="hover:bg-[#191F1B]/40 transition-colors">
                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {evt.created_at}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#C7FF55]/10 text-[#C7FF55] border border-[#C7FF55]/20 font-bold whitespace-nowrap">
                          {evt.action_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[#F4F5EF] font-semibold">{evt.actor_name}</span>
                        <span className="text-zinc-500 text-[10px] block">[{evt.actor_role}]</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-zinc-400">
                        {evt.entity_type} ({evt.entity_id})
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {evt.prev_state && evt.new_state ? (
                          <span className="text-zinc-300">
                            <span className="text-zinc-500">{evt.prev_state}</span> &rarr;{' '}
                            <span className="text-[#C7FF55] font-semibold">{evt.new_state}</span>
                          </span>
                        ) : evt.new_state ? (
                          <span className="text-[#78D9A0]">{evt.new_state}</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-xs truncate" title={evt.decision_reason}>
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
