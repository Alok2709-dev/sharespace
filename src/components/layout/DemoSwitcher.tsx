'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Check, UserCircle, LogOut } from 'lucide-react';

interface DemoUser {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  department: string;
  avatar: string;
}

const DEMO_PERSONAS: DemoUser[] = [
  {
    id: 'usr-seeker-01',
    name: 'Elena Rostova',
    role: 'seeker',
    roleLabel: 'Resource Seeker',
    department: 'Robotics & Additive Manufacturing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-owner-01',
    name: 'Dr. Aris Thorne',
    role: 'owner',
    roleLabel: 'Resource Owner / Custodian',
    department: 'Precision Engineering & Additive Mfg',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-inst-01',
    name: 'Marcus Vance',
    role: 'institution_manager',
    roleLabel: 'Institution Manager',
    department: 'Central Research Infrastructure Oversight',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-admin-01',
    name: 'Sarah Chen',
    role: 'admin',
    roleLabel: 'Platform Administrator',
    department: 'Digital Governance & Compliance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80'
  }
];

export function DemoSwitcher() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchCurrent() {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setCurrentUser(data.user);
    } catch {}
  }

  useEffect(() => {
    fetchCurrent();
  }, []);

  async function handleSwitch(persona: DemoUser) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoUserId: persona.id })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      setCurrentUser(null);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-[#0E1210] border-b border-[#1E2621] px-4 py-1.5 text-xs text-[#9BA39B] relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Badge Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C7FF55]/10 text-[#C7FF55] font-mono font-semibold tracking-wider text-[11px] uppercase border border-[#C7FF55]/25 shadow-sm">
            <Award className="w-3 h-3 animate-pulse" />
            <span>Interactive Judge Control</span>
          </span>
          <span className="hidden sm:inline text-zinc-400 font-sans text-xs">
            Viewing As: <strong className="text-[#F4F5EF]">{currentUser ? currentUser.full_name : 'Guest'}</strong>
            {currentUser && <span className="ml-1.5 text-[#C7FF55] font-mono text-[11px]">[{currentUser.role.toUpperCase()}]</span>}
          </span>
        </div>

        {/* Persona Switch Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500 mr-1 hidden lg:inline font-mono text-[11px]">Switch Persona:</span>
          {DEMO_PERSONAS.map(p => {
            const isSelected = currentUser?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSwitch(p)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg transition-all text-xs flex items-center gap-1.5 border active:scale-95 ${
                  isSelected
                    ? 'bg-[#C7FF55] text-[#080908] font-bold border-[#C7FF55] shadow-[0_0_12px_rgba(199,255,85,0.3)]'
                    : 'bg-[#151B17] hover:bg-[#1E2621] text-[#E0E5DC] border-[#253129]'
                }`}
                title={`${p.name} (${p.department})`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{p.name.split(' ')[0]}</span>
                <span className={`text-[9px] font-mono uppercase px-1 rounded ${isSelected ? 'bg-black/20 text-[#080908]' : 'bg-black/40 text-zinc-400'}`}>
                  {p.role === 'institution_manager' ? 'Inst Mgr' : p.role}
                </span>
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors ml-1 inline-flex items-center gap-1 font-mono text-[11px]"
              title="Logout to guest mode"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
