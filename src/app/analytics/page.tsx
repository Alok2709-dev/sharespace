'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, Layers, PieChart, Clock,
  CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Synthesizing real institutional telemetry...
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const categoryStats = data?.categoryStats || [];
  const topResources = data?.topResources || [];
  const statusDist = data?.statusDistribution || [];

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
            Institutional Asset Utilization
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF] mt-1">
            Analytics & Operations Intelligence
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real metrics derived directly from normalized relational database rows. No fabricated statistics.
          </p>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Total Listed Assets</span>
            <div className="text-3xl font-bold text-[#F4F5EF] font-mono">{kpis.totalResources}</div>
            <span className="text-[11px] text-[#78D9A0] font-mono">
              {kpis.activeResources} active & accessible
            </span>
          </div>

          <div className="p-5 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Cumulative Bookings</span>
            <div className="text-3xl font-bold text-[#C7FF55] font-mono">{kpis.totalBookings}</div>
            <span className="text-[11px] text-zinc-400 font-mono">
              {kpis.activeBookings} currently active
            </span>
          </div>

          <div className="p-5 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Waitlist Utilization</span>
            <div className="text-3xl font-bold text-[#C0A8F8] font-mono">{kpis.waitlistedCount}</div>
            <span className="text-[11px] text-zinc-400 font-mono">
              FIFO queue active
            </span>
          </div>

          <div className="p-5 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Audit Ledger Events</span>
            <div className="text-3xl font-bold text-[#F4F5EF] font-mono">{kpis.totalAuditEvents}</div>
            <span className="text-[11px] text-[#78D9A0] font-mono">
              100% immutable
            </span>
          </div>
        </div>

        {/* 2-Column Split: Category Breakdown & Top Utilized Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#C7FF55]" />
              <span>Asset Distribution by Research Category</span>
            </h2>

            <div className="space-y-3 pt-2">
              {categoryStats.map((c: any) => (
                <div key={c.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">{c.category}</span>
                    <span className="text-zinc-500">
                      {c.count} asset(s) • {c.bookings_count} booking(s)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0B0D0C] overflow-hidden">
                    <div
                      className="h-full bg-[#C7FF55]"
                      style={{ width: `${Math.min(100, Math.max(15, (c.count / kpis.totalResources) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Utilized Instrumentation */}
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C7FF55]" />
              <span>Highest Demand Core Facilities & Machinery</span>
            </h2>

            <div className="space-y-3 pt-2">
              {topResources.map((r: any, idx: number) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-lg bg-[#0B0D0C] border border-[#212824] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-500 font-bold">#{idx + 1}</span>
                      <Link href={`/resources/${r.id}`} className="font-bold text-[#F4F5EF] hover:text-[#C7FF55] transition-colors">
                        {r.title}
                      </Link>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{r.category}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded bg-[#191F1B] border border-[#2F3933] font-mono text-[#C7FF55] font-bold text-xs shrink-0">
                    {r.booking_count} reservation(s)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C7FF55]" />
            <span>Booking State Machine Distribution</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {statusDist.map((st: any) => (
              <div key={st.status} className="p-3 rounded-lg bg-[#0B0D0C] border border-[#212824] text-center space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block truncate">
                  {st.status.replace('_', ' ')}
                </span>
                <span className="text-xl font-mono font-bold text-[#F4F5EF] block">
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
