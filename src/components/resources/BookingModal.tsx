'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2, Loader2, X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: any;
  userEligibility?: any;
  onSuccess?: () => void;
}

export function BookingModal({ isOpen, onClose, resource, userEligibility, onSuccess }: BookingModalProps) {
  const router = useRouter();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [projectName, setProjectName] = useState('');
  const [agreeSafety, setAgreeSafety] = useState(false);
  const [joinWaitlist, setJoinWaitlist] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen) return null;

  const isEligible = userEligibility ? userEligibility.isEligible : true;

  async function handleSubmit(e: React.FormEvent, forceWaitlist = false) {
    e.preventDefault();
    setError(null);
    setConflictDetected(false);
    setConflictMessage(null);

    if (!agreeSafety) {
      setError('You must acknowledge the operating guidelines and safety protocols to request access.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          purpose,
          projectName,
          startTime: startTime.replace('T', ' ') + ':00',
          endTime: endTime.replace('T', ' ') + ':00',
          joinWaitlistIfConflict: forceWaitlist || joinWaitlist
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error && data.error.includes('Scheduling conflict')) {
          setConflictDetected(true);
          setConflictMessage(data.error);
          return;
        }
        throw new Error(data.error || 'Failed to submit booking request');
      }

      setSuccessData(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#131715] border border-[#2F3933] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#212824] bg-[#191F1B]">
          <div>
            <h3 className="text-base font-semibold text-[#F4F5EF]">
              {conflictDetected ? 'Join Transparent Waiting List' : 'Request Resource Reservation'}
            </h3>
            <p className="text-xs text-[#A0A69F]">{resource.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#12241A] border border-[#224A33] text-[#78D9A0] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#F4F5EF]">
                {successData.status === 'waitlisted' ? 'Added to Waiting List!' : 'Booking Request Submitted!'}
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                {successData.status === 'waitlisted'
                  ? successData.explanation
                  : `Your reservation request ${successData.refNumber} has been recorded in the persistent ledger and routed to custodian ${resource.owner_name} for approval.`}
              </p>
              <div className="p-3 bg-[#0B0D0C] rounded-lg border border-[#212824] inline-block font-mono text-xs text-[#C7FF55]">
                Reference: {successData.refNumber}
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push('/my-bookings');
                  }}
                  className="px-5 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors"
                >
                  View My Bookings &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={e => handleSubmit(e, false)} className="space-y-4">
              {/* Ineligibility Warning if applicable */}
              {!isEligible && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <strong className="block text-red-100 font-semibold mb-0.5">Eligibility Requirement Notice</strong>
                    <span>You are currently missing verified prerequisite certifications for this high-consequence resource. Your request cannot be processed until credentials are authenticated.</span>
                  </div>
                </div>
              )}

              {/* Conflict notice with Fair FIFO Queue action */}
              {conflictDetected && (
                <div className="p-3.5 rounded-lg bg-[#292212] border border-[#4E3E1C] text-xs text-[#F0BE67] space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Slot Busy: Transparent Fair-Allocation Queue</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">{conflictMessage}</p>
                  <p className="text-[11px] text-zinc-400">
                    ShareSpace guarantees non-discriminatory FIFO queueing. Would you like to enter position in the waiting list? If the slot opens, your request is automatically promoted.
                  </p>
                  <button
                    type="button"
                    onClick={e => handleSubmit(e, true)}
                    disabled={loading}
                    className="w-full mt-2 py-2 rounded bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d] transition-colors"
                  >
                    Confirm & Enter Waiting List
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-200">
                  {error}
                </div>
              )}

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 font-mono">
                Duration limits: Min {resource.min_duration_minutes}m • Max {resource.max_duration_minutes}m • Required lead-time: {resource.lead_time_hours}h
              </div>

              {/* Research Project & Purpose */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Research Project / Grant (Optional)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. Hypersonic Aero-Structures / NSF Grant #892"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Intended Research Purpose & Setup Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="Describe your specimen, planned toolpaths, or analytical protocols. Custodians review this for authorization."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                />
              </div>

              {/* Safety Acknowledgment */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeSafety}
                    onChange={e => setAgreeSafety(e.target.checked)}
                    className="mt-0.5 rounded bg-[#0B0D0C] border-[#2F3933] text-[#C7FF55] focus:ring-0"
                  />
                  <span>
                    I acknowledge that I have reviewed the safety instructions, will follow decontamination and cleanup procedures, and agree to physical inspection upon return.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#212824]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !isEligible}
                  className="px-6 py-2.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit Reservation Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
