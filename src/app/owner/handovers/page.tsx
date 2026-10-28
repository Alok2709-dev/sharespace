'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck, Clock, CheckCircle2, AlertTriangle, ArrowLeft,
  Shield, Check, User, ArrowRight
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

export default function OwnerHandoversPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHandovers();
  }, []);

  async function fetchHandovers() {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings?scope=owner');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.status === 403) {
        router.push('/access-denied');
        return;
      }
      const data = await res.json();
      const relevant = (data.bookings || []).filter((b: any) =>
        ['approved', 'checked_in', 'return_pending_inspection', 'overdue'].includes(b.status)
      );
      setBookings(relevant);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const readyForCheckIn = bookings.filter(b => b.status === 'approved');
  const checkedOut = bookings.filter(b => ['checked_in', 'overdue'].includes(b.status));
  const pendingInspection = bookings.filter(b => b.status === 'return_pending_inspection');

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
              <Link href="/owner/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Owner Hub</span>
              </Link>
              <span>/</span>
              <span>Physical Handovers</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5EF]">
              Check-in & Return Management
            </h1>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            {bookings.length} active allocation(s) requiring physical oversight
          </span>
        </div>

        {/* 3 Categories: Ready for Checkin, Active / In-Use, Return Inspection */}
        <div className="space-y-8">
          {/* 1. Ready for Check-In */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#78D9A0]" />
                <span>Ready for Physical Check-in Handover ({readyForCheckIn.length})</span>
              </h2>
              <span className="text-xs font-mono text-zinc-500">Approved Reservations</span>
            </div>

            {readyForCheckIn.length === 0 ? (
              <p className="p-4 rounded-lg bg-[#131715] border border-[#212824] text-xs text-zinc-500">
                No approved bookings currently awaiting initial handover.
              </p>
            ) : (
              <div className="space-y-3">
                {readyForCheckIn.map(b => (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-[#131715] border border-[#212824] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#C7FF55] font-bold">{b.booking_reference}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-[#F4F5EF]">{b.resource_title}</h3>
                      <div className="text-xs text-zinc-400 font-mono">
                        👤 Seeker: {b.seeker_name} ({b.seeker_department}) • Scheduled: {b.start_time}
                      </div>
                    </div>

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors shrink-0"
                    >
                      Complete Handover Sign-Off &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Checked Out / In Use */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C7FF55]" />
                <span>Currently In Use / Checked Out ({checkedOut.length})</span>
              </h2>
              <span className="text-xs font-mono text-zinc-500">Active Possession</span>
            </div>

            {checkedOut.length === 0 ? (
              <p className="p-4 rounded-lg bg-[#131715] border border-[#212824] text-xs text-zinc-500">
                No equipment currently checked out.
              </p>
            ) : (
              <div className="space-y-3">
                {checkedOut.map(b => (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-[#131715] border border-[#212824] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#C7FF55] font-bold">{b.booking_reference}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-[#F4F5EF]">{b.resource_title}</h3>
                      <div className="text-xs text-zinc-400 font-mono">
                        👤 Seeker: {b.seeker_name} • Return Deadline: {b.end_time}
                      </div>
                    </div>

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] transition-colors shrink-0"
                    >
                      Inspect Return & Sign-Off &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Return Pending Inspection */}
          {pendingInspection.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#F0BE67] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Return Pending Inspection Review ({pendingInspection.length})</span>
              </h2>

              <div className="space-y-3">
                {pendingInspection.map(b => (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-[#292212]/40 border border-[#4E3E1C] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#F0BE67] font-bold">{b.booking_reference}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-[#F4F5EF]">{b.resource_title}</h3>
                      <p className="text-xs text-zinc-400 font-mono">
                        Flagged condition anomaly under review by {b.owner_name}
                      </p>
                    </div>

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#4E3E1C] text-xs font-mono text-[#F0BE67] transition-colors shrink-0"
                    >
                      Review Anomaly & Close &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
