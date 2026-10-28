'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Trash2, Loader2, ShieldCheck, Layers } from 'lucide-react';

const CATEGORIES = [
  'Microscopy & Imaging',
  'Advanced Fabrication',
  'Additive Manufacturing',
  'Media & Optics',
  'Microfabrication',
  'Computing Clusters',
  'Testing & Characterization',
  'Electronics & RF',
  'Mechanical Testing',
  'Bioanalytical Core',
  'Field Equipment',
  'Human-Machine Interaction'
];

export default function NewResourcePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [resourceType, setResourceType] = useState('equipment');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('20:00');
  const [minDuration, setMinDuration] = useState(60);
  const [maxDuration, setMaxDuration] = useState(480);
  const [leadTime, setLeadTime] = useState(24);
  const [maxCapacity, setMaxCapacity] = useState(1);
  const [deposit, setDeposit] = useState(0);
  const [supervision, setSupervision] = useState(false);
  const [usageInstructions, setUsageInstructions] = useState('');
  const [safetyInstructions, setSafetyInstructions] = useState('');

  // Prerequisite requirements
  const [requirements, setRequirements] = useState<Array<{ requirement_type: string; title: string; description: string; is_mandatory: boolean }>>([
    {
      requirement_type: 'training',
      title: 'Facility Safety & Operator Orientation',
      description: 'Completion of laboratory baseline safety induction.',
      is_mandatory: true
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addRequirement() {
    setRequirements([
      ...requirements,
      { requirement_type: 'qualification', title: '', description: '', is_mandatory: true }
    ]);
  }

  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function updateRequirement(index: number, field: string, value: any) {
    const updated = [...requirements];
    (updated[index] as any)[field] = value;
    setRequirements(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          resource_type: resourceType,
          location,
          images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
          operating_hours: { start: startTime, end: endTime, days: [1,2,3,4,5] },
          min_duration_minutes: Number(minDuration),
          max_duration_minutes: Number(maxDuration),
          lead_time_hours: Number(leadTime),
          max_capacity: Number(maxCapacity),
          deposit_amount: Number(deposit),
          supervision_required: supervision,
          usage_instructions: usageInstructions,
          safety_instructions: safetyInstructions,
          eligibility_requirements: requirements.filter(r => r.title.trim().length > 0)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to list resource');

      router.push(`/resources/${data.resourceId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <Link href="/owner/dashboard" className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Owner Hub</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5EF]">
            Publish New Institutional Resource
          </h1>
          <p className="text-xs text-zinc-400">
            Configure access rules, operating hours, and prerequisite safety certifications.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Identification */}
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <h2 className="text-sm font-bold text-[#F4F5EF] uppercase font-mono tracking-wider">
              1. Resource Specification
            </h2>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Official Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. JEOL JSM-IT800 Ultra-High Resolution Field Emission SEM"
                className="w-full px-3 py-2.5 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Facility Type *</label>
                <select
                  value={resourceType}
                  onChange={e => setResourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                >
                  <option value="equipment">Laboratory Equipment</option>
                  <option value="room">Specialized Room</option>
                  <option value="laboratory">Full Laboratory Suite</option>
                  <option value="workspace">Shared Fabrication Workspace</option>
                  <option value="facility">High-Performance Computing Facility</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Campus Location / Building & Room *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Nanotechnology Complex, Wing B, Suite 104"
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Equipment Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Description & Technical Capabilities *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe optical magnification, laser wavelength, sample chamber size, vacuum tolerance, etc."
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
              />
            </div>
          </div>

          {/* Allocation & Operating Rules */}
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <h2 className="text-sm font-bold text-[#F4F5EF] uppercase font-mono tracking-wider">
              2. Allocation Rules & Operating Hours
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Lead Time (Hours)</label>
                <input
                  type="number"
                  value={leadTime}
                  onChange={e => setLeadTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Security Deposit ($)</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={e => setDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supervision}
                    onChange={e => setSupervision(e.target.checked)}
                    className="rounded bg-[#0B0D0C] text-[#C7FF55]"
                  />
                  <span>Staff Supervision Mandatory</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Operating Handbook / Usage Notes
                </label>
                <textarea
                  rows={2}
                  value={usageInstructions}
                  onChange={e => setUsageInstructions(e.target.value)}
                  placeholder="Specify vacuum warmup cycles, approved tooling, or coolant protocols..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  PPE & Safety Instructions
                </label>
                <textarea
                  rows={2}
                  value={safetyInstructions}
                  onChange={e => setSafetyInstructions(e.target.value)}
                  placeholder="Mandatory eye protection, cryo gloves, cleanroom garments..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Prerequisite Eligibility Rules */}
          <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#F4F5EF] uppercase font-mono tracking-wider">
                  3. Prerequisite Eligibility Gating
                </h2>
                <p className="text-xs text-zinc-400">
                  Seekers must possess verified qualifications before booking requests can be submitted.
                </p>
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="px-3 py-1.5 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#C7FF55] flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Prerequisite</span>
              </button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={req.title}
                      onChange={e => updateRequirement(idx, 'title', e.target.value)}
                      placeholder="e.g. Electron Optics Safety Certification (EM-102)"
                      className="flex-1 px-3 py-1.5 rounded bg-[#131715] border border-[#2F3933] text-xs text-[#F4F5EF]"
                    />
                    <select
                      value={req.requirement_type}
                      onChange={e => updateRequirement(idx, 'requirement_type', e.target.value)}
                      className="px-2 py-1.5 rounded bg-[#131715] border border-[#2F3933] text-xs text-zinc-300"
                    >
                      <option value="training">Training Course</option>
                      <option value="safety_cert">Safety Certification</option>
                      <option value="qualification">Hands-on Setup Exam</option>
                      <option value="project_approval">Grant / Project Sign-off</option>
                    </select>
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="p-1.5 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={req.description}
                    onChange={e => updateRequirement(idx, 'description', e.target.value)}
                    placeholder="Short description of what course or certification is required..."
                    className="w-full px-3 py-1 rounded bg-[#131715] border border-[#2F3933] text-xs text-zinc-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submission button */}
          <div className="flex justify-end gap-3 pt-2">
            <Link href="/owner/dashboard" className="px-5 py-2.5 text-xs text-zinc-400 hover:text-white">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Publish Institutional Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
