'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  X,
  Compass,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

const CATEGORIES = [
  'All',
  'Media & Optics',
  'Advanced Fabrication',
  'Additive Manufacturing',
  'Microscopy & Imaging',
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

// Category palette mapping for curated editorial feel
const CATEGORY_STYLES: Record<string, { bg: string; badge: string; accent: string }> = {
  'Media & Optics': { bg: 'bg-[#FFF0E8]', badge: 'bg-white text-[#D9531E] border-[#FFD2BC]', accent: 'text-[#D9531E]' },
  'Advanced Fabrication': { bg: 'bg-[#F4EFFF]', badge: 'bg-white text-[#6941C6] border-[#D9C8FF]', accent: 'text-[#6941C6]' },
  'Additive Manufacturing': { bg: 'bg-[#FFF8E6]', badge: 'bg-white text-[#9A5B00] border-[#FCE2A1]', accent: 'text-[#9A5B00]' },
  'Microscopy & Imaging': { bg: 'bg-[#EEF4FF]', badge: 'bg-white text-[#2550C0] border-[#BDD5FF]', accent: 'text-[#2550C0]' },
  'Microfabrication': { bg: 'bg-[#F4EFFF]', badge: 'bg-white text-[#6941C6] border-[#D9C8FF]', accent: 'text-[#6941C6]' },
  'Computing Clusters': { bg: 'bg-[#EEF4FF]', badge: 'bg-white text-[#2550C0] border-[#BDD5FF]', accent: 'text-[#2550C0]' },
  'Testing & Characterization': { bg: 'bg-[#FFF8E6]', badge: 'bg-white text-[#9A5B00] border-[#FCE2A1]', accent: 'text-[#9A5B00]' },
  'Electronics & RF': { bg: 'bg-[#EEF4FF]', badge: 'bg-white text-[#2550C0] border-[#BDD5FF]', accent: 'text-[#2550C0]' },
  'Mechanical Testing': { bg: 'bg-[#FFF0E8]', badge: 'bg-white text-[#D9531E] border-[#FFD2BC]', accent: 'text-[#D9531E]' },
  'Bioanalytical Core': { bg: 'bg-[#EDFBF3]', badge: 'bg-white text-[#1E7E49] border-[#B7ECCB]', accent: 'text-[#1E7E49]' },
  'Field Equipment': { bg: 'bg-[#EDFBF3]', badge: 'bg-white text-[#1E7E49] border-[#B7ECCB]', accent: 'text-[#1E7E49]' },
  'Human-Machine Interaction': { bg: 'bg-[#F4EFFF]', badge: 'bg-white text-[#6941C6] border-[#D9C8FF]', accent: 'text-[#6941C6]' }
};

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
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Curated Banner & Search Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E1D3] shadow-warm-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFEBDD] rounded-full blur-3xl opacity-60 pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#EFF5FF] rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="relative space-y-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF5FF] text-xs font-bold text-[#4169E1] border border-[#BDD5FF]">
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Resource Directory</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#20231F]">
              Explore shared gear & spaces
            </h1>

            <p className="text-sm sm:text-base text-[#555B53] leading-relaxed font-sans">
              Find cameras, 3D printers, media studios, and testing instruments available to reserve across our campus network.
            </p>

            {/* Elevated Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#7C837C]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by equipment, camera model, laboratory, or research discipline..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E7E1D3] text-[#20231F] text-sm focus:border-[#4169E1] focus:bg-white focus:outline-none placeholder-[#838A81] transition-all shadow-xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      fetchResources('');
                    }}
                    className="absolute right-3.5 top-3.5 text-[#7C837C] hover:text-[#20231F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#4169E1] text-white font-bold text-sm hover:bg-[#3256c9] transition-all shrink-0 shadow-color-cobalt active:scale-95"
              >
                Search Directory
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
                  className={`px-4 py-2 rounded-full font-bold transition-all shrink-0 border ${
                    isActive
                      ? 'bg-[#20231F] text-white border-[#20231F] shadow-xs'
                      : 'bg-white hover:bg-[#EFE9DD] text-[#555B53] border-[#E7E1D3]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Type Filter & Total Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E7E1D3]">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-[#7C837C] uppercase tracking-wider">Type:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {TYPES.map(t => {
                  const isActive = selectedType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all border ${
                        isActive
                          ? 'bg-[#4169E1] text-white border-[#4169E1]'
                          : 'bg-white hover:bg-[#EFE9DD] text-[#555B53] border-[#E7E1D3]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-[#7C837C]">
              <span>Showing {resources.length} verified listings</span>
              {(search || selectedCategory !== 'All' || selectedType !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-[#4169E1] hover:underline font-bold"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resources Grid or Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="rounded-3xl bg-white border border-[#E7E1D3] p-5 space-y-4 animate-pulse shadow-xs">
                <div className="aspect-video w-full rounded-2xl bg-stone-200" />
                <div className="h-5 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-full rounded bg-stone-200" />
                <div className="h-3 w-2/3 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white border border-[#E7E1D3] text-center space-y-4 shadow-warm-md">
            <div className="w-14 h-14 rounded-full bg-[#FFF0E8] border border-[#FFD2BC] flex items-center justify-center mx-auto text-[#FF7A45]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#20231F]">No matching items found</h3>
            <p className="text-sm text-[#555B53] max-w-md mx-auto">
              Try adjusting your search terms, clearing category filters, or exploring all resource types.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-full bg-[#4169E1] text-white font-bold text-xs transition-colors hover:bg-[#3256c9] shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(res => {
              const images = JSON.parse(res.images || '[]');
              const coverImg = images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
              const style = CATEGORY_STYLES[res.category] || { bg: 'bg-[#FFF8E6]', badge: 'bg-white text-[#9A5B00] border-[#FCE2A1]', accent: 'text-[#9A5B00]' };

              return (
                <Link
                  key={res.id}
                  href={`/resources/${res.id}`}
                  className="block"
                >
                  <TiltCard tiltMaxAngle={5} scaleOnHover={1.02}>
                    <div
                      className={`rounded-3xl ${style.bg} border border-[#E7E1D3] hover:border-[#D0C5B0] transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-warm-md hover:shadow-warm-xl`}
                    >
                      <div>
                        {/* Image header */}
                        <div className="relative aspect-video w-full overflow-hidden p-3 pb-0">
                          <div className="w-full h-full rounded-2xl overflow-hidden bg-white/60 relative">
                            <img
                              src={coverImg}
                              alt={res.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-2.5 left-2.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-xs ${style.badge}`}>
                                {res.category.split('&')[0]}
                              </span>
                            </div>

                            <div className="absolute top-2.5 right-2.5">
                              <StatusBadge status={res.status} size="sm" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-[#7C837C] font-semibold">
                            <span className="capitalize">{res.resource_type}</span>
                            <span>Cap: {res.max_capacity} operator{res.max_capacity > 1 ? 's' : ''}</span>
                          </div>

                          <h3 className="font-editorial text-lg font-bold text-[#20231F] group-hover:text-[#4169E1] transition-colors line-clamp-1">
                            {res.title}
                          </h3>

                          <p className="text-xs text-[#555B53] line-clamp-2 leading-relaxed">
                            {res.description}
                          </p>

                          <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-[#555B53]">
                            <span className="px-2.5 py-1 rounded-full bg-white/80 border border-[#E7E1D3]">
                              Lead: {res.lead_time_hours}h
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-white/80 border border-[#E7E1D3]">
                              Max: {Math.round(res.max_duration_minutes / 60)}h
                            </span>
                            {res.deposit_amount > 0 ? (
                              <span className="px-2.5 py-1 rounded-full bg-white/80 border border-[#E7E1D3]">
                                ₹{Number(res.deposit_amount).toLocaleString('en-IN')} Deposit
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-[#EDFBF3] text-[#1E7E49] border border-[#B7ECCB]">
                                Free to Book
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTA Row */}
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                          <span className="text-[#7C837C] font-medium text-[11px] truncate max-w-[150px]">
                            📍 {res.location.split(',')[0]}
                          </span>
                          <span className="text-[#4169E1] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
