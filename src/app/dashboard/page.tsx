'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  ShieldCheck, Sparkles, Layers, FileText, Bell, Compass,
  ChevronRight, Award, UserCheck
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
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
      setUser(sess.user);

      const [bRes, nRes] = await Promise.all([
        fetch('/api/bookings?scope=seeker'),
        fetch('/api/notifications')
      ]);

      const bData = await bRes.json();
      const nData = await nRes.json();

      setBookings(bData.bookings || []);
      setNotifications(nData.notifications?.slice(0, 5) || []);
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
        <span>Loading personal research portfolio...</span>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => ['approved', 'checked_in'].includes(b.status));
  const pendingBookings = bookings.filter(b => b.status === 'pending_approval');
  const waitlistedBookings = bookings.filter(b => b.status === 'waitlisted');
  const pastBookings = bookings.filter(b => ['returned', 'closed', 'rejected', 'cancelled'].includes(b.status));

  return (
    <div className="flex-1 bg-[#080908] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Welcome Banner with Architectural Frame */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-[#111713] via-[#0E1310] to-[#0A0D0B] border border-[#202C23] relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7FF55]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                alt={user?.full_name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#29382D] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#C7FF55] border-2 border-[#0B0D0C] flex items-center justify-center" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#18211A] border border-[#27352B] text-[10px] font-mono uppercase text-[#C7FF55] font-semibold">
                <span>Researcher Node</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F4F5EF]">
                Welcome back, {user?.full_name}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">
                {user?.department} • Node ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <Link
              href="/resources"
              className="px-5 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Book Equipment</span>
            </Link>
            <Link
              href="/profile"
              className="px-4 py-3 rounded-xl bg-[#141A16] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-[#F4F5EF] transition-all"
            >
              Credentials
            </Link>
          </div>
        </div>

        {/* KPI Counter Cards in Bento Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Active Allocations</span>
              <div className="text-3xl font-extrabold text-[#78D9A0] font-mono">{activeBookings.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">Approved or Checked In</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Pending Review</span>
              <div className="text-3xl font-extrabold text-[#F0BE67] font-mono">{pendingBookings.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">Awaiting Custodian</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Waitlisted Slots</span>
              <div className="text-3xl font-extrabold text-[#38BDF8] font-mono">{waitlistedBookings.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">FIFO Queue Position</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-5 rounded-2xl bg-[#111613] border border-[#202B23] space-y-1.5 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Completed Sessions</span>
              <div className="text-3xl font-extrabold text-[#F4F5EF] font-mono">{pastBookings.length}</div>
              <span className="text-[11px] text-zinc-400 block font-sans">Audited in Ledger</span>
            </div>
          </TiltCard>
        </div>

        {/* Main Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Active Bookings & Waitlist */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active / Checked-In Section */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C7FF55]" />
                  <span>Current Active Allocations</span>
                </h3>
                <Link href="/my-bookings" className="text-xs text-[#C7FF55] hover:underline font-mono">
                  View All ({bookings.length}) &rarr;
                </Link>
              </div>

              {activeBookings.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs bg-[#090C0A] rounded-2xl border border-[#1C251F] space-y-2">
                  <p>You have no active equipment checked out or upcoming approved reservations today.</p>
                  <Link href="/resources" className="text-[#C7FF55] hover:underline inline-block font-mono text-[11px]">
                    Browse catalog to request a slot &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-[#0B0F0D] border border-[#1E2721] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#2A372E]"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#C7FF55] font-semibold">{b.booking_reference}</span>
                          <StatusBadge status={b.status} size="sm" />
                        </div>
                        <h4 className="text-sm font-bold text-[#F4F5EF]">{b.resource_title}</h4>
                        <div className="text-xs text-zinc-400 font-mono">
                          📅 {b.start_time} &rarr; {b.end_time}
                        </div>
                        <p className="text-xs text-zinc-400 italic">"{b.purpose}"</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <Link
                          href={`/bookings/${b.id}`}
                          className="px-4 py-2 rounded-xl bg-[#151D18] hover:bg-[#1E2621] border border-[#27352B] text-xs font-mono text-[#F4F5EF] transition-colors flex items-center gap-1.5"
                        >
                          <span>Inspection Checklist</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#C7FF55]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Waiting List Activity */}
            {waitlistedBookings.length > 0 && (
              <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-[#38BDF8] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Transparent Waiting List Tracking ({waitlistedBookings.length})</span>
                </h3>

                <div className="space-y-3">
                  {waitlistedBookings.map(wb => (
                    <div key={wb.id} className="p-4 rounded-2xl bg-[#0B0F0D] border border-[#1E2721] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F5EF]">{wb.resource_title}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] font-mono text-xs font-bold border border-[#38BDF8]/30">
                          Position #{wb.waitlist_position || 1} in FIFO Queue
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                        {wb.waitlist_explanation || 'In FIFO queue. You will be automatically promoted if the slot opens.'}
                      </p>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        Requested: {wb.start_time} - {wb.end_time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Notifications & Quick Access */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent Notifications */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C7FF55]" />
                  <span>Activity Stream</span>
                </h3>
                <Link href="/notifications" className="text-xs text-zinc-500 hover:text-white font-mono">
                  All
                </Link>
              </div>

              <div className="space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3 text-center">No recent alerts.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-[#0B0F0D] border border-[#1E2721] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#C7FF55] font-mono text-[11px]">{n.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Fair-Use Rules Info */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-3 shadow-xl">
              <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider font-semibold">
                Fair-Use Institutional Limits
              </span>
              <ul className="text-xs text-zinc-400 space-y-2.5 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#C7FF55] font-bold">•</span>
                  <span>Max 3 active reservations concurrent per researcher.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C7FF55] font-bold">•</span>
                  <span>12-hour lead time for penalty-free cancellation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C7FF55] font-bold">•</span>
                  <span>Mandatory check-in and checkout condition confirmation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
