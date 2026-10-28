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
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <Link href="/owner/dashboard" className="text-xs font-bold text-zinc-500 hover:text-[#20231F] flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Owner Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#20231F]">
            Publish New Institutional Resource
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Configure access rules, operating hours, and prerequisite safety certifications.
          </p>
        </div>

        {error && (
          <div className="p-4 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Identification */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <h2 className="text-xs font-bold text-[#3B66F5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full inline-block">
              1. Resource Specification
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                Official Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. JEOL JSM-IT800 Ultra-High Resolution Field Emission SEM"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] text-xs font-medium focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Facility Type *</label>
                <select
                  value={resourceType}
                  onChange={e => setResourceType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
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
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                Campus Location / Building & Room *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Nanotechnology Complex, Wing B, Suite 104"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] text-xs font-medium focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                Equipment Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] text-xs font-medium focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                Description & Technical Capabilities *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe optical magnification, laser wavelength, sample chamber size, vacuum tolerance, etc."
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] text-xs font-medium focus:ring-2 focus:ring-[#3B66F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Allocation & Operating Rules */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <h2 className="text-xs font-bold text-[#3B66F5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full inline-block">
              2. Allocation Rules & Operating Hours
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Min Duration (m)</label>
                <input
                  type="number"
                  value={minDuration}
                  onChange={e => setMinDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Max Duration (m)</label>
                <input
                  type="number"
                  value={maxDuration}
                  onChange={e => setMaxDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Lead Time (Hours)</label>
                <input
                  type="number"
                  value={leadTime}
                  onChange={e => setLeadTime(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={e => setDeposit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-zinc-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supervision}
                    onChange={e => setSupervision(e.target.checked)}
                    className="rounded accent-[#3B66F5]"
                  />
                  <span>Staff Supervision Mandatory</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  Operating Handbook / Usage Notes
                </label>
                <textarea
                  rows={2}
                  value={usageInstructions}
                  onChange={e => setUsageInstructions(e.target.value)}
                  placeholder="Specify vacuum warmup cycles, approved tooling, or coolant protocols..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                  PPE & Safety Instructions
                </label>
                <textarea
                  rows={2}
                  value={safetyInstructions}
                  onChange={e => setSafetyInstructions(e.target.value)}
                  placeholder="Mandatory eye protection, cryo gloves, cleanroom garments..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-[#20231F] text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Prerequisite Eligibility Rules */}
          <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DD]">
              <div>
                <h2 className="text-xs font-bold text-[#3B66F5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full inline-block">
                  3. Prerequisite Eligibility Gating
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  Seekers must possess verified qualifications before booking requests can be submitted.
                </p>
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#3B66F5] flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Prerequisite</span>
              </button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#EFE9DD] space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={req.title}
                      onChange={e => updateRequirement(idx, 'title', e.target.value)}
                      placeholder="e.g. Electron Optics Safety Certification (EM-102)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#EFE9DD] text-xs font-medium text-[#20231F]"
                    />
                    <select
                      value={req.requirement_type}
                      onChange={e => updateRequirement(idx, 'requirement_type', e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#EFE9DD] text-xs font-medium text-zinc-700"
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
                        className="p-2 text-zinc-400 hover:text-rose-600 transition-colors"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EFE9DD] text-xs text-zinc-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submission button */}
          <div className="flex justify-end gap-3 pt-2">
            <Link href="/owner/dashboard" className="px-5 py-2.5 text-xs font-bold text-zinc-500 hover:text-[#20231F]">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Publish Institutional Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
