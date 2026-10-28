'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers, Clock, AlertTriangle, CheckCircle2, ArrowRight,
  PlusCircle, FileCheck, Shield, ChevronRight, BarChart3
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

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
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Loading custodian management node...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Custodian Header */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider">
              Resource Custodian Operations Hub
            </span>
            <h1 className="text-2xl font-bold text-[#F4F5EF]">
              {currentUser?.full_name}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              {currentUser?.department} • Custodian Access Node
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/owner/resources/new"
              className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List New Resource</span>
            </Link>
            <Link
              href="/owner/requests"
              className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] transition-colors"
            >
              Review Requests ({requests.length})
            </Link>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Managed Resources</span>
            <div className="text-2xl font-bold text-[#C7FF55] font-mono">{resources.length}</div>
            <span className="text-[11px] text-zinc-400">Institutional Listings</span>
          </div>

          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Pending Requests</span>
            <div className="text-2xl font-bold text-[#F0BE67] font-mono">{requests.length}</div>
            <span className="text-[11px] text-zinc-400">Requires Decision</span>
          </div>

          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Active Allocations</span>
            <div className="text-2xl font-bold text-[#78D9A0] font-mono">{handovers.length}</div>
            <span className="text-[11px] text-zinc-400">In Handover Lifecycle</span>
          </div>

          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Handover Protocol</span>
            <div className="text-2xl font-bold text-[#F4F5EF] font-mono">100%</div>
            <span className="text-[11px] text-zinc-400">Two-party Verified</span>
          </div>
        </div>

        {/* 2-Column Split: Managed Resources vs Urgent Review */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Managed Resources (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C7FF55]" />
                <span>Managed Instrumentation & Spaces ({resources.length})</span>
              </h3>
              <Link href="/owner/resources/new" className="text-xs text-[#C7FF55] hover:underline font-mono">
                + Add Listing
              </Link>
            </div>

            <div className="space-y-3">
              {resources.map(res => (
                <div
                  key={res.id}
                  className="p-4 rounded-lg bg-[#131715] border border-[#212824] hover:border-[#2F3933] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={res.status} size="sm" />
                      <span className="text-[10px] font-mono uppercase text-zinc-500">{res.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#F4F5EF]">{res.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                      <span>📍 {res.location}</span>
                      <span>⏱️ {res.lead_time_hours}h lead</span>
                      {res.deposit_amount > 0 && <span>Deposit: ${res.deposit_amount}</span>}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      href={`/resources/${res.id}`}
                      className="px-3 py-1.5 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-zinc-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/owner/resources/${res.id}/edit`}
                      className="px-3 py-1.5 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#C7FF55]"
                    >
                      Configure
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Requests & Quick Handovers (1 col) */}
          <div className="space-y-6">
            {/* Urgent Requests */}
            <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
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
                    <div key={req.id} className="p-3 bg-[#0B0D0C] rounded-lg border border-[#212824] space-y-1.5 text-xs font-mono">
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
            <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-3">
              <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#C7FF55]" />
                <span>Physical Handover Hub</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Record check-in inspection notes, accessory inventory, or process return sign-offs.
              </p>
              <Link
                href="/owner/handovers"
                className="w-full py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#C7FF55] block text-center"
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
