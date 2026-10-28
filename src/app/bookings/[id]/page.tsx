'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock, Shield, CheckCircle2, AlertTriangle, ArrowLeft,
  FileCheck, ShieldAlert, User, Database, Camera, AlertCircle
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Handover form state for Custodians
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchBooking();
  }, [id]);

  async function fetchSession() {
    try {
      const res = await fetch('/api/auth/session');
      const d = await res.json();
      setCurrentUser(d.user);
    } catch {}
  }

  async function fetchBooking() {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) throw new Error('Booking not found');
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 font-medium text-sm">
        Loading persistent booking ledger...
      </div>
    );
  }

  if (!data || !data.booking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4">
        <h2 className="text-xl font-black text-[#20231F]">Booking Record Not Found</h2>
        <Link href="/my-bookings" className="px-5 py-2.5 rounded-xl bg-[#20231F] text-white text-xs font-bold hover:bg-[#3B66F5] transition-all shadow-sm">
          Return to Bookings
        </Link>
      </div>
    );
  }

  const { booking, handovers, auditEvents, incidents } = data;
  const isOwner = currentUser?.id === booking.owner_id;
  const isManager = ['institution_manager', 'admin'].includes(currentUser?.role);
  const canPerformHandover = isOwner || isManager;

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb & Reference */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
            <Link href="/my-bookings" className="hover:text-[#20231F] transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Bookings Ledger</span>
            </Link>
            <span>/</span>
            <span className="text-[#3B66F5] font-black bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{booking.booking_reference}</span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#EFE9DD]">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#FF7A45] tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full inline-block">
                {booking.resource_category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#20231F] tracking-tight">
                {booking.resource_title}
              </h1>
              <p className="text-xs text-zinc-500 font-medium">
                📍 {booking.resource_location}
              </p>
            </div>

            {/* Custodian Quick Handover Triggers */}
            {canPerformHandover && (
              <div className="flex items-center gap-2.5 shrink-0">
                {booking.status === 'approved' && (
                  <button
                    onClick={() => setCheckInModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all"
                  >
                    Conduct Check-in Handover &rarr;
                  </button>
                )}

                {(booking.status === 'checked_in' || booking.status === 'overdue') && (
                  <button
                    onClick={() => setReturnModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#2EBF71] text-white font-bold text-xs hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    Inspect Return & Sign-Off &rarr;
                  </button>
                )}

                <button
                  onClick={() => setIncidentModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors"
                >
                  Report Incident
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1 text-xs">
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD]">
              <span className="text-zinc-400 font-bold uppercase text-[11px] block">Requested Schedule:</span>
              <span className="text-[#20231F] font-bold text-sm block mt-1">{booking.start_time}</span>
              <span className="text-zinc-500 block text-xs mt-0.5">to {booking.end_time}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD]">
              <span className="text-zinc-400 font-bold uppercase text-[11px] block">Authorized Seeker:</span>
              <span className="text-[#20231F] font-bold text-sm block mt-1">{booking.seeker_name}</span>
              <span className="text-zinc-500 block text-xs">{booking.seeker_department}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD]">
              <span className="text-zinc-400 font-bold uppercase text-[11px] block">Resource Custodian:</span>
              <span className="text-[#20231F] font-bold text-sm block mt-1">{booking.owner_name}</span>
              <span className="text-zinc-500 block text-xs">{booking.owner_email}</span>
            </div>
          </div>

          {booking.purpose && (
            <div className="pt-3 border-t border-[#EFE9DD] text-xs text-zinc-600">
              <span className="text-zinc-400 font-bold uppercase text-[11px] block mb-1">Research Purpose:</span>
              "{booking.purpose}"
            </div>
          )}

          {booking.decision_reason && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
              <span className="text-amber-800 block font-bold mb-0.5">Recorded Decision Reason:</span>
              {booking.decision_reason}
              {booking.decider_name && <span className="text-amber-700 block mt-1 text-[11px]">— Recorded by {booking.decider_name}</span>}
            </div>
          )}
        </div>

        {/* Handover & Condition Audit Comparison View */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DD]">
            <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#3B66F5]" />
              <span>Comparative Handover Condition Records</span>
            </h3>
            <span className="text-xs font-bold text-zinc-500 bg-[#F7F5EF] px-3 py-1 rounded-full border border-[#EFE9DD]">
              Two-party Physical Verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-In Handover Record */}
            <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-[#3B66F5] font-black">
                  Stage 04: Check-in Handover
                </span>
                {handovers?.checkIn ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Verified</span>
                ) : (
                  <span className="text-xs text-zinc-400 font-medium">Pending Handover</span>
                )}
              </div>

              {handovers?.checkIn ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Handover Time:</span>
                    <span className="text-[#20231F] font-semibold">{handovers.checkIn.handover_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Conducted By:</span>
                    <span className="text-[#20231F] font-semibold">{handovers.checkIn.conductor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Initial Condition:</span>
                    <span className="text-emerald-700 font-bold uppercase">{handovers.checkIn.initial_condition}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Accessories Verified:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {handovers.checkIn.accessories_included.map((acc: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-[#EFE9DD] text-xs font-medium text-zinc-700">
                          ✓ {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                  {handovers.checkIn.notes && (
                    <div className="pt-2 text-zinc-600 italic">
                      Notes: "{handovers.checkIn.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-4 font-medium">
                  Check-in inspection will be recorded by the custodian upon physical release of the resource.
                </p>
              )}
            </div>

            {/* Return Record */}
            <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-[#3B66F5] font-black">
                  Stage 05: Return Inspection
                </span>
                {handovers?.returnRecord ? (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    handovers.returnRecord.inspection_status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {handovers.returnRecord.inspection_status.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400 font-medium">Awaiting Return</span>
                )}
              </div>

              {handovers?.returnRecord ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Return Time:</span>
                    <span className="text-[#20231F] font-semibold">{handovers.returnRecord.return_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Inspected By:</span>
                    <span className="text-[#20231F] font-semibold">{handovers.returnRecord.conductor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Final Condition:</span>
                    <span className={`font-bold uppercase ${
                      handovers.returnRecord.condition_changed ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      {handovers.returnRecord.final_condition}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Accessories Returned:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {handovers.returnRecord.accessories_returned.map((acc: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-[#EFE9DD] text-xs font-medium text-zinc-700">
                          ✓ {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                  {handovers.returnRecord.notes && (
                    <div className="pt-2 text-zinc-600 italic">
                      Notes: "{handovers.returnRecord.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-4 font-medium">
                  Comparative inspection will verify calibration integrity, parts return, and de-contamination upon completion.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Incidents (if any) */}
        {incidents && incidents.length > 0 && (
          <div className="p-8 rounded-3xl bg-rose-50/70 border border-rose-200 shadow-warm-md space-y-4">
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Associated Incident Report ({incidents.length})</span>
            </h3>
            {incidents.map((inc: any) => (
              <div key={inc.id} className="p-4 bg-white rounded-2xl border border-rose-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-rose-700">{inc.incident_reference}</span>
                  <span className="text-zinc-600 ml-2">[{inc.category}] • {inc.description}</span>
                </div>
                <Link href={`/incidents/${inc.id}`} className="text-[#3B66F5] font-bold hover:underline">
                  Review Incident &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Immutable Audit Ledger Trail */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DD]">
            <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#3B66F5]" />
              <span>Immutable Activity Trail for this Booking</span>
            </h3>
            <span className="text-xs font-bold text-zinc-500 bg-[#F7F5EF] px-3 py-1 rounded-full border border-[#EFE9DD]">
              {auditEvents.length} recorded event(s)
            </span>
          </div>

          <div className="space-y-3">
            {auditEvents.map((evt: any) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3B66F5] font-black">{evt.action_type}</span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-[#20231F] font-bold">{evt.actor_name} ({evt.actor_role})</span>
                  </div>
                  {evt.decision_reason && (
                    <div className="text-xs text-zinc-600">{evt.decision_reason}</div>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 font-medium shrink-0">{evt.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custodian Handover Check-In Modal */}
      {checkInModalOpen && (
        <CheckInModal
          booking={booking}
          onClose={() => setCheckInModalOpen(false)}
          onSuccess={() => {
            setCheckInModalOpen(false);
            fetchBooking();
          }}
        />
      )}

      {/* Custodian Return Inspection Modal */}
      {returnModalOpen && (
        <ReturnModal
          booking={booking}
          onClose={() => setReturnModalOpen(false)}
          onSuccess={() => {
            setReturnModalOpen(false);
            fetchBooking();
          }}
        />
      )}

      {/* Incident Report Modal */}
      {incidentModalOpen && (
        <IncidentModal
          booking={booking}
          onClose={() => setIncidentModalOpen(false)}
          onSuccess={() => {
            setIncidentModalOpen(false);
            fetchBooking();
          }}
        />
      )}
    </div>
  );
}

// Handover Check-In Subcomponent
function CheckInModal({ booking, onClose, onSuccess }: any) {
  const [initialCondition, setInitialCondition] = useState('pristine');
  const [accessories, setAccessories] = useState('Safety goggles, Power cable, Calibration key');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckInSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/handovers/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          initialCondition,
          accessoriesIncluded: accessories.split(',').map(s => s.trim()).filter(Boolean),
          notes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record check-in');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20231F]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#EFE9DD] rounded-3xl p-7 shadow-2xl space-y-4">
        <div>
          <h3 className="text-lg font-black text-[#20231F]">Record Handover Check-In</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Verify equipment physical state with the seeker before release.
          </p>
        </div>

        {error && <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">{error}</div>}

        <form onSubmit={handleCheckInSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Initial Condition</label>
            <select
              value={initialCondition}
              onChange={e => setInitialCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            >
              <option value="pristine">Pristine (Like new, zero scratches)</option>
              <option value="good">Good (Normal minor superficial wear)</option>
              <option value="acceptable">Acceptable (Operable, cosmetic wear)</option>
              <option value="fair">Fair (Requires careful handling)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
              Included Accessories (Comma separated)
            </label>
            <input
              type="text"
              value={accessories}
              onChange={e => setAccessories(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Custodian Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Spindle runout verified, zeroed out."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-[#20231F]">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#3B66F5] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all"
            >
              {loading ? 'Submitting...' : 'Sign & Complete Handover'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Return Inspection Subcomponent
function ReturnModal({ booking, onClose, onSuccess }: any) {
  const [finalCondition, setFinalCondition] = useState('good');
  const [accessories, setAccessories] = useState('Safety goggles, Power cable, Calibration key');
  const [notes, setNotes] = useState('');
  const [flagForReview, setFlagForReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReturnSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/handovers/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          finalCondition,
          accessoriesReturned: accessories.split(',').map(s => s.trim()).filter(Boolean),
          notes,
          flagForReview
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record return');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20231F]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#EFE9DD] rounded-3xl p-7 shadow-2xl space-y-4">
        <div>
          <h3 className="text-lg font-black text-[#20231F]">Return Inspection Sign-Off</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Inspect returned equipment, check all items, and sign off the return.
          </p>
        </div>

        {error && <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">{error}</div>}

        <form onSubmit={handleReturnSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Final Condition</label>
            <select
              value={finalCondition}
              onChange={e => setFinalCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            >
              <option value="good">Good (Clean and fully operable)</option>
              <option value="pristine">Pristine (No change)</option>
              <option value="acceptable">Acceptable (Minor expected wear)</option>
              <option value="damaged">Damaged (Needs repair/review)</option>
              <option value="heavily_soiled">Heavily Soiled (Decontamination needed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Accessories Returned</label>
            <input
              type="text"
              value={accessories}
              onChange={e => setAccessories(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Inspection Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Lens checked clean, cards formatted."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-zinc-700 font-medium">
              <input
                type="checkbox"
                checked={flagForReview}
                onChange={e => setFlagForReview(e.target.checked)}
                className="rounded accent-[#3B66F5]"
              />
              <span>Flag this return for institutional damage/incident review</span>
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-[#20231F]">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#2EBF71] text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            >
              {loading ? 'Submitting...' : 'Sign & Complete Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Incident Report Modal Subcomponent
function IncidentModal({ booking, onClose, onSuccess }: any) {
  const [category, setCategory] = useState('equipment_damage');
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIncidentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          resourceId: booking.resource_id,
          category,
          severity,
          description
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to file incident');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20231F]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-rose-200 rounded-3xl p-7 shadow-2xl space-y-4">
        <div>
          <h3 className="text-lg font-black text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>File Operational Incident</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Escalate equipment damage, missing accessories, or safety breaches to the Institution Manager.
          </p>
        </div>

        {error && <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">{error}</div>}

        <form onSubmit={handleIncidentSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
              >
                <option value="equipment_damage">Equipment Damage</option>
                <option value="missing_accessories">Missing Accessories</option>
                <option value="late_return">Late Return</option>
                <option value="unsafe_use">Unsafe Use</option>
                <option value="scheduling_dispute">Scheduling Dispute</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Description of Incident</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe physical anomaly, missing components, or observed protocol deviation..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-[#20231F]">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md shadow-rose-500/20 transition-all"
            >
              {loading ? 'Filing...' : 'Submit Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
