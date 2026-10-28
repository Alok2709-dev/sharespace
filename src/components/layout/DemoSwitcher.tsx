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
    <div className="w-full bg-[#EFE9DD] border-b border-[#E3DC handle-border border-[#E2DAC9]] px-4 py-1.5 text-xs text-[#555B53] relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Badge Indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#20231F] font-sans font-bold text-[11px] shadow-xs border border-[#DFD8C6]">
            <Award className="w-3.5 h-3.5 text-[#FF7A45]" />
            <span>Interactive Demo Bar</span>
          </span>
          <span className="hidden sm:inline text-[#555B53] font-sans text-xs">
            Role: <strong className="text-[#20231F]">{currentUser ? currentUser.full_name : 'Guest (Unauthenticated)'}</strong>
            {currentUser && <span className="ml-1 text-[#3B66F5] font-semibold text-[11px]">({currentUser.role})</span>}
          </span>
        </div>

        {/* Persona Switch Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#838A81] mr-1 hidden lg:inline font-sans text-xs">Switch persona:</span>
          {DEMO_PERSONAS.map(p => {
            const isSelected = currentUser?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSwitch(p)}
                disabled={loading}
                className={`px-3 py-1 rounded-full transition-all text-xs flex items-center gap-1.5 font-medium border active:scale-95 ${
                  isSelected
                    ? 'bg-[#3B66F5] text-white font-bold border-[#3B66F5] shadow-xs'
                    : 'bg-white hover:bg-[#F7F5EF] text-[#20231F] border-[#DCD5C4]'
                }`}
                title={`${p.name} (${p.department})`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{p.name.split(' ')[0]}</span>
                <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#555B53]'}`}>
                  {p.role === 'institution_manager' ? 'Manager' : p.role}
                </span>
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-2.5 py-1 text-[#838A81] hover:text-[#20231F] transition-colors ml-1 inline-flex items-center gap-1 text-[11px] font-medium"
              title="Logout to guest mode"
            >
              <LogOut className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
