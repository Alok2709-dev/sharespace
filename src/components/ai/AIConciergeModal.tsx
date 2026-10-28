'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ArrowRight, ShieldAlert, CheckCircle2, Search, Loader2 } from 'lucide-react';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_QUERIES = [
  'Characterize nanomaterial surface defects with sub-nanometer electron optics',
  '5-axis CNC titanium contour milling for aerospace turbine prototype',
  'High-speed 120fps 4K video camera package for fluid acoustic levitation',
  'Class 100 cleanroom with direct maskless photolithography for wafers',
  'Multi-GPU cluster node to fine-tune 70B parameter open foundation model',
  'Full acoustic anechoic chamber for sound intensity and vibration testing'
];

export function AIConciergeModal({ isOpen, onClose }: AIConciergeModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSearch(searchQuery = query) {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to query discovery assistant');
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSample(s: string) {
    setQuery(s);
    handleSearch(s);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-[#131715] border border-[#2F3933] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#212824] bg-[#191F1B]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C7FF55]/10 border border-[#C7FF55]/30 flex items-center justify-center text-[#C7FF55]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F4F5EF] flex items-center gap-2">
                ShareSpace AI Concierge
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C7FF55]/20 text-[#C7FF55] border border-[#C7FF55]/30">
                  Semantic Engine
                </span>
              </h2>
              <p className="text-xs text-[#A0A69F]">
                Institutional resource discovery matched against real inventory, specs, and safety certifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 border-b border-[#212824]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Describe your research project, instrumentation specs, or facility needs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] placeholder-zinc-500 text-sm focus:outline-none focus:border-[#C7FF55] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-sm hover:bg-[#b5f23d] transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analyze</span>
            </button>
          </form>

          {/* Sample Chips */}
          <div className="mt-3">
            <span className="text-[11px] font-mono uppercase text-zinc-500 block mb-1.5">
              Or test an inquiry:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUERIES.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="px-2.5 py-1 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#212824] text-[11px] text-zinc-300 text-left transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-[#C7FF55] animate-spin mb-3" />
              <p className="text-sm text-zinc-300 font-medium">Querying Institutional Catalog & Availability...</p>
              <p className="text-xs text-zinc-500 mt-1">Cross-referencing operating hours and prerequisite eligibility</p>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#191F1B] border border-[#2F3933] text-sm text-[#F4F5EF] leading-relaxed">
                <span className="text-xs font-mono uppercase text-[#C7FF55] block mb-1 font-semibold">
                  Synthesis & Availability Insight:
                </span>
                {response.answer}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Recommended Institutional Resources ({response.recommendations?.length || 0})
                </h3>

                {response.recommendations?.map((rec: any) => (
                  <div
                    key={rec.resourceId}
                    className="p-4 rounded-lg bg-[#0B0D0C] border border-[#212824] hover:border-[#2F3933] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#C7FF55]/10 text-[#C7FF55] border border-[#C7FF55]/20 font-mono text-xs font-bold">
                          {rec.matchScore}% Match
                        </span>
                        <span className="text-xs font-mono text-zinc-400 uppercase">
                          {rec.category} • {rec.resourceType}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#F4F5EF]">{rec.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{rec.matchReason}</p>
                      <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-1">
                        <span>📍 {rec.location}</span>
                        <span>⏱️ {rec.leadTimeHours}h lead-time</span>
                        {rec.deposit > 0 && <span>💳 ${rec.deposit} deposit</span>}
                      </div>

                      {rec.eligibilityStatus === 'requires_action' && rec.missingRequirements?.length > 0 && (
                        <div className="mt-2 text-[11px] text-[#F0BE67] flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>Requires training/verification: {rec.missingRequirements.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={`/resources/${rec.resourceId}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#191F1B] hover:bg-[#C7FF55] hover:text-[#171A17] text-xs font-semibold text-[#F4F5EF] border border-[#2F3933] transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !response && (
            <div className="py-10 text-center text-zinc-500">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-400">Ask the concierge anything about campus resources.</p>
              <p className="text-xs text-zinc-600 mt-1">
                We'll find the right equipment, explain requirements, and check availability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
