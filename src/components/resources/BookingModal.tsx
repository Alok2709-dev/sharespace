'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { fireSuccessConfetti } from '@/components/ui/ConfettiCelebration';

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
      // Trigger joyful celebratory confetti
      fireSuccessConfetti();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111613] border border-[#27352B] rounded-3xl shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-[#C7FF55]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E2721] bg-[#141A16]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C7FF55]" />
              <h3 className="text-base font-bold text-[#F4F5EF]">
                {conflictDetected ? 'Join Transparent Waiting List' : 'Request Resource Reservation'}
              </h3>
            </div>
            <p className="text-xs text-[#9BA39B] mt-0.5">{resource.title}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl bg-[#1A221D] text-zinc-400 hover:text-white border border-[#27352B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E2E23] to-[#121E16] border border-[#C7FF55]/30 text-[#C7FF55] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(199,255,85,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#F4F5EF]">
                {successData.status === 'waitlisted' ? 'Added to Transparent Waitlist!' : 'Reservation Request Recorded!'}
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                {successData.status === 'waitlisted'
                  ? successData.explanation
                  : `Your request reference ${successData.refNumber} is logged in the permanent ledger and routed to custodian ${resource.owner_name} for formal authorization.`}
              </p>
              <div className="p-3 bg-[#0B0F0D] rounded-xl border border-[#202B24] inline-block font-mono text-xs text-[#C7FF55] shadow-inner">
                Reference: {successData.refNumber}
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push('/my-bookings');
                  }}
                  className="px-6 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all shadow-[0_0_20px_rgba(199,255,85,0.25)] flex items-center gap-2"
                >
                  <span>View My Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={e => handleSubmit(e, false)} className="space-y-4">
              {/* Ineligibility Warning if applicable */}
              {!isEligible && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <strong className="block text-red-100 font-semibold mb-0.5">Eligibility Requirement Notice</strong>
                    <span>You are currently missing verified prerequisite certifications for this high-consequence resource. Your request cannot be processed until credentials are authenticated.</span>
                  </div>
                </div>
              )}

              {/* Conflict notice with Fair FIFO Queue action */}
              {conflictDetected && (
                <div className="p-4 rounded-xl bg-[#292212] border border-[#4E3E1C] text-xs text-[#F0BE67] space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold text-amber-200">
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
                    className="w-full mt-2 py-2.5 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-colors shadow-sm"
                  >
                    Confirm & Enter Waiting List
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200">
                  {error}
                </div>
              )}

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 font-mono">
                Duration limits: Min {resource.min_duration_minutes}m • Max {resource.max_duration_minutes}m • Lead-time: {resource.lead_time_hours}h
              </div>

              {/* Research Project & Purpose */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                  Research Project / Grant (Optional)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. Hypersonic Aero-Structures / NSF Grant #892"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                  Intended Research Purpose & Setup Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="Describe your specimen, planned toolpaths, or analytical protocols. Custodians review this for authorization."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                />
              </div>

              {/* Safety Acknowledgment */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer p-3 rounded-xl bg-[#0E1310] border border-[#1E2721]">
                  <input
                    type="checkbox"
                    checked={agreeSafety}
                    onChange={e => setAgreeSafety(e.target.checked)}
                    className="mt-0.5 rounded bg-[#090C0A] border-[#253229] text-[#C7FF55] focus:ring-0"
                  />
                  <span>
                    I acknowledge that I have reviewed the safety instructions, will follow decontamination and cleanup procedures, and agree to physical inspection upon return.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1E2721]">
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
                  className="px-6 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
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
