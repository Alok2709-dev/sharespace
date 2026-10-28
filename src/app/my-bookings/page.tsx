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
    <div className="flex-1 bg-[#080908] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-[#111613] via-[#0E1310] to-[#0A0D0B] border border-[#202C23] relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18211A] border border-[#28372D] text-xs font-mono text-[#C7FF55]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Personal Allocation Ledger</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#F4F5EF] mt-2">
              My Research Bookings
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Track the full lifecycle of your reserved instruments, from custodian review to physical return inspection.
            </p>
          </div>

          <Link
            href="/resources"
            className="px-5 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all self-start sm:self-center shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95 flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Book Equipment</span>
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-[#1E2621] pb-3 overflow-x-auto">
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
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
                filterTab === tab.id
                  ? 'bg-[#18221B] text-[#C7FF55] border-[#C7FF55]/40 font-bold shadow-sm'
                  : 'bg-[#101412] hover:bg-[#161D18] text-zinc-400 border-[#1C251F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#C7FF55] border-t-transparent animate-spin" />
            <span>Retrieving reservation records...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-[#111613] border border-[#202C23] rounded-3xl p-8 shadow-xl">
            <p className="text-sm font-semibold text-zinc-300">No reservations found in this category.</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">Explore the marketplace to discover instruments and book slots with institutional custodians.</p>
            <Link
              href="/resources"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7FF55] text-[#080908] text-xs font-bold transition-all hover:bg-[#b5f23d]"
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
                  <div className="p-6 rounded-2xl bg-[#111613] border border-[#202C23] hover:border-[#2D3C31] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-[#C7FF55] font-bold tracking-tight">
                          {b.booking_reference}
                        </span>
                        <StatusBadge status={b.status} size="sm" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-0.5 rounded bg-[#18211A] border border-[#232F26]">
                          {b.resource_category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#F4F5EF]">
                        {b.resource_title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                        <span>📅 Start: {b.start_time}</span>
                        <span>⏱️ Return: {b.end_time}</span>
                        <span>📍 {b.resource_location}</span>
                      </div>

                      {b.purpose && (
                        <p className="text-xs text-zinc-400 italic">
                          "{b.purpose}"
                        </p>
                      )}

                      {/* Waitlist Position Explainer if applicable */}
                      {b.status === 'waitlisted' && (
                        <div className="p-3.5 rounded-xl bg-[#1D1B28] border border-[#3E3456] text-xs font-mono text-[#38BDF8] space-y-1">
                          <div className="font-bold">Waitlist Queue: Position #{b.waitlist_position || 1}</div>
                          <div className="text-[11px] text-zinc-300">{b.waitlist_explanation}</div>
                        </div>
                      )}

                      {/* Decision reason if approved or rejected */}
                      {b.decision_reason && b.status !== 'waitlisted' && (
                        <div className="text-[11px] text-zinc-400 font-mono">
                          <span className="text-zinc-500">Decision Notes:</span> {b.decision_reason}
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#1C251F]">
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-3.5 py-2 rounded-xl bg-[#2E1413] hover:bg-[#3d1a19] border border-[#592624] text-xs font-mono text-[#F17D78] transition-colors"
                        >
                          {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}

                      <Link
                        href={`/bookings/${b.id}`}
                        className="px-4 py-2.5 rounded-xl bg-[#161E19] hover:bg-[#202B24] border border-[#27352B] text-xs font-mono text-[#F4F5EF] transition-colors flex items-center gap-1.5"
                      >
                        <span>Inspection & Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#C7FF55]" />
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
