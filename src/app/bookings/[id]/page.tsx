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
      <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 font-mono text-xs">
        Loading persistent booking ledger...
      </div>
    );
  }

  if (!data || !data.booking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F4F5EF]">Booking Record Not Found</h2>
        <Link href="/my-bookings" className="px-4 py-2 rounded bg-[#C7FF55] text-[#171A17] text-xs font-semibold">
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
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb & Reference */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Link href="/my-bookings" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bookings Ledger</span>
            </Link>
            <span>/</span>
            <span className="text-[#C7FF55] font-bold">{booking.booking_reference}</span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#212824]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider">
                {booking.resource_category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F4F5EF]">
                {booking.resource_title}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">
                📍 {booking.resource_location}
              </p>
            </div>

            {/* Custodian Quick Handover Triggers */}
            {canPerformHandover && (
              <div className="flex items-center gap-2 shrink-0">
                {booking.status === 'approved' && (
                  <button
                    onClick={() => setCheckInModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors"
                  >
                    Conduct Check-in Handover &rarr;
                  </button>
                )}

                {(booking.status === 'checked_in' || booking.status === 'overdue') && (
                  <button
                    onClick={() => setReturnModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors"
                  >
                    Inspect Return & Sign-Off &rarr;
                  </button>
                )}

                <button
                  onClick={() => setIncidentModalOpen(true)}
                  className="px-3 py-2 rounded-lg bg-[#2E1413] hover:bg-[#3d1a19] border border-[#592624] text-xs font-mono text-[#F17D78] transition-colors"
                >
                  Report Incident
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block">Requested Schedule:</span>
              <span className="text-zinc-200">{booking.start_time}</span>
              <span className="text-zinc-500 block mt-0.5">to {booking.end_time}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Authorized Seeker:</span>
              <span className="text-zinc-200 font-semibold">{booking.seeker_name}</span>
              <span className="text-zinc-500 block">{booking.seeker_department}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Resource Custodian:</span>
              <span className="text-zinc-200 font-semibold">{booking.owner_name}</span>
              <span className="text-zinc-500 block">{booking.owner_email}</span>
            </div>
          </div>

          {booking.purpose && (
            <div className="pt-3 border-t border-[#191F1B] text-xs text-zinc-300">
              <span className="text-zinc-500 font-mono block mb-0.5">Research Purpose:</span>
              "{booking.purpose}"
            </div>
          )}

          {booking.decision_reason && (
            <div className="p-3 rounded-lg bg-[#0B0D0C] border border-[#212824] text-xs font-mono text-zinc-300">
              <span className="text-[#C7FF55] block font-semibold mb-0.5">Recorded Decision Reason:</span>
              {booking.decision_reason}
              {booking.decider_name && <span className="text-zinc-500 block mt-1">— Recorded by {booking.decider_name}</span>}
            </div>
          )}
        </div>

        {/* Handover & Condition Audit Comparison View */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#212824]">
            <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#C7FF55]" />
              <span>Comparative Handover Condition Records</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Two-party Physical Verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-In Handover Record */}
            <div className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C7FF55] font-bold">
                  Stage 04: Check-in Handover
                </span>
                {handovers?.checkIn ? (
                  <span className="text-[10px] font-mono text-[#78D9A0] font-semibold">Verified</span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500">Pending Handover</span>
                )}
              </div>

              {handovers?.checkIn ? (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Handover Time:</span>
                    <span className="text-zinc-300">{handovers.checkIn.handover_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Conducted By:</span>
                    <span className="text-zinc-300">{handovers.checkIn.conductor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Initial Condition:</span>
                    <span className="text-[#C7FF55] font-bold uppercase">{handovers.checkIn.initial_condition}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Accessories Verified:</span>
                    <div className="flex flex-wrap gap-1">
                      {handovers.checkIn.accessories_included.map((acc: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#191F1B] border border-[#2F3933] text-[10px] text-zinc-300">
                          ✓ {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                  {handovers.checkIn.notes && (
                    <div className="pt-1 text-zinc-400 italic">
                      Notes: "{handovers.checkIn.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 py-4">
                  Check-in inspection will be recorded by the custodian upon physical release of the resource.
                </p>
              )}
            </div>

            {/* Return Record */}
            <div className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C7FF55] font-bold">
                  Stage 05: Return Inspection
                </span>
                {handovers?.returnRecord ? (
                  <span className={`text-[10px] font-mono font-semibold ${
                    handovers.returnRecord.inspection_status === 'passed' ? 'text-[#78D9A0]' : 'text-[#F17D78]'
                  }`}>
                    {handovers.returnRecord.inspection_status.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500">Awaiting Return</span>
                )}
              </div>

              {handovers?.returnRecord ? (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Return Time:</span>
                    <span className="text-zinc-300">{handovers.returnRecord.return_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Inspected By:</span>
                    <span className="text-zinc-300">{handovers.returnRecord.conductor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Final Condition:</span>
                    <span className={`font-bold uppercase ${
                      handovers.returnRecord.condition_changed ? 'text-[#F17D78]' : 'text-[#78D9A0]'
                    }`}>
                      {handovers.returnRecord.final_condition}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Accessories Returned:</span>
                    <div className="flex flex-wrap gap-1">
                      {handovers.returnRecord.accessories_returned.map((acc: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#191F1B] border border-[#2F3933] text-[10px] text-zinc-300">
                          ✓ {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                  {handovers.returnRecord.notes && (
                    <div className="pt-1 text-zinc-400 italic">
                      Notes: "{handovers.returnRecord.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 py-4">
                  Comparative inspection will verify calibration integrity, parts return, and de-contamination upon completion.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Incidents (if any) */}
        {incidents && incidents.length > 0 && (
          <div className="p-6 rounded-xl bg-[#2E1413]/30 border border-[#592624] space-y-3">
            <h3 className="text-sm font-bold text-[#F17D78] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Associated Incident Report ({incidents.length})</span>
            </h3>
            {incidents.map((inc: any) => (
              <div key={inc.id} className="p-3 bg-[#0B0D0C] rounded-lg border border-[#592624] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-[#F17D78]">{inc.incident_reference}</span>
                  <span className="text-zinc-400 ml-2">[{inc.category}] • {inc.description}</span>
                </div>
                <Link href={`/incidents/${inc.id}`} className="text-[#C7FF55] underline hover:opacity-80">
                  Review Incident &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Immutable Audit Ledger Trail */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#C7FF55]" />
              <span>Immutable Activity Trail for this Booking</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              {auditEvents.length} recorded event(s)
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {auditEvents.map((evt: any) => (
              <div
                key={evt.id}
                className="p-3 rounded-lg bg-[#0B0D0C] border border-[#212824] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C7FF55] font-bold">{evt.action_type}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-300">{evt.actor_name} ({evt.actor_role})</span>
                  </div>
                  {evt.decision_reason && (
                    <div className="text-[11px] text-zinc-400">{evt.decision_reason}</div>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0">{evt.created_at}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#131715] border border-[#2F3933] rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-[#F4F5EF]">Record Handover Check-In</h3>
        <p className="text-xs text-zinc-400">
          Verify equipment physical state with the seeker before release.
        </p>

        {error && <div className="p-2 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded">{error}</div>}

        <form onSubmit={handleCheckInSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Initial Condition</label>
            <select
              value={initialCondition}
              onChange={e => setInitialCondition(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            >
              <option value="pristine">Pristine (Like new, zero scratches)</option>
              <option value="good">Good (Normal minor superficial wear)</option>
              <option value="acceptable">Acceptable (Operable, cosmetic wear)</option>
              <option value="fair">Fair (Requires careful handling)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Included Accessories (Comma separated)
            </label>
            <input
              type="text"
              value={accessories}
              onChange={e => setAccessories(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Custodian Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Spindle runout verified, zeroed out."
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-zinc-400">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded bg-[#C7FF55] text-[#171A17] font-bold text-xs"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#131715] border border-[#2F3933] rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-[#F4F5EF]">Return Inspection Sign-Off</h3>
        <p className="text-xs text-zinc-400">
          Inspect returned equipment, check all items, and sign off the return.
        </p>

        {error && <div className="p-2 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded">{error}</div>}

        <form onSubmit={handleReturnSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Final Condition</label>
            <select
              value={finalCondition}
              onChange={e => setFinalCondition(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            >
              <option value="good">Good (Clean and fully operable)</option>
              <option value="pristine">Pristine (No change)</option>
              <option value="acceptable">Acceptable (Minor expected wear)</option>
              <option value="damaged">Damaged (Needs repair/review)</option>
              <option value="heavily_soiled">Heavily Soiled (Decontamination needed)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Accessories Returned</label>
            <input
              type="text"
              value={accessories}
              onChange={e => setAccessories(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Inspection Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Lens checked clean, cards formatted."
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={flagForReview}
                onChange={e => setFlagForReview(e.target.checked)}
                className="rounded bg-[#0B0D0C] text-[#C7FF55]"
              />
              <span>Flag this return for institutional damage/incident review</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-zinc-400">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded bg-[#C7FF55] text-[#171A17] font-bold text-xs"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#131715] border border-red-900 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-[#F17D78] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>File Operational Incident</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Escalate equipment damage, missing accessories, or safety breaches to the Institution Manager.
        </p>

        {error && <div className="p-2 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded">{error}</div>}

        <form onSubmit={handleIncidentSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              >
                <option value="equipment_damage">Equipment Damage</option>
                <option value="missing_accessories">Missing Accessories</option>
                <option value="late_return">Late Return</option>
                <option value="unsafe_use">Unsafe Use</option>
                <option value="scheduling_dispute">Scheduling Dispute</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Description of Incident</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe physical anomaly, missing components, or observed protocol deviation..."
              className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-zinc-400">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded bg-[#F17D78] text-[#171A17] font-bold text-xs hover:bg-[#e06863]"
            >
              {loading ? 'Filing...' : 'Submit Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
