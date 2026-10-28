'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, Layers, PieChart, Clock,
  CheckCircle2, AlertTriangle, ShieldCheck, Activity
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

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
      <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-3 text-zinc-500 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-[#C7FF55] border-t-transparent animate-spin" />
        <span>Synthesizing real institutional telemetry...</span>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const categoryStats = data?.categoryStats || [];
  const topResources = data?.topResources || [];
  const statusDist = data?.statusDistribution || [];

  return (
    <div className="flex-1 bg-[#080908] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-[#111613] via-[#0E1310] to-[#0A0D0B] border border-[#202C23] relative overflow-hidden shadow-xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18211A] border border-[#28372D] text-xs font-mono text-[#C7FF55]">
              <Activity className="w-3.5 h-3.5" />
              <span>Institutional Asset Utilization</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF] mt-1">
              Analytics & Operations Intelligence
            </h1>
            <p className="text-xs text-zinc-400 font-sans">
              Real metrics derived directly from normalized relational database rows. No fabricated statistics.
            </p>
          </div>
        </div>

        {/* Primary KPIs in 3D Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Total Listed Assets</span>
              <div className="text-3xl font-extrabold text-[#F4F5EF] font-mono">{kpis.totalResources}</div>
              <span className="text-[11px] text-[#78D9A0] font-mono block">
                {kpis.activeResources} active & accessible
              </span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Cumulative Bookings</span>
              <div className="text-3xl font-extrabold text-[#C7FF55] font-mono">{kpis.totalBookings}</div>
              <span className="text-[11px] text-zinc-400 font-mono block">
                {kpis.activeBookings} currently active
              </span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Waitlist Utilization</span>
              <div className="text-3xl font-extrabold text-[#38BDF8] font-mono">{kpis.waitlistedCount}</div>
              <span className="text-[11px] text-zinc-400 font-mono block">
                FIFO queue active
              </span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Audit Ledger Events</span>
              <div className="text-3xl font-extrabold text-[#F4F5EF] font-mono">{kpis.totalAuditEvents}</div>
              <span className="text-[11px] text-[#78D9A0] font-mono block">
                100% immutable
              </span>
            </div>
          </TiltCard>
        </div>

        {/* 2-Column Split: Category Breakdown & Top Utilized Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#C7FF55]" />
              <span>Asset Distribution by Research Category</span>
            </h2>

            <div className="space-y-4 pt-1">
              {categoryStats.map((c: any) => (
                <div key={c.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300 font-semibold">{c.category}</span>
                    <span className="text-zinc-500">
                      {c.count} asset(s) • {c.bookings_count} booking(s)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#090C0A] overflow-hidden border border-[#1E2721]">
                    <div
                      className="h-full bg-gradient-to-r from-[#88C526] to-[#C7FF55] rounded-full"
                      style={{ width: `${Math.min(100, Math.max(15, (c.count / kpis.totalResources) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Utilized Instrumentation */}
          <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C7FF55]" />
              <span>Highest Demand Core Facilities & Machinery</span>
            </h2>

            <div className="space-y-3 pt-1">
              {topResources.map((r: any, idx: number) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#090C0A] border border-[#1E2721] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#C7FF55] font-bold">#{idx + 1}</span>
                      <Link href={`/resources/${r.id}`} className="font-bold text-[#F4F5EF] hover:text-[#C7FF55] transition-colors">
                        {r.title}
                      </Link>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{r.category}</span>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-[#151D18] border border-[#27352B] font-mono text-[#C7FF55] font-bold text-xs shrink-0">
                    {r.booking_count} reservation(s)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
          <h2 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C7FF55]" />
            <span>Booking State Machine Distribution</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-1">
            {statusDist.map((st: any) => (
              <div key={st.status} className="p-4 rounded-2xl bg-[#090C0A] border border-[#1E2721] text-center space-y-1 shadow-sm">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block truncate font-medium">
                  {st.status.replace('_', ' ')}
                </span>
                <span className="text-2xl font-mono font-bold text-[#F4F5EF] block">
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
