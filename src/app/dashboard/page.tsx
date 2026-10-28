'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  ShieldCheck, Sparkles, Layers, FileText, Bell, Compass
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

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
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Loading personal research portfolio...
      </div>
    );
  }

  const activeBookings = bookings.filter(b => ['approved', 'checked_in'].includes(b.status));
  const pendingBookings = bookings.filter(b => b.status === 'pending_approval');
  const waitlistedBookings = bookings.filter(b => b.status === 'waitlisted');
  const pastBookings = bookings.filter(b => ['returned', 'closed', 'rejected', 'cancelled'].includes(b.status));

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Welcome Banner */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={user?.full_name}
              className="w-14 h-14 rounded-full object-cover border border-[#2F3933]"
            />
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider">
                Research Portfolio Node
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F4F5EF]">
                Welcome back, {user?.full_name}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">
                {user?.department} • Institutional ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/resources"
              className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Book Equipment</span>
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] transition-colors"
            >
              My Credentials
            </Link>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Active Allocations</span>
            <div className="text-2xl font-bold text-[#78D9A0] font-mono">{activeBookings.length}</div>
            <span className="text-[11px] text-zinc-400">Approved or Checked In</span>
          </div>

          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Pending Review</span>
            <div className="text-2xl font-bold text-[#F0BE67] font-mono">{pendingBookings.length}</div>
            <span className="text-[11px] text-zinc-400">Awaiting Custodian</span>
          </div>

          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Waitlisted Slots</span>
            <div className="text-2xl font-bold text-[#C0A8F8] font-mono">{waitlistedBookings.length}</div>
            <span className="text-[11px] text-zinc-400">FIFO Queue Tracking</span>
          </div>

          <div className="p-4 rounded-xl bg-[#131715] border border-[#212824] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Completed Sessions</span>
            <div className="text-2xl font-bold text-[#F4F5EF] font-mono">{pastBookings.length}</div>
            <span className="text-[11px] text-zinc-400">Audited in Ledger</span>
          </div>
        </div>

        {/* Main Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Active Bookings & Waitlist */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active / Checked-In Section */}
            <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C7FF55]" />
                  <span>Current Active Allocations</span>
                </h3>
                <Link href="/my-bookings" className="text-xs text-[#C7FF55] hover:underline font-mono">
                  View All &rarr;
                </Link>
              </div>

              {activeBookings.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs bg-[#0B0D0C] rounded-lg border border-[#212824]">
                  You have no active equipment checked out or upcoming approved reservations today.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
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
                          className="px-3 py-1.5 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] transition-colors"
                        >
                          Handover & Details &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Waiting List Activity */}
            {waitlistedBookings.length > 0 && (
              <div className="p-6 rounded-xl bg-[#131715] border border-[#42385C] space-y-4">
                <h3 className="text-sm font-bold text-[#C0A8F8] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Transparent Waiting List Tracking ({waitlistedBookings.length})</span>
                </h3>

                <div className="space-y-3">
                  {waitlistedBookings.map(wb => (
                    <div key={wb.id} className="p-4 rounded-lg bg-[#0B0D0C] border border-[#29233B] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F5EF]">{wb.resource_title}</span>
                        <span className="px-2 py-0.5 rounded bg-[#42385C]/40 text-[#C0A8F8] font-mono text-xs font-bold border border-[#42385C]">
                          Position #{wb.waitlist_position || 1} in Queue
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
          <div className="space-y-6">
            {/* Recent Notifications */}
            <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
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
                    <div key={n.id} className="p-3 rounded-lg bg-[#0B0D0C] border border-[#212824] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#C7FF55] font-mono text-[11px]">{n.title}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Fair-Use Rules Info */}
            <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider font-semibold">
                Fair-Use Institutional Limits
              </span>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#C7FF55]">•</span>
                  <span>Max 3 active reservations concurrent per researcher.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C7FF55]">•</span>
                  <span>12-hour lead time for penalty-free cancellation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C7FF55]">•</span>
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
