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
      <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 font-mono text-xs">
        Loading incident dossier...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F4F5EF]">Incident Record Not Found</h2>
        <Link href="/incidents" className="px-4 py-2 rounded bg-[#C7FF55] text-[#171A17] text-xs font-semibold">
          Return to Incidents
        </Link>
      </div>
    );
  }

  const isReviewer = ['institution_manager', 'admin', 'owner'].includes(currentUser?.role);

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/incidents" className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Incidents</span>
          </Link>
          <StatusBadge status={incident.status} />
        </div>

        {/* Incident Main Card */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] space-y-4">
          <div className="space-y-1 pb-3 border-b border-[#212824]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#F17D78] font-bold">
                {incident.incident_reference}
              </span>
              <span className="text-xs font-mono uppercase text-zinc-500">
                • {incident.category.replace('_', ' ')} • {incident.severity} severity
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F4F5EF]">
              {incident.resource_title}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              📍 {incident.resource_location}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block">Reporter:</span>
              <span className="text-zinc-200">{incident.reporter_name}</span>
              <span className="text-zinc-500 block">{incident.reporter_email}</span>
            </div>

            <div>
              <span className="text-zinc-500 block">Assigned Reviewer:</span>
              <span className="text-zinc-200">{incident.reviewer_name || 'Unassigned (Open Queue)'}</span>
              <span className="text-zinc-500 block">Filed on: {incident.created_at}</span>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 font-mono text-xs block mb-1">Incident Description:</span>
            <div className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] text-xs text-zinc-200 leading-relaxed">
              {incident.description}
            </div>
          </div>

          {incident.booking_reference && (
            <div className="pt-2 text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>Related Booking: <strong>{incident.booking_reference}</strong></span>
              <Link href={`/bookings/${incident.booking_id}`} className="text-[#C7FF55] hover:underline">
                View Associated Booking Record &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Human-in-the-Loop Resolution Section */}
        {isReviewer && (
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C7FF55]" />
              <span>Human Oversight & Investigation Decisions</span>
            </h2>
            <p className="text-xs text-zinc-400">
              In accordance with platform safety policies, consequential incident resolutions require authorized human investigator review.
            </p>

            {message && (
              <div className="p-3 text-xs bg-[#12241A] border border-[#224A33] text-[#78D9A0] rounded-lg">
                {message}
              </div>
            )}

            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Investigation Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                >
                  <option value="under_review">Under Review (Investigator Active)</option>
                  <option value="awaiting_information">Awaiting Information from Seeker</option>
                  <option value="resolved">Resolved (Inspection Closed)</option>
                  <option value="escalated">Escalated to Institutional Dean</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Resolution Findings & Action Plan *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Document findings, replacement parts sourced, or confirmed non-damage..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF] focus:border-[#C7FF55] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d] transition-colors flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
