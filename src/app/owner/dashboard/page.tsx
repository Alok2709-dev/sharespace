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
      <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-3 text-zinc-500 font-medium text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-[#3B66F5] border-t-transparent animate-spin" />
        <span>Loading custodian operations node...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Custodian Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#3B66F5]">
              <Wrench className="w-3.5 h-3.5" />
              <span>Custodian Operations Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#20231F] tracking-tight">
              {currentUser?.full_name}
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              {currentUser?.department} • Custodian Access Node
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/owner/resources/new"
              className="px-5 py-3 rounded-2xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Resource</span>
            </Link>
            <Link
              href="/owner/requests"
              className="px-4 py-3 rounded-2xl bg-[#F7F5EF] hover:bg-[#EFE9DD] border border-[#EFE9DD] text-xs font-bold text-[#20231F] transition-all"
            >
              Review Requests ({requests.length})
            </Link>
          </div>
        </div>

        {/* Operational Metrics in 3D Bento Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Managed Resources</span>
              <div className="text-3xl font-black text-[#3B66F5]">{resources.length}</div>
              <span className="text-xs text-zinc-500 block font-medium">Institutional Listings</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Pending Requests</span>
              <div className="text-3xl font-black text-[#FF7A45]">{requests.length}</div>
              <span className="text-xs text-zinc-500 block font-medium">Requires Reasoned Decision</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Active Allocations</span>
              <div className="text-3xl font-black text-emerald-600">{handovers.length}</div>
              <span className="text-xs text-zinc-500 block font-medium">In Handover Lifecycle</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-1.5">
              <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Handover Protocol</span>
              <div className="text-3xl font-black text-[#A892FF]">100%</div>
              <span className="text-xs text-zinc-500 block font-medium">Two-Party Verified</span>
            </div>
          </TiltCard>
        </div>

        {/* 2-Column Split: Managed Resources vs Urgent Review */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Managed Resources (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#3B66F5]" />
                <span>Managed Instrumentation & Spaces ({resources.length})</span>
              </h3>
              <Link href="/owner/resources/new" className="text-xs text-[#3B66F5] hover:underline font-bold">
                + Add Listing
              </Link>
            </div>

            <div className="space-y-3">
              {resources.map(res => (
                <TiltCard key={res.id} tiltMaxAngle={3} scaleOnHover={1.01}>
                  <div className="p-5 rounded-2xl bg-white border border-[#EFE9DD] hover:border-[#3B66F5]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-md">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={res.status} size="sm" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{res.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#20231F]">{res.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>📍 {res.location}</span>
                        <span>⏱️ {res.lead_time_hours}h lead</span>
                        {res.deposit_amount > 0 && <span>Deposit: ${res.deposit_amount}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        href={`/resources/${res.id}`}
                        className="px-3.5 py-2 rounded-xl bg-[#F7F5EF] hover:bg-[#EFE9DD] border border-[#EFE9DD] text-xs font-bold text-zinc-700 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/owner/resources/${res.id}/edit`}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#3B66F5] transition-colors"
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
            <div className="p-7 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFE9DD]">
                <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF7A45]" />
                  <span>Pending Requests</span>
                </h3>
                <Link href="/owner/requests" className="text-xs text-[#3B66F5] hover:underline font-bold">
                  Review All ({requests.length})
                </Link>
              </div>

              {requests.length === 0 ? (
                <p className="text-xs text-zinc-400 py-3 text-center font-medium">No pending booking requests.</p>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 3).map(req => (
                    <div key={req.id} className="p-4 bg-[#F7F5EF] rounded-2xl border border-[#EFE9DD] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#3B66F5] font-black">{req.booking_reference}</span>
                        <span className="text-zinc-500 font-semibold">{req.seeker_name}</span>
                      </div>
                      <div className="text-[#20231F] font-bold truncate">{req.resource_title}</div>
                      <div className="text-[11px] text-zinc-500">📅 {req.start_time}</div>
                      <Link
                        href="/owner/requests"
                        className="text-xs text-[#3B66F5] font-bold hover:underline block pt-1"
                      >
                        Approve / Reject &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Handovers Trigger */}
            <div className="p-7 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-3">
              <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#3B66F5]" />
                <span>Physical Handover Hub</span>
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Record check-in inspection notes, accessory inventory, or process return sign-offs.
              </p>
              <Link
                href="/owner/handovers"
                className="w-full py-3 rounded-2xl bg-[#F7F5EF] hover:bg-[#3B66F5] hover:text-white border border-[#EFE9DD] text-xs font-bold text-[#20231F] block text-center transition-all shadow-sm"
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
