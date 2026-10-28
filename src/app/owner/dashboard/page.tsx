'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers, Clock, AlertTriangle, CheckCircle2, ArrowRight,
  PlusCircle, FileCheck, Shield, ChevronRight, BarChart3,
  Cpu, Wrench
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [handovers, setHandovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      if (!['owner', 'institution_manager', 'admin'].includes(sess.user.role)) {
        router.push('/access-denied');
        return;
      }
      setCurrentUser(sess.user);

      const [rRes, bRes] = await Promise.all([
        fetch('/api/resources'),
        fetch('/api/bookings?scope=owner')
      ]);

      const rData = await rRes.json();
      const bData = await bRes.json();

      const myResources = rData.resources.filter((r: any) =>
        sess.user.role === 'owner' ? r.owner_id === sess.user.id : true
      );

      const allBookings = bData.bookings || [];
      const pendingReqs = allBookings.filter((b: any) => b.status === 'pending_approval');
      const activeHandovers = allBookings.filter((b: any) => ['approved', 'checked_in'].includes(b.status));

      setResources(myResources);
      setRequests(pendingReqs);
      setHandovers(activeHandovers);
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
        <span>Loading custodian operations node...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#080908] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Custodian Header */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-[#111613] via-[#0E1310] to-[#0A0D0B] border border-[#202C23] relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7FF55]/6 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18211A] border border-[#28372D] text-xs font-mono text-[#C7FF55]">
              <Wrench className="w-3.5 h-3.5" />
              <span>Custodian Operations Hub</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F4F5EF] mt-1">
              {currentUser?.full_name}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              {currentUser?.department} • Custodian Access Node
            </p>
          </div>

          <div className="relative flex items-center gap-3">
            <Link
              href="/owner/resources/new"
              className="px-5 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Resource</span>
            </Link>
            <Link
              href="/owner/requests"
              className="px-4 py-3 rounded-xl bg-[#141A16] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-[#F4F5EF] transition-all"
            >
              Review Requests ({requests.length})
            </Link>
          </div>
        </div>

        {/* Operational Metrics in 3D Bento Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Managed Resources</span>
              <div className="text-3xl font-extrabold text-[#C7FF55] font-mono">{resources.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">Institutional Listings</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Pending Requests</span>
              <div className="text-3xl font-extrabold text-[#F0BE67] font-mono">{requests.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">Requires Reasoned Decision</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Active Allocations</span>
              <div className="text-3xl font-extrabold text-[#78D9A0] font-mono">{handovers.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">In Handover Lifecycle</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Handover Protocol</span>
              <div className="text-3xl font-extrabold text-[#38BDF8] font-mono">100%</div>
              <span className="text-[11px] text-zinc-400 block font-sans">Two-Party Verified</span>
            </div>
          </TiltCard>
        </div>

        {/* 2-Column Split: Managed Resources vs Urgent Review */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Managed Resources (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C7FF55]" />
                <span>Managed Instrumentation & Spaces ({resources.length})</span>
              </h3>
              <Link href="/owner/resources/new" className="text-xs text-[#C7FF55] hover:underline font-mono">
                + Add Listing
              </Link>
            </div>

            <div className="space-y-3">
              {resources.map(res => (
                <TiltCard key={res.id} tiltMaxAngle={3} scaleOnHover={1.01}>
                  <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] hover:border-[#2C3B2E] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={res.status} size="sm" />
                        <span className="text-[10px] font-mono uppercase text-zinc-500">{res.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#F4F5EF]">{res.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span>📍 {res.location}</span>
                        <span>⏱️ {res.lead_time_hours}h lead</span>
                        {res.deposit_amount > 0 && <span>Deposit: ${res.deposit_amount}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        href={`/resources/${res.id}`}
                        className="px-3.5 py-2 rounded-xl bg-[#151D18] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-zinc-300 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/owner/resources/${res.id}/edit`}
                        className="px-3.5 py-2 rounded-xl bg-[#151D18] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-[#C7FF55] transition-colors"
                      >
                        Configure
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Pending Requests & Quick Handovers (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Urgent Requests */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F0BE67]" />
                  <span>Pending Requests</span>
                </h3>
                <Link href="/owner/requests" className="text-xs text-[#C7FF55] hover:underline font-mono">
                  Review All ({requests.length})
                </Link>
              </div>

              {requests.length === 0 ? (
                <p className="text-xs text-zinc-500 py-3 text-center">No pending booking requests.</p>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 3).map(req => (
                    <div key={req.id} className="p-3.5 bg-[#090C0A] rounded-xl border border-[#1E2721] space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[#C7FF55] font-bold">{req.booking_reference}</span>
                        <span className="text-zinc-500">{req.seeker_name}</span>
                      </div>
                      <div className="text-zinc-300 truncate">{req.resource_title}</div>
                      <div className="text-[11px] text-zinc-400">📅 {req.start_time}</div>
                      <Link
                        href="/owner/requests"
                        className="text-[11px] text-[#C7FF55] underline hover:opacity-80 block pt-1"
                      >
                        Approve / Reject &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Handovers Trigger */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-3 shadow-xl">
              <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#C7FF55]" />
                <span>Physical Handover Hub</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Record check-in inspection notes, accessory inventory, or process return sign-offs.
              </p>
              <Link
                href="/owner/handovers"
                className="w-full py-3 rounded-xl bg-[#151D18] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-[#C7FF55] block text-center transition-colors"
              >
                Open Handover Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
