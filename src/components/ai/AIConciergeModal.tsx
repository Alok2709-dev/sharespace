'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ArrowRight, ShieldAlert, CheckCircle2, Search, Loader2, Bot, Compass } from 'lucide-react';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_QUERIES = [
  'I need a 4K cinema camera package to shoot our campus theater festival',
  'Quiet pod with podcast microphones and dual monitors for an interview recording',
  '5-axis CNC milling machine to prototype an aluminum drone arm',
  'High-speed computing cluster node to run machine learning experiments',
  'Cleanroom access for photolithography silicon wafer fabrication'
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
      if (!res.ok) throw new Error(data.error || 'Failed to query assistant');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-[#E7E1D3] rounded-3xl shadow-warm-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#EFE9DD] bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFFF] border border-[#D9C8FF] flex items-center justify-center text-[#8A63D2] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-lg font-bold text-[#20231F]">
                  ShareSpace AI Assistant
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF5FF] text-[#4169E1] border border-[#BDD5FF]">
                  Smart Match
                </span>
              </div>
              <p className="text-xs text-[#7C837C] mt-0.5 font-sans">
                Tell us what you want to build or film — we'll match you to the right tools and spaces.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white text-[#7C837C] hover:text-[#20231F] border border-[#E7E1D3] transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-7 border-b border-[#EFE9DD] bg-white space-y-3.5">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#7C837C]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="What gear, laboratory equipment, or room do you need today?"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] placeholder-[#838A81] text-sm focus:outline-none focus:border-[#4169E1] focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-7 py-3.5 rounded-2xl bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-color-cobalt active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Find Matches</span>
            </button>
          </form>

          {/* Sample Inquiry Bubbles */}
          <div>
            <span className="text-[11px] font-bold text-[#7C837C] block mb-1.5 uppercase tracking-wider">
              Or try asking:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUERIES.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#E7E1D3] text-xs text-[#555B53] text-left transition-all font-medium"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-7 space-y-4 bg-[#FAF7F2]">
          {error && (
            <div className="p-4 rounded-2xl bg-[#FFF0F0] border border-[#FDC2C2] text-[#C92A2A] text-xs">
              {error}
            </div>
          )}

          {loading && (
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#4169E1] animate-spin" />
              <p className="text-sm text-[#20231F] font-bold">Scanning Campus Inventory...</p>
              <p className="text-xs text-[#7C837C] max-w-sm">Checking tool capabilities, safety criteria, and real-time schedules</p>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E7E1D3] text-sm text-[#20231F] leading-relaxed shadow-xs">
                <span className="text-xs uppercase text-[#4169E1] block mb-1.5 font-bold flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  <span>Recommendation Insight:</span>
                </span>
                <p className="text-[#555B53] font-sans">{response.answer}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-[#7C837C] font-bold">
                  Recommended Items ({response.recommendations?.length || 0})
                </h3>

                {response.recommendations?.map((rec: any) => (
                  <div
                    key={rec.resourceId}
                    className="p-5 rounded-2xl bg-white border border-[#E7E1D3] hover:border-[#D0C5B0] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDFBF3] text-[#1E7E49] border border-[#B7ECCB] text-xs font-bold">
                          {rec.matchScore}% Match
                        </span>
                        <span className="text-xs text-[#7C837C] font-semibold">
                          {rec.category} • {rec.resourceType}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#20231F]">{rec.title}</h4>
                      <p className="text-xs text-[#555B53] leading-relaxed font-sans">{rec.matchReason}</p>
                      <div className="flex items-center gap-4 text-[11px] text-[#7C837C] pt-1 font-medium">
                        <span>📍 {rec.location}</span>
                        <span>⏱️ {rec.leadTimeHours}h notice</span>
                        {rec.deposit > 0 && <span>💳 ${rec.deposit} deposit</span>}
                      </div>

                      {rec.eligibilityStatus === 'requires_action' && rec.missingRequirements?.length > 0 && (
                        <div className="mt-2 text-[11px] text-[#A36200] flex items-center gap-1.5 font-semibold">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-[#F59E0B]" />
                          <span>Requires training: {rec.missingRequirements.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={`/resources/${rec.resourceId}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4169E1] text-white text-xs font-bold hover:bg-[#3256c9] transition-all shadow-xs"
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
            <div className="py-12 text-center text-[#7C837C] space-y-2">
              <Compass className="w-10 h-10 text-[#7C837C] mx-auto opacity-60" />
              <p className="text-sm font-bold text-[#20231F]">Ask anything about campus equipment and spaces.</p>
              <p className="text-xs text-[#7C837C] max-w-sm mx-auto">
                We'll match your project needs to available gear, explain training requirements, and check open hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
