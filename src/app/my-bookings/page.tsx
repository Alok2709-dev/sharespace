'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ArrowRight, XCircle, Search } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

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
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
              Personal Allocation History
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF] mt-1">
              My Research Bookings
            </h1>
          </div>

          <Link
            href="/resources"
            className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors self-start"
          >
            New Reservation &rarr;
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-[#212824] pb-2 overflow-x-auto">
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                filterTab === tab.id
                  ? 'bg-[#191F1B] text-[#C7FF55] border border-[#2F3933]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs">
            Retrieving reservation records...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#131715] border border-[#212824] rounded-xl p-8">
            <p className="text-sm font-semibold text-zinc-300">No reservations found in this category.</p>
            <p className="text-xs text-zinc-500">Explore the marketplace to discover instruments and book slots.</p>
            <Link
              href="/resources"
              className="mt-2 inline-block px-4 py-2 rounded-md bg-[#191F1B] border border-[#2F3933] text-xs text-[#C7FF55]"
            >
              Explore Equipment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(b => {
              const canCancel = ['pending_approval', 'approved', 'waitlisted'].includes(b.status);

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-xl bg-[#131715] border border-[#212824] hover:border-[#2F3933] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs text-[#C7FF55] font-bold tracking-tight">
                        {b.booking_reference}
                      </span>
                      <StatusBadge status={b.status} size="sm" />
                      <span className="text-xs font-mono text-zinc-500 uppercase">
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
                      <div className="p-3 rounded-lg bg-[#211E29] border border-[#42385C] text-xs font-mono text-[#C0A8F8] space-y-1">
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
                  <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#191F1B]">
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        className="px-3 py-1.5 rounded-lg bg-[#2E1413] hover:bg-[#3d1a19] border border-[#592624] text-xs font-mono text-[#F17D78] transition-colors"
                      >
                        {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    <Link
                      href={`/bookings/${b.id}`}
                      className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] transition-colors flex items-center gap-1.5"
                    >
                      <span>Inspection & Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C7FF55]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
