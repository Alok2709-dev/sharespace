'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle, Shield, CheckCircle2, Clock, ArrowLeft,
  User, Check, Loader2, FileText, Database
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [incident, setIncident] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('under_review');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSession();
    fetchIncident();
  }, [id]);

  async function fetchSession() {
    try {
      const res = await fetch('/api/auth/session');
      const d = await res.json();
      setCurrentUser(d.user);
    } catch {}
  }

  async function fetchIncident() {
    setLoading(true);
    try {
      const res = await fetch(`/api/incidents/${id}`);
      if (!res.ok) throw new Error('Incident not found');
      const d = await res.json();
      setIncident(d.incident);
      setStatus(d.incident.status);
      setResolutionNotes(d.incident.resolution_notes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resolutionNotes
        })
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to update incident');

      setMessage('Incident status and human review notes successfully recorded in audit ledger.');
      fetchIncident();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 font-medium text-sm">
        Loading incident dossier...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4">
        <h2 className="text-xl font-black text-[#20231F]">Incident Record Not Found</h2>
        <Link href="/incidents" className="px-5 py-2.5 rounded-xl bg-[#20231F] text-white text-xs font-bold hover:bg-[#3B66F5] transition-all shadow-sm">
          Return to Incidents
        </Link>
      </div>
    );
  }

  const isReviewer = ['institution_manager', 'admin', 'owner'].includes(currentUser?.role);

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/incidents" className="text-xs font-bold text-zinc-500 hover:text-[#20231F] flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>All Incidents</span>
          </Link>
          <StatusBadge status={incident.status} />
        </div>

        {/* Incident Main Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <div className="space-y-1 pb-4 border-b border-[#EFE9DD]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                {incident.incident_reference}
              </span>
              <span className="text-xs uppercase font-bold text-zinc-400">
                • {incident.category.replace('_', ' ')} • {incident.severity} severity
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#20231F] tracking-tight mt-1">
              {incident.resource_title}
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              📍 {incident.resource_location}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD]">
              <span className="text-zinc-400 font-bold uppercase text-[10px] block">Reporter:</span>
              <span className="text-[#20231F] font-bold text-sm block mt-0.5">{incident.reporter_name}</span>
              <span className="text-zinc-500 block text-xs">{incident.reporter_email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD]">
              <span className="text-zinc-400 font-bold uppercase text-[10px] block">Assigned Reviewer:</span>
              <span className="text-[#20231F] font-bold text-sm block mt-0.5">{incident.reviewer_name || 'Unassigned (Open Queue)'}</span>
              <span className="text-zinc-500 block text-xs">Filed on: {incident.created_at}</span>
            </div>
          </div>

          <div>
            <span className="text-zinc-400 font-bold uppercase text-[10px] block mb-1.5">Incident Description:</span>
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs text-zinc-700 leading-relaxed font-medium">
              {incident.description}
            </div>
          </div>

          {incident.booking_reference && (
            <div className="pt-2 text-xs text-zinc-500 flex items-center justify-between">
              <span>Related Booking: <strong className="text-[#20231F]">{incident.booking_reference}</strong></span>
              <Link href={`/bookings/${incident.booking_id}`} className="text-[#3B66F5] font-bold hover:underline">
                View Associated Booking Record &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Human-in-the-Loop Resolution Section */}
        {isReviewer && (
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3B66F5]" />
                <span>Human Oversight & Investigation Decisions</span>
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                In accordance with platform safety policies, consequential incident resolutions require authorized human investigator review.
              </p>
            </div>

            {message && (
              <div className="p-4 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold">
                {message}
              </div>
            )}

            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Investigation Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
                >
                  <option value="under_review">Under Review (Investigator Active)</option>
                  <option value="awaiting_information">Awaiting Information from Seeker</option>
                  <option value="resolved">Resolved (Inspection Closed)</option>
                  <option value="escalated">Escalated to Institutional Dean</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Resolution Findings & Action Plan *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Document findings, replacement parts sourced, or confirmed non-damage..."
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Review Decision & Update Ledger</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
