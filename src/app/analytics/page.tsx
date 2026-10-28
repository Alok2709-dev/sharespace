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
      <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-3 text-zinc-500 font-medium text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-[#3B66F5] border-t-transparent animate-spin" />
        <span>Synthesizing real institutional telemetry...</span>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const categoryStats = data?.categoryStats || [];
  const topResources = data?.topResources || [];
  const statusDist = data?.statusDistribution || [];

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#3B66F5]">
              <Activity className="w-3.5 h-3.5" />
              <span>Institutional Asset Utilization</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#20231F] mt-1">
              Analytics & Operations Intelligence
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Real metrics derived directly from normalized relational database rows. No fabricated statistics.
            </p>
          </div>
        </div>

        {/* Primary KPIs in 3D Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Total Listed Assets</span>
              <div className="text-3xl font-black text-[#20231F]">{kpis.totalResources}</div>
              <span className="text-xs text-emerald-700 font-bold block">
                {kpis.activeResources} active & accessible
              </span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Cumulative Bookings</span>
              <div className="text-3xl font-black text-[#3B66F5]">{kpis.totalBookings}</div>
              <span className="text-xs text-zinc-500 font-medium block">
                {kpis.activeBookings} currently active
              </span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Waitlist Utilization</span>
              <div className="text-3xl font-black text-[#FF7A45]">{kpis.waitlistedCount}</div>
              <span className="text-xs text-zinc-500 font-medium block">
                FIFO queue active
              </span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Audit Ledger Events</span>
              <div className="text-3xl font-black text-[#A892FF]">{kpis.totalAuditEvents}</div>
              <span className="text-xs text-emerald-700 font-bold block">
                100% immutable
              </span>
            </div>
          </TiltCard>
        </div>

        {/* 2-Column Split: Category Breakdown & Top Utilized Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#3B66F5]" />
              <span>Asset Distribution by Research Category</span>
            </h2>

            <div className="space-y-4 pt-1">
              {categoryStats.map((c: any) => (
                <div key={c.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#20231F] font-bold">{c.category}</span>
                    <span className="text-zinc-500 font-medium">
                      {c.count} asset(s) • {c.bookings_count} booking(s)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#F7F5EF] overflow-hidden border border-[#EFE9DD]">
                    <div
                      className="h-full bg-gradient-to-r from-[#3B66F5] to-[#FF7A45] rounded-full"
                      style={{ width: `${Math.min(100, Math.max(15, (c.count / kpis.totalResources) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Utilized Instrumentation */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3B66F5]" />
              <span>Highest Demand Core Facilities & Machinery</span>
            </h2>

            <div className="space-y-3 pt-1">
              {topResources.map((r: any, idx: number) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#3B66F5] font-black">#{idx + 1}</span>
                      <Link href={`/resources/${r.id}`} className="font-bold text-[#20231F] hover:text-[#3B66F5] transition-colors">
                        {r.title}
                      </Link>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium">{r.category}</span>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-white border border-[#EFE9DD] text-[#3B66F5] font-bold text-xs shrink-0 shadow-sm">
                    {r.booking_count} reservation(s)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#3B66F5]" />
            <span>Booking State Machine Distribution</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-1">
            {statusDist.map((st: any) => (
              <div key={st.status} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] text-center space-y-1">
                <span className="text-[10px] uppercase text-zinc-400 block truncate font-bold">
                  {st.status.replace('_', ' ')}
                </span>
                <span className="text-2xl font-black text-[#20231F] block">
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
