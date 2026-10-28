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
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-1">
              <Link href="/owner/dashboard" className="hover:text-[#20231F] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Owner Hub</span>
              </Link>
              <span>/</span>
              <span>Physical Handovers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#20231F]">
              Check-in & Return Management
            </h1>
          </div>

          <span className="text-xs font-bold text-zinc-500 bg-white px-3 py-1.5 rounded-full border border-[#EFE9DD] shadow-sm">
            {bookings.length} active allocation(s)
          </span>
        </div>

        {/* 3 Categories: Ready for Checkin, Active / In-Use, Return Inspection */}
        <div className="space-y-8">
          {/* 1. Ready for Check-In */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Ready for Physical Check-in Handover ({readyForCheckIn.length})</span>
              </h2>
              <span className="text-xs text-zinc-500 font-medium">Approved Reservations</span>
            </div>

            {readyForCheckIn.length === 0 ? (
              <p className="p-6 rounded-2xl bg-white border border-[#EFE9DD] text-xs text-zinc-400 font-medium shadow-warm-md">
                No approved bookings currently awaiting initial handover.
              </p>
            ) : (
              <div className="space-y-3">
                {readyForCheckIn.map(b => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#3B66F5] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{b.booking_reference}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-[#20231F]">{b.resource_title}</h3>
                      <div className="text-xs text-zinc-500">
                        👤 Seeker: {b.seeker_name} ({b.seeker_department}) • Scheduled: {b.start_time}
                      </div>
                    </div>

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-5 py-2.5 rounded-xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all shrink-0"
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
              <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B66F5]" />
                <span>Currently In Use / Checked Out ({checkedOut.length})</span>
              </h2>
              <span className="text-xs text-zinc-500 font-medium">Active Possession</span>
            </div>

            {checkedOut.length === 0 ? (
              <p className="p-6 rounded-2xl bg-white border border-[#EFE9DD] text-xs text-zinc-400 font-medium shadow-warm-md">
                No equipment currently checked out.
              </p>
            ) : (
              <div className="space-y-3">
                {checkedOut.map(b => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#3B66F5] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{b.booking_reference}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-[#20231F]">{b.resource_title}</h3>
                      <div className="text-xs text-zinc-500">
                        👤 Seeker: {b.seeker_name} • Return Deadline: {b.end_time}
                      </div>
                    </div>

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-5 py-2.5 rounded-xl bg-[#2EBF71] text-white font-bold text-xs hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all shrink-0"
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
              <h2 className="text-base font-bold text-[#FF7A45] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF7A45]" />
                <span>Return Pending Inspection Review ({pendingInspection.length})</span>
              </h2>

              <div className="space-y-3">
                {pendingInspection.map(b => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-orange-50/60 border border-orange-200 shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#FF7A45]">{b.booking_reference}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-[#20231F]">{b.resource_title}</h3>
                      <p className="text-xs text-zinc-500">
                        Flagged condition anomaly under review by {b.owner_name}
                      </p>
                    </div>

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-5 py-2.5 rounded-xl bg-[#20231F] text-white font-bold text-xs hover:bg-[#3B66F5] transition-all shrink-0 shadow-sm"
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
