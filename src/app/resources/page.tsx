'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  X,
  Compass
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

const CATEGORIES = [
  'All',
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

const TYPES = ['All', 'equipment', 'room', 'laboratory', 'workspace', 'facility'];

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedType]);

  async function fetchResources(searchVal = search) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchVal) params.set('q', searchVal);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedType !== 'All') params.set('type', selectedType);

      const res = await fetch(`/api/resources?${params.toString()}`);
      const data = await res.json();
      setResources(data.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchResources(search);
  }

  function handleClearFilters() {
    setSearch('');
    setSelectedCategory('All');
    setSelectedType('All');
    fetchResources('');
  }

  return (
    <div className="flex-1 bg-[#080908] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Header & Hero Filter Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#111713] via-[#0E1310] to-[#0A0D0B] border border-[#202C23] relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7FF55]/8 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18211B] border border-[#2B3B2E] text-xs font-mono text-[#C7FF55]">
              <Compass className="w-3.5 h-3.5" />
              <span>Institutional Discovery Engine</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5EF]">
              Explore Shared Core Equipment
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Find certified research instruments, cleanrooms, and testing facilities. Every resource is backed by institutional custodians, verifiable safety standards, and transparent FIFO queueing.
            </p>

            {/* Elevated Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by instrument name, laboratory, model, or research application..."
                  className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#090C0A] border border-[#253229] text-[#F4F5EF] text-sm focus:border-[#C7FF55] focus:outline-none placeholder-zinc-500 transition-all shadow-inner"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      fetchResources('');
                    }}
                    className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-sm hover:bg-[#b5f23d] transition-all shrink-0 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
              >
                Search Catalog
              </button>
            </form>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="space-y-4">
          {/* Horizontal Category Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 border ${
                    isActive
                      ? 'bg-[#C7FF55] text-[#080908] border-[#C7FF55] font-semibold shadow-sm'
                      : 'bg-[#121614] hover:bg-[#1A221C] text-zinc-300 border-[#202923]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Type Filter & Total Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1C251F]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">Resource Type:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {TYPES.map(t => {
                  const isActive = selectedType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all border ${
                        isActive
                          ? 'bg-[#1D2720] text-[#C7FF55] border-[#C7FF55]/50'
                          : 'bg-[#0E1310] hover:bg-[#151D17] text-zinc-400 border-[#1F2922]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span>{resources.length} resources available</span>
              {(search || selectedCategory !== 'All' || selectedType !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-[#C7FF55] hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resources Grid or Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="rounded-2xl bg-[#111613] border border-[#202C23] p-5 space-y-4 animate-pulse">
                <div className="aspect-video w-full rounded-xl bg-[#19221C]" />
                <div className="h-4 w-3/4 rounded bg-[#19221C]" />
                <div className="h-3 w-full rounded bg-[#19221C]" />
                <div className="h-3 w-2/3 rounded bg-[#19221C]" />
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0F1411] border border-[#1E2721] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#18211B] border border-[#28372D] flex items-center justify-center mx-auto text-zinc-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F5EF]">No resources match your criteria</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Try adjusting your search terms, clearing category filters, or exploring all resource types.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-[#C7FF55] text-[#080908] font-semibold text-xs transition-colors hover:bg-[#b5f23d]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(res => {
              const images = JSON.parse(res.images || '[]');
              const coverImg = images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';

              return (
                <TiltCard key={res.id} tiltMaxAngle={6} scaleOnHover={1.02}>
                  <Link
                    href={`/resources/${res.id}`}
                    className="block h-full rounded-2xl bg-[#111613] border border-[#202B23] hover:border-[#C7FF55]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative aspect-video w-full overflow-hidden bg-[#18201A]">
                        <img
                          src={coverImg}
                          alt={res.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111613] via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#080908]/85 backdrop-blur-md border border-[#28362D] text-[10px] font-mono uppercase text-[#C7FF55] font-semibold">
                            {res.category.split('&')[0]}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <StatusBadge status={res.status} size="sm" />
                        </div>

                        <div className="absolute bottom-3 left-3 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF55]" />
                          <span>{res.institution_name}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span className="capitalize">{res.resource_type}</span>
                          <span>Cap: {res.max_capacity} user{res.max_capacity > 1 ? 's' : ''}</span>
                        </div>

                        <h3 className="text-base font-bold text-[#F4F5EF] group-hover:text-[#C7FF55] transition-colors line-clamp-1">
                          {res.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400">
                          <span className="px-2 py-0.5 rounded bg-[#18211A] border border-[#243026]">
                            Lead: {res.lead_time_hours}h
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#18211A] border border-[#243026]">
                            Max: {Math.round(res.max_duration_minutes / 60)}h
                          </span>
                          {res.supervision_required ? (
                            <span className="px-2 py-0.5 rounded bg-[#352516] border border-[#523A22] text-[#F0BE67]">
                              Supervision Req
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-[#14231A] border border-[#1E382A] text-[#78D9A0]">
                              Independent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-[#1C251F] flex items-center justify-between text-xs">
                        <span className="text-zinc-500 font-mono text-[11px] truncate max-w-[150px]">
                          📍 {res.location.split(',')[0]}
                        </span>
                        <span className="text-[#C7FF55] font-mono font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
