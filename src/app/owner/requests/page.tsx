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
              <span>Pending Reviews</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#20231F]">
              Booking Request Management
            </h1>
          </div>

          <span className="text-xs font-bold text-zinc-500 bg-white px-3 py-1.5 rounded-full border border-[#EFE9DD] shadow-sm">
            {requests.length} request(s) awaiting review
          </span>
        </div>

        {/* List of pending requests */}
        {loading ? (
          <div className="py-20 text-center text-zinc-400 font-medium text-sm">
            Loading submitted booking requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white border border-[#EFE9DD] rounded-3xl p-8 shadow-warm-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-lg font-bold text-[#20231F]">Inbox Clear: Zero Pending Requests</p>
            <p className="text-xs text-zinc-500">All booking submissions have been evaluated and recorded.</p>
            <Link
              href="/owner/handovers"
              className="mt-3 inline-block px-5 py-2.5 rounded-xl bg-[#20231F] text-white font-bold text-xs hover:bg-[#3B66F5] transition-all shadow-sm"
            >
              Check Active Handovers &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-7 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EFE9DD]">
                  <div>
                    <span className="text-xs text-[#3B66F5] font-black bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                      {req.booking_reference}
                    </span>
                    <h3 className="text-lg font-bold text-[#20231F] mt-1.5">
                      {req.resource_title}
                    </h3>
                  </div>

                  <div className="text-right text-xs">
                    <div>Applicant: <strong className="text-[#20231F] font-bold">{req.seeker_name}</strong></div>
                    <div className="text-[11px] text-zinc-400">{req.seeker_department}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#F7F5EF] rounded-2xl border border-[#EFE9DD] space-y-1">
                    <span className="text-zinc-400 font-bold uppercase text-[10px] block">Requested Time Slot:</span>
                    <span className="text-[#20231F] font-bold">{req.start_time}</span>
                    <span className="text-zinc-500 block">to {req.end_time}</span>
                  </div>

                  <div className="p-4 bg-[#F7F5EF] rounded-2xl border border-[#EFE9DD] space-y-1">
                    <span className="text-zinc-400 font-bold uppercase text-[10px] block">Research Project:</span>
                    <span className="text-[#20231F] font-bold">{req.project_name || 'Standard Academic Research'}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-600">
                  <span className="text-zinc-400 font-bold uppercase text-[10px] block mb-1">Intended Purpose & Plan:</span>
                  <p className="p-4 bg-[#F7F5EF] rounded-2xl border border-[#EFE9DD] italic">
                    "{req.purpose}"
                  </p>
                </div>

                {/* Decision Actions */}
                <div className="pt-3 border-t border-[#EFE9DD] flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setDecisionModal({ booking: req, decision: 'reject' });
                      setReason('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject with Reason</span>
                  </button>

                  <button
                    onClick={() => {
                      setDecisionModal({ booking: req, decision: 'approve' });
                      setReason('Prerequisite credentials and toolpath safety parameters verified.');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20231F]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#EFE9DD] rounded-3xl p-7 shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-black text-[#20231F]">
                {decisionModal.decision === 'approve' ? 'Approve Booking Request' : 'Reject Booking Request'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {decisionModal.booking.booking_reference} • {decisionModal.booking.resource_title}
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Mandatory: Permanently written to the audit ledger and visible to the applicant.
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionModal(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-[#20231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason.trim()}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 ${
                    decisionModal.decision === 'approve'
                      ? 'bg-[#3B66F5] text-white hover:bg-blue-600 shadow-blue-500/20'
                      : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/20'
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
