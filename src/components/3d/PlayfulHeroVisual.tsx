'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Camera, Headphones, Laptop, BookOpen, Film, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

interface FloatingItem {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  image: string;
  initialTransform: string;
  floatAnimation: string;
  delay: string;
}

const HERO_OBJECTS: FloatingItem[] = [
  {
    id: 'camera',
    title: 'Sony Alpha FX3 Cinema Rig',
    category: 'Creative Equipment',
    badgeColor: 'text-[#D9531E]',
    badgeBg: 'bg-[#FFF0E8]',
    badgeBorder: 'border-[#FFD2BC]',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    initialTransform: 'top-2 left-6 sm:left-12 rotate-[-5deg]',
    floatAnimation: 'animate-gentle-float',
    delay: '0s'
  },
  {
    id: 'headphones',
    title: 'Studio Monitor Audio Kit',
    category: 'Audio & Music',
    badgeColor: 'text-[#2550C0]',
    badgeBg: 'bg-[#EEF4FF]',
    badgeBorder: 'border-[#BDD5FF]',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    initialTransform: 'top-12 right-4 sm:right-10 rotate-[6deg]',
    floatAnimation: 'animate-gentle-float-alt',
    delay: '1s'
  },
  {
    id: 'laptop',
    title: 'MacBook Pro M3 Max Node',
    category: 'Computing & Design',
    badgeColor: 'text-[#6941C6]',
    badgeBg: 'bg-[#F4EFFF]',
    badgeBorder: 'border-[#D9C8FF]',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    initialTransform: 'bottom-8 left-4 sm:left-14 rotate-[3deg]',
    floatAnimation: 'animate-gentle-float-alt',
    delay: '2s'
  },
  {
    id: 'projector',
    title: '4K Ultra-Bright Laser Cinema',
    category: 'Event & Presentation',
    badgeColor: 'text-[#9A5B00]',
    badgeBg: 'bg-[#FFF8E6]',
    badgeBorder: 'border-[#FCE2A1]',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    initialTransform: 'bottom-4 right-6 sm:right-16 rotate-[-4deg]',
    floatAnimation: 'animate-gentle-float',
    delay: '1.5s'
  }
];

export function PlayfulHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] flex items-center justify-center select-none overflow-visible"
    >
      {/* Background Soft Pastel Layer Shapes */}
      <div 
        className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-[#FFE5D6] opacity-75 blur-2xl transition-transform duration-700 ease-out pointer-events-none -top-4 -left-6"
        style={{ transform: `translate(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px)` }}
      />
      <div 
        className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#E8EEFF] opacity-80 blur-2xl transition-transform duration-700 ease-out pointer-events-none -bottom-6 -right-6"
        style={{ transform: `translate(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px)` }}
      />
      <div 
        className="absolute w-56 h-56 rounded-full bg-[#F3EFFF] opacity-70 blur-xl transition-transform duration-700 ease-out pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Central Visual Showcase Card */}
      <div 
        className="relative z-10 w-64 sm:w-76 p-4 rounded-3xl bg-white border border-[#E7E1D3] shadow-warm-xl transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px) rotate(${mouseOffset.x * 0.1}deg)`
        }}
      >
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-3">
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&auto=format&fit=crop&q=80"
            alt="Quiet Pod Space"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#20231F] shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>Available on Campus</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#7C837C] font-semibold">
            <span>Room & Creative Studio</span>
            <span className="text-[#4169E1] font-bold">Free access</span>
          </div>
          <h4 className="font-editorial text-base font-bold text-[#20231F]">
            Apex Design Studio & Sound Pod
          </h4>
          <p className="text-xs text-[#555B53] line-clamp-1">
            Acoustic proofing, dual 4K monitors & podcast microphones.
          </p>
        </div>
      </div>

      {/* Floating Interactive Shared Items */}
      {HERO_OBJECTS.map((item, idx) => (
        <div
          key={item.id}
          onMouseEnter={() => setActiveItem(item.id)}
          onMouseLeave={() => setActiveItem(null)}
          className={`absolute z-20 ${item.initialTransform} ${item.floatAnimation} transition-transform duration-300 cursor-pointer`}
          style={{
            animationDelay: item.delay,
            transform: `translate(${mouseOffset.x * (idx % 2 === 0 ? 0.7 : -0.7)}px, ${mouseOffset.y * (idx % 2 === 0 ? 0.7 : -0.7)}px)`
          }}
        >
          <div className="group relative p-2.5 bg-white rounded-2xl border border-[#E7E1D3] shadow-warm-md hover:shadow-warm-xl hover:scale-108 transition-all duration-300 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="pr-2 max-w-[150px] sm:max-w-[170px]">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeBg} ${item.badgeColor} ${item.badgeBorder} mb-0.5`}>
                {item.category}
              </span>
              <h5 className="text-xs font-bold text-[#20231F] truncate group-hover:text-[#4169E1] transition-colors">
                {item.title}
              </h5>
            </div>
          </div>
        </div>
      ))}

      {/* Floating Micro Badge: Community Stat */}
      <div 
        className="absolute -bottom-2 z-30 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E7E1D3] shadow-warm-md flex items-center gap-2.5 pointer-events-none transition-transform duration-300"
        style={{ transform: `translate(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px)` }}
      >
        <div className="flex -space-x-1.5">
          <img className="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="avatar" />
          <img className="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="avatar" />
          <img className="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80" alt="avatar" />
        </div>
        <span className="text-xs font-bold text-[#20231F]">
          12+ shared spaces & tools live
        </span>
      </div>
    </div>
  );
}
