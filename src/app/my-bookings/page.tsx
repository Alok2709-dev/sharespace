'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ArrowRight, XCircle, Search, Compass, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'pending' | 'waitlisted' | 'past'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings?scope=seeker');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking? If this slot was reserved, waiting list candidates will be automatically promoted.')) return;
    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by seeker from My Bookings console.' })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'active') return ['approved', 'checked_in'].includes(b.status);
    if (filterTab === 'pending') return b.status === 'pending_approval';
    if (filterTab === 'waitlisted') return b.status === 'waitlisted';
    if (filterTab === 'past') return ['returned', 'closed', 'rejected', 'cancelled'].includes(b.status);
    return true;
  });

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF5FF] text-xs font-bold text-[#4169E1] border border-[#BDD5FF]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Personal Reservations</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#20231F] mt-2">
              My Resource Bookings
            </h1>
            <p className="text-xs text-[#555B53] mt-1 font-sans">
              Track your reservations from owner approval to physical check-in and return inspection.
            </p>
          </div>

          <Link
            href="/resources"
            className="px-6 py-3 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all self-start sm:self-center shadow-color-cobalt active:scale-95 flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Book New Gear</span>
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-[#E7E1D3] pb-3 overflow-x-auto">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'active', label: `Active (${bookings.filter(b => ['approved', 'checked_in'].includes(b.status)).length})` },
            { id: 'pending', label: `Pending Review (${bookings.filter(b => b.status === 'pending_approval').length})` },
            { id: 'waitlisted', label: `Waiting List (${bookings.filter(b => b.status === 'waitlisted').length})` },
            { id: 'past', label: `Past Sessions (${bookings.filter(b => ['returned', 'closed', 'rejected', 'cancelled'].includes(b.status)).length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                filterTab === tab.id
                  ? 'bg-[#20231F] text-white border-[#20231F] shadow-xs'
                  : 'bg-white hover:bg-[#EFE9DD] text-[#555B53] border-[#E7E1D3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-24 text-center text-[#7C837C] font-sans text-xs flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-3 border-[#4169E1] border-t-transparent animate-spin" />
            <span>Retrieving your bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white border border-[#E7E1D3] rounded-3xl p-8 shadow-warm-md">
            <p className="text-base font-bold text-[#20231F]">No reservations in this view.</p>
            <p className="text-xs text-[#555B53] max-w-sm mx-auto">Explore the marketplace to discover items and request a reservation with campus custodians.</p>
            <Link
              href="/resources"
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4169E1] text-white text-xs font-bold transition-all hover:bg-[#3256c9] shadow-xs"
            >
              <span>Explore Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(b => {
              const canCancel = ['pending_approval', 'approved', 'waitlisted'].includes(b.status);

              return (
                <TiltCard key={b.id} tiltMaxAngle={3} scaleOnHover={1.01}>
                  <div className="p-7 rounded-3xl bg-white border border-[#E7E1D3] hover:border-[#D0C5B0] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-warm-md hover:shadow-warm-xl">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs text-[#4169E1] font-bold">
                          {b.booking_reference}
                        </span>
                        <StatusBadge status={b.status} size="sm" />
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E7E1D3] text-[#7C837C]">
                          {b.resource_category}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-bold text-[#20231F]">
                        {b.resource_title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#555B53]">
                        <span>📅 Start: {b.start_time}</span>
                        <span>⏱️ Return: {b.end_time}</span>
                        <span>📍 {b.resource_location}</span>
                      </div>

                      {b.purpose && (
                        <p className="text-xs text-[#7C837C] italic">
                          "{b.purpose}"
                        </p>
                      )}

                      {/* Waitlist Position Explainer if applicable */}
                      {b.status === 'waitlisted' && (
                        <div className="p-4 rounded-2xl bg-[#F4EFFF] border border-[#D9C8FF] text-xs text-[#6941C6] space-y-1">
                          <div className="font-bold">Waitlist Queue: Position #{b.waitlist_position || 1}</div>
                          <div className="text-[11px] text-[#555B53]">{b.waitlist_explanation}</div>
                        </div>
                      )}

                      {/* Decision reason if approved or rejected */}
                      {b.decision_reason && b.status !== 'waitlisted' && (
                        <div className="text-[11px] text-[#555B53]">
                          <span className="font-bold text-[#20231F]">Custodian Notes:</span> {b.decision_reason}
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#EFE9DD]">
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-4 py-2 rounded-full bg-[#FFF0F0] hover:bg-[#FFE0E0] border border-[#FDC2C2] text-xs font-bold text-[#C92A2A] transition-colors"
                        >
                          {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}

                      <Link
                        href={`/bookings/${b.id}`}
                        className="px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#DCD5C4] text-xs font-bold text-[#20231F] transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Inspection & Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#4169E1]" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
