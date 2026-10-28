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
      setError('Please acknowledge the operating guidelines and safety protocols to continue.');
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
      fireSuccessConfetti();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white border border-[#E7E1D3] rounded-3xl shadow-warm-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#EFE9DD] bg-[#F7F5EF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1]" />
              <h3 className="font-editorial text-lg font-bold text-[#20231F]">
                {conflictDetected ? 'Join Transparent Waiting List' : 'Reserve Resource'}
              </h3>
            </div>
            <p className="text-xs text-[#7C837C] mt-0.5">{resource.title}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-white text-[#7C837C] hover:text-[#20231F] border border-[#E7E1D3] transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-7 max-h-[80vh] overflow-y-auto">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EDFBF3] border border-[#B7ECCB] text-[#22C55E] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-editorial text-2xl font-bold text-[#20231F]">
                {successData.status === 'waitlisted' ? 'Added to Transparent Waitlist!' : 'Reservation Request Recorded!'}
              </h4>
              <p className="text-xs text-[#555B53] max-w-md mx-auto leading-relaxed">
                {successData.status === 'waitlisted'
                  ? successData.explanation
                  : `Your request reference ${successData.refNumber} is logged and routed to custodian ${resource.owner_name} for approval.`}
              </p>
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E7E1D3] inline-block font-mono text-xs text-[#4169E1] font-bold">
                Reference: {successData.refNumber}
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push('/my-bookings');
                  }}
                  className="px-7 py-3 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all shadow-color-cobalt flex items-center gap-2"
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
                <div className="p-4 rounded-2xl bg-[#FFF0F0] border border-[#FDC2C2] text-xs text-[#C92A2A] flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">Eligibility Requirement Notice</strong>
                    <span>You are currently missing verified prerequisite certifications for this high-consequence resource. Your request cannot be processed until credentials are authenticated.</span>
                  </div>
                </div>
              )}

              {/* Conflict notice with Fair FIFO Queue action */}
              {conflictDetected && (
                <div className="p-4 rounded-2xl bg-[#FFF8E6] border border-[#FCE2A1] text-xs text-[#A36200] space-y-2.5">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Slot Busy: Transparent Fair-Allocation Queue</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#7A4B00]">{conflictMessage}</p>
                  <p className="text-[11px] text-[#A36200]">
                    ShareSpace guarantees non-discriminatory FIFO queueing. Would you like to enter position in the waiting list? If the slot opens, your request is automatically promoted.
                  </p>
                  <button
                    type="button"
                    onClick={e => handleSubmit(e, true)}
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-colors shadow-xs"
                  >
                    Confirm & Enter Waiting List
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#FDC2C2] text-xs text-[#C92A2A]">
                  {error}
                </div>
              )}

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#7C837C]">
                Limits: Min {resource.min_duration_minutes}m • Max {resource.max_duration_minutes}m • Notice: {resource.lead_time_hours}h
              </div>

              {/* Project & Purpose */}
              <div>
                <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                  Project or Course Name (Optional)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. Senior Capstone Video / Acoustic Levitation Experiment"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                  Intended Purpose & Use Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="Tell the custodian what you plan to create or test..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:outline-none transition-colors"
                />
              </div>

              {/* Safety Acknowledgment */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#555B53] cursor-pointer p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3]">
                  <input
                    type="checkbox"
                    checked={agreeSafety}
                    onChange={e => setAgreeSafety(e.target.checked)}
                    className="mt-0.5 rounded text-[#4169E1] focus:ring-0"
                  />
                  <span>
                    I confirm that I will follow operating instructions, care for the equipment, and complete the check-in and return inspection with the custodian.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EFE9DD]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-[#7C837C] hover:text-[#20231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !isEligible}
                  className="px-7 py-3 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all disabled:opacity-50 flex items-center gap-2 shadow-color-cobalt active:scale-95"
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
