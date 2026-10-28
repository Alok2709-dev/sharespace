'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  ShieldCheck, Sparkles, Layers, FileText, Bell, Compass,
  ChevronRight, Award, UserCheck, Heart
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
      <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-3 text-[#7C837C] font-sans text-xs">
        <div className="w-8 h-8 rounded-full border-3 border-[#4169E1] border-t-transparent animate-spin" />
        <span>Loading your campus portfolio...</span>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => ['approved', 'checked_in'].includes(b.status));
  const pendingBookings = bookings.filter(b => b.status === 'pending_approval');
  const waitlistedBookings = bookings.filter(b => b.status === 'waitlisted');
  const pastBookings = bookings.filter(b => ['returned', 'closed', 'rejected', 'cancelled'].includes(b.status));

  return (
    <div className="flex-1 bg-[#F7F5EF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Welcome Banner */}
        <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFEBDD] rounded-full blur-3xl opacity-50 pointer-events-none -mr-10 -mt-10" />

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                alt={user?.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E7E1D3] shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EFF5FF] text-[11px] font-bold text-[#4169E1] border border-[#BDD5FF]">
                <span>Member Hub</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#20231F]">
                Welcome back, {user?.full_name}
              </h1>
              <p className="text-xs text-[#555B53] font-medium">
                {user?.department} • ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <Link
              href="/resources"
              className="px-6 py-3 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all flex items-center gap-2 shadow-color-cobalt active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Gear</span>
            </Link>
            <Link
              href="/profile"
              className="px-5 py-3 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#DCD5C4] text-xs font-bold text-[#20231F] transition-all shadow-xs"
            >
              My Credentials
            </Link>
          </div>
        </div>

        {/* Colorful KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-[#EDFBF3] border border-[#B7ECCB] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1E7E49] uppercase tracking-wider">Active Bookings</span>
              <div className="text-3xl font-editorial font-extrabold text-[#1E7E49]">{activeBookings.length}</div>
              <span className="text-xs text-[#2EBF71] font-semibold block">Approved or Checked In</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-[#FFF8E6] border border-[#FCE2A1] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#9A5B00] uppercase tracking-wider">Pending Review</span>
              <div className="text-3xl font-editorial font-extrabold text-[#9A5B00]">{pendingBookings.length}</div>
              <span className="text-xs text-[#D97706] font-semibold block">Awaiting Custodian</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-[#F4EFFF] border border-[#D9C8FF] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#6941C6] uppercase tracking-wider">Waitlist Slots</span>
              <div className="text-3xl font-editorial font-extrabold text-[#6941C6]">{waitlistedBookings.length}</div>
              <span className="text-xs text-[#8A63D2] font-semibold block">In Fair Queue</span>
            </div>
          </TiltCard>

          <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
            <div className="p-6 rounded-3xl bg-white border border-[#E7E1D3] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#7C837C] uppercase tracking-wider">Completed Sessions</span>
              <div className="text-3xl font-editorial font-extrabold text-[#20231F]">{pastBookings.length}</div>
              <span className="text-xs text-[#555B53] font-medium block">Safely Returned</span>
            </div>
          </TiltCard>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Active Bookings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-5 shadow-warm-md">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-xl font-bold text-[#20231F] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4169E1]" />
                  <span>Current Active Allocations</span>
                </h3>
                <Link href="/my-bookings" className="text-xs text-[#4169E1] font-bold hover:underline">
                  View All ({bookings.length}) &rarr;
                </Link>
              </div>

              {activeBookings.length === 0 ? (
                <div className="p-8 text-center text-[#7C837C] text-xs bg-[#FAF7F2] rounded-2xl border border-[#E7E1D3] space-y-2">
                  <p className="font-semibold text-sm text-[#20231F]">No active reservations right now.</p>
                  <p>Explore the catalog to book cameras, makerspaces, or testing tools!</p>
                  <Link href="/resources" className="text-[#4169E1] font-bold hover:underline inline-block mt-2">
                    Browse campus directory &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#D0C5B0]"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#4169E1] font-bold">{b.booking_reference}</span>
                          <StatusBadge status={b.status} size="sm" />
                        </div>
                        <h4 className="text-base font-bold text-[#20231F]">{b.resource_title}</h4>
                        <div className="text-xs text-[#555B53] font-medium">
                          📅 {b.start_time} &rarr; {b.end_time}
                        </div>
                        <p className="text-xs text-[#7C837C] italic">"{b.purpose}"</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <Link
                          href={`/bookings/${b.id}`}
                          className="px-4 py-2 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#DCD5C4] text-xs font-bold text-[#20231F] transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Inspection Checklist</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#4169E1]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Waiting List Tracking */}
            {waitlistedBookings.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#F4EFFF] border border-[#D9C8FF] space-y-4 shadow-warm-md">
                <h3 className="font-editorial text-xl font-bold text-[#6941C6] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#8A63D2]" />
                  <span>Your Waitlisted Queue Slots ({waitlistedBookings.length})</span>
                </h3>

                <div className="space-y-3">
                  {waitlistedBookings.map(wb => (
                    <div key={wb.id} className="p-4 rounded-2xl bg-white border border-[#D9C8FF] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#20231F]">{wb.resource_title}</span>
                        <span className="px-3 py-1 rounded-full bg-[#F4EFFF] text-[#6941C6] text-xs font-bold border border-[#D9C8FF]">
                          Position #{wb.waitlist_position || 1} in Line
                        </span>
                      </div>
                      <p className="text-xs text-[#555B53] leading-relaxed">
                        {wb.waitlist_explanation || 'You are in line. If the current slot is cancelled, you will be automatically promoted!'}
                      </p>
                      <div className="text-[11px] text-[#7C837C] font-semibold">
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
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-lg font-bold text-[#20231F] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#4169E1]" />
                  <span>Activity Updates</span>
                </h3>
                <Link href="/notifications" className="text-xs text-[#7C837C] hover:text-[#20231F] font-semibold">
                  All
                </Link>
              </div>

              <div className="space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#7C837C] py-3 text-center">No recent alerts.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#4169E1] text-[11px]">{n.title}</span>
                        <span className="text-[10px] text-[#7C837C]">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#555B53] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Fair-Use Rules */}
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-3 shadow-warm-md">
              <span className="text-[11px] uppercase text-[#FF7A45] tracking-wider font-bold">
                Campus Fair-Use Policy
              </span>
              <ul className="text-xs text-[#555B53] space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] font-bold">•</span>
                  <span>Max 3 active reservations concurrent per student.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] font-bold">•</span>
                  <span>12-hour cancellation notice so others can use the slot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] font-bold">•</span>
                  <span>Bilateral check-in checklist required upon receipt.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
