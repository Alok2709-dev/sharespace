'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ArrowRight, ShieldAlert, CheckCircle2, Search, Loader2, Bot, Compass } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#111613] border border-[#27352B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#C7FF55]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E2721] bg-[#141A16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2E3E31] flex items-center justify-center text-[#C7FF55] shadow-md">
              <Sparkles className="w-5 h-5 text-[#C7FF55] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#F4F5EF]">
                  ShareSpace AI Concierge
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#C7FF55]/15 text-[#C7FF55] border border-[#C7FF55]/30 font-bold">
                  Semantic Discovery Engine
                </span>
              </div>
              <p className="text-xs text-[#9BA39B] mt-0.5">
                Natural-language capability matching against verified institutional laboratories and specifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1A221D] text-zinc-400 hover:text-white border border-[#27352B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 border-b border-[#1E2721] bg-[#0E1310]/50 space-y-3">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Describe your research project, instrumentation specs, or facility needs..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] placeholder-zinc-500 text-sm focus:outline-none focus:border-[#C7FF55] transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analyze</span>
            </button>
          </form>

          {/* Sample Chips */}
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5 font-semibold">
              Or test an inquiry:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUERIES.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="px-3 py-1 rounded-lg bg-[#141B16] hover:bg-[#1E2720] border border-[#202C23] hover:border-[#C7FF55]/40 text-[11px] text-zinc-300 text-left transition-all"
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
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          {loading && (
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#C7FF55] animate-spin" />
              <p className="text-sm text-zinc-200 font-semibold font-mono">Synthesizing Institutional Inventory...</p>
              <p className="text-xs text-zinc-500 max-w-sm">Cross-referencing operating hours, toolpaths, and prerequisite safety certifications</p>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#141A16] border border-[#27352B] text-sm text-[#F4F5EF] leading-relaxed shadow-sm">
                <span className="text-xs font-mono uppercase text-[#C7FF55] block mb-1.5 font-bold flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Synthesis & Capability Insight:</span>
                </span>
                <p className="text-zinc-300 font-sans">{response.answer}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Recommended Institutional Resources ({response.recommendations?.length || 0})
                </h3>

                {response.recommendations?.map((rec: any) => (
                  <div
                    key={rec.resourceId}
                    className="p-5 rounded-2xl bg-[#090C0A] border border-[#1E2721] hover:border-[#2C3B2E] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C7FF55]/15 text-[#C7FF55] border border-[#C7FF55]/30 font-mono text-xs font-bold">
                          {rec.matchScore}% Match
                        </span>
                        <span className="text-xs font-mono text-zinc-400 uppercase">
                          {rec.category} • {rec.resourceType}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#F4F5EF]">{rec.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rec.matchReason}</p>
                      <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-1 font-mono">
                        <span>📍 {rec.location}</span>
                        <span>⏱️ {rec.leadTimeHours}h lead-time</span>
                        {rec.deposit > 0 && <span>💳 ${rec.deposit} deposit</span>}
                      </div>

                      {rec.eligibilityStatus === 'requires_action' && rec.missingRequirements?.length > 0 && (
                        <div className="mt-2 text-[11px] text-[#F0BE67] flex items-center gap-1.5 font-mono">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>Requires qualification: {rec.missingRequirements.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={`/resources/${rec.resourceId}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#151D18] hover:bg-[#C7FF55] hover:text-[#080908] text-xs font-bold text-[#F4F5EF] border border-[#27352B] transition-all"
                      >
                        <span>View Resource</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !response && (
            <div className="py-12 text-center text-zinc-500 space-y-2">
              <Compass className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">Ask the concierge anything about research facilities.</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                We'll match your project parameters to available laboratory equipment, explain prerequisites, and check schedules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
