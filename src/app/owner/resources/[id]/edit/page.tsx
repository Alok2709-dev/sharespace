'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [resource, setResource] = useState<any>(null);
  const [status, setStatus] = useState('active');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('20:00');
  const [minDuration, setMinDuration] = useState(60);
  const [maxDuration, setMaxDuration] = useState(480);
  const [deposit, setDeposit] = useState(0);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResource();
  }, [id]);

  async function fetchResource() {
    setLoading(true);
    try {
      const res = await fetch(`/api/resources/${id}`);
      if (!res.ok) throw new Error('Resource not found');
      const data = await res.json();
      const r = data.resource;
      setResource(r);
      setStatus(r.status);
      setStartTime(r.operating_hours?.start || '08:00');
      setEndTime(r.operating_hours?.end || '20:00');
      setMinDuration(r.min_duration_minutes || 60);
      setMaxDuration(r.max_duration_minutes || 480);
      setDeposit(r.deposit_amount || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          operating_hours: { start: startTime, end: endTime, days: [1,2,3,4,5] },
          min_duration_minutes: Number(minDuration),
          max_duration_minutes: Number(maxDuration),
          deposit_amount: Number(deposit),
          suspension_reason: suspensionReason
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update resource');

      router.push(`/resources/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Loading resource configuration...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link href={`/resources/${id}`} className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Listing</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5EF]">
            Configure Resource: {resource?.title}
          </h1>
          <p className="text-xs text-zinc-400">
            Update operational status, schedules, and duration constraints.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Operational Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
            >
              <option value="active">Active (Available for reservations)</option>
              <option value="maintenance">Maintenance (Temporarily offline)</option>
              <option value="suspended">Suspended (Disabled by administrator/manager)</option>
              <option value="retired">Retired (Decommissioned)</option>
            </select>
          </div>

          {status === 'suspended' && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-red-400 mb-1">
                Recorded Suspension Reason *
              </label>
              <textarea
                required
                rows={2}
                value={suspensionReason}
                onChange={e => setSuspensionReason(e.target.value)}
                placeholder="Explain why this resource is being suspended..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-red-900 text-xs text-[#F4F5EF]"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Operating Start</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Operating End</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Min Duration (m)</label>
              <input
                type="number"
                value={minDuration}
                onChange={e => setMinDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Max Duration (m)</label>
              <input
                type="number"
                value={maxDuration}
                onChange={e => setMaxDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Deposit ($)</label>
              <input
                type="number"
                value={deposit}
                onChange={e => setDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#212824]">
            <Link href={`/resources/${id}`} className="px-4 py-2 text-xs text-zinc-400">Cancel</Link>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d] transition-colors flex items-center gap-1.5"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
