'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, SlidersHorizontal, MapPin, Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

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

  return (
    <div className="flex-1 bg-[#0B0D0C] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
                Shared Institutional Infrastructure
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-[#F4F5EF] mt-1">
                Resource Discovery Marketplace
              </h1>
            </div>
            <div className="text-xs font-mono text-zinc-500">
              Showing {resources.length} verified listings
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by instrument name, laboratory, model, or research application..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#131715] border border-[#2F3933] text-[#F4F5EF] text-sm focus:border-[#C7FF55] focus:outline-none placeholder-zinc-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-sm hover:bg-[#b5f23d] transition-colors shrink-0"
            >
              Filter Search
            </button>
          </form>
        </div>

        {/* Filters Row */}
        <div className="space-y-3 pb-2 border-b border-[#212824]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-[11px] font-mono uppercase text-zinc-500 mr-1 shrink-0">Category:</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#C7FF55] text-[#171A17] font-semibold border-[#C7FF55]'
                    : 'bg-[#131715] hover:bg-[#191F1B] text-zinc-300 border-[#212824]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resource Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono uppercase text-zinc-500 mr-1 shrink-0">Facility Type:</span>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono uppercase transition-all border ${
                  selectedType === t
                    ? 'bg-[#191F1B] text-[#C7FF55] border-[#C7FF55]/60 font-semibold'
                    : 'bg-[#0B0D0C] hover:bg-[#131715] text-zinc-400 border-[#212824]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs">
            Loading institutional equipment registry...
          </div>
        ) : resources.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#131715] border border-[#212824] rounded-xl p-8">
            <p className="text-base text-zinc-300 font-semibold">No matching resources found.</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your keyword query or reset category filters to view full institutional inventory.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedType('All');
                fetchResources('');
              }}
              className="mt-2 px-4 py-2 rounded-md bg-[#191F1B] border border-[#2F3933] text-xs text-[#C7FF55] hover:bg-[#232B26]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(res => (
              <Link
                key={res.id}
                href={`/resources/${res.id}`}
                className="group rounded-xl bg-[#131715] border border-[#212824] hover:border-[#2F3933] transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Image header */}
                <div className="relative h-48 w-full bg-[#0B0D0C] overflow-hidden">
                  <img
                    src={res.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded bg-[#0B0D0C]/80 backdrop-blur-md text-[10px] font-mono uppercase text-[#C7FF55] border border-white/10 font-medium">
                      {res.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={res.status} size="sm" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-[#F4F5EF] group-hover:text-[#C7FF55] transition-colors leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#191F1B]">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{res.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>⏱️ Lead: {res.lead_time_hours}h</span>
                      <span>⚖️ {res.min_duration_minutes}-{res.max_duration_minutes}m</span>
                      {res.deposit_amount > 0 ? (
                        <span>Deposit: ${res.deposit_amount}</span>
                      ) : (
                        <span className="text-[#78D9A0]">No Deposit</span>
                      )}
                    </div>

                    {res.requirements_count > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-[#F0BE67] font-mono">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{res.requirements_count} required certification(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="px-5 py-3 bg-[#191F1B]/60 border-t border-[#212824] flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">Custodian: {res.owner_name}</span>
                  <span className="font-semibold text-[#C7FF55] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Reserve Space &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
