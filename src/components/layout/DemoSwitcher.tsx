'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, RefreshCw, ChevronDown, Award } from 'lucide-react';

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
  const [expanded, setExpanded] = useState(false);

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
      setExpanded(false);
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

  const activePersona = DEMO_PERSONAS.find(p => p.id === currentUser?.id);

  return (
    <div className="w-full bg-[#131715] border-b border-[#212824] px-4 py-2 text-xs text-[#A0A69F] relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C7FF55]/10 text-[#C7FF55] font-mono font-semibold tracking-wider text-[11px] uppercase border border-[#C7FF55]/20">
            <Award className="w-3 h-3" />
            Judge Demonstration Control
          </span>
          <span className="hidden sm:inline text-zinc-400">
            Active Persona: <strong className="text-[#F4F5EF]">{currentUser ? currentUser.full_name : 'Guest (Unauthenticated)'}</strong>
            {currentUser && <span className="ml-1 text-[#C7FF55] font-mono">[{currentUser.role.toUpperCase()}]</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500 mr-1 hidden md:inline">Switch Role:</span>
          {DEMO_PERSONAS.map(p => {
            const isSelected = currentUser?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSwitch(p)}
                disabled={loading}
                className={`px-2.5 py-1 rounded transition-all text-xs flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#C7FF55] text-[#171A17] font-semibold border-[#C7FF55]'
                    : 'bg-[#191F1B] hover:bg-[#232B26] text-[#F4F5EF] border-[#29332D]'
                }`}
                title={`${p.name} - ${p.department}`}
              >
                <span>{p.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-mono uppercase px-1 rounded ${isSelected ? 'bg-black/20 text-[#171A17]' : 'bg-black/40 text-zinc-400'}`}>
                  {p.role === 'institution_manager' ? 'Inst Mgr' : p.role}
                </span>
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-2 py-1 text-zinc-400 hover:text-white transition-colors ml-1 underline"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
