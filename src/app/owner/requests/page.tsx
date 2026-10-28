'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock, CheckCircle2, XCircle, AlertTriangle, ShieldCheck,
  User, ArrowLeft, Loader2, FileText, Check, X
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

export default function OwnerRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisionModal, setDecisionModal] = useState<{
    booking: any;
    decision: 'approve' | 'reject';
  } | null>(null);

  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings?scope=owner&status=pending_approval');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.status === 403) {
        router.push('/access-denied');
        return;
      }
      const data = await res.json();
      setRequests(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecisionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!decisionModal) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${decisionModal.booking.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decisionModal.decision,
          reason
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record decision');

      setDecisionModal(null);
      setReason('');
      fetchRequests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

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
              <span>Pending Reviews</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5EF]">
              Booking Request Management
            </h1>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            {requests.length} request(s) awaiting custodian review
          </span>
        </div>

        {/* List of pending requests */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs">
            Loading submitted booking requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#131715] border border-[#212824] rounded-xl p-8">
            <CheckCircle2 className="w-8 h-8 text-[#78D9A0] mx-auto" />
            <p className="text-base font-semibold text-[#F4F5EF]">Inbox Clear: Zero Pending Requests</p>
            <p className="text-xs text-zinc-400">All booking submissions have been evaluated and recorded.</p>
            <Link
              href="/owner/handovers"
              className="mt-2 inline-block px-4 py-2 rounded-md bg-[#191F1B] border border-[#2F3933] text-xs text-[#C7FF55]"
            >
              Check Active Handovers &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#212824]">
                  <div>
                    <span className="font-mono text-xs text-[#C7FF55] font-bold">
                      {req.booking_reference}
                    </span>
                    <h3 className="text-base font-bold text-[#F4F5EF] mt-0.5">
                      {req.resource_title}
                    </h3>
                  </div>

                  <div className="text-right text-xs font-mono text-zinc-400">
                    <div>Applicant: <strong className="text-zinc-200">{req.seeker_name}</strong></div>
                    <div className="text-[11px] text-zinc-500">{req.seeker_department}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-[#0B0D0C] rounded-lg border border-[#212824] space-y-1">
                    <span className="text-zinc-500 block">Requested Time Slot:</span>
                    <span className="text-zinc-200 font-semibold">{req.start_time}</span>
                    <span className="text-zinc-400 block">to {req.end_time}</span>
                  </div>

                  <div className="p-3 bg-[#0B0D0C] rounded-lg border border-[#212824] space-y-1">
                    <span className="text-zinc-500 block">Research Project:</span>
                    <span className="text-zinc-200 font-semibold">{req.project_name || 'Standard Academic Research'}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-300">
                  <span className="text-zinc-500 font-mono block mb-1">Intended Purpose & Plan:</span>
                  <p className="p-3 bg-[#0B0D0C] rounded-lg border border-[#212824] italic">
                    "{req.purpose}"
                  </p>
                </div>

                {/* Decision Actions */}
                <div className="pt-3 border-t border-[#212824] flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setDecisionModal({ booking: req, decision: 'reject' });
                      setReason('');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#2E1413] hover:bg-[#3d1a19] border border-[#592624] text-xs font-mono text-[#F17D78] flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject with Reason</span>
                  </button>

                  <button
                    onClick={() => {
                      setDecisionModal({ booking: req, decision: 'approve' });
                      setReason('Prerequisite credentials and toolpath safety parameters verified.');
                    }}
                    className="px-5 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decision Recording Modal */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131715] border border-[#2F3933] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F4F5EF]">
              {decisionModal.decision === 'approve' ? 'Approve Booking Request' : 'Reject Booking Request'}
            </h3>
            <p className="text-xs text-zinc-400">
              {decisionModal.booking.booking_reference} • {decisionModal.booking.resource_title}
            </p>

            {error && (
              <div className="p-2 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Recorded Decision Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder={
                    decisionModal.decision === 'approve'
                      ? 'State why this request was authorized (e.g. Verified qualification and non-hazardous specimen).'
                      : 'State the specific reason for decline (e.g. Specimen outgassing incompatible with chamber vacuum).'
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF] focus:border-[#C7FF55] focus:outline-none"
                />
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                  Mandatory: This will be permanently written to the audit ledger and visible to the applicant.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionModal(null)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason.trim()}
                  className={`px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                    decisionModal.decision === 'approve'
                      ? 'bg-[#C7FF55] text-[#171A17] hover:bg-[#b5f23d]'
                      : 'bg-[#F17D78] text-[#171A17] hover:bg-[#e06863]'
                  }`}
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm {decisionModal.decision === 'approve' ? 'Approval' : 'Rejection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
