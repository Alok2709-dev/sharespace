'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Building, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'seeker' | 'owner'>('seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          department,
          password,
          requested_role: role
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 bg-[#0B0D0C] flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55] mx-auto mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5EF]">
            Create SHARESPACE Account
          </h1>
          <p className="text-xs text-zinc-400">
            Join the institutional network for verified resource sharing
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Institutional Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@sharespace.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Department / Research Laboratory *
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Dept of Precision Mechanical Engineering"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Account Role Intent
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    role === 'seeker'
                      ? 'bg-[#191F1B] border-[#C7FF55] text-[#C7FF55]'
                      : 'bg-[#0B0D0C] border-[#212824] text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-semibold">Resource Seeker</div>
                  <div className="text-[10px] text-zinc-500">Student, researcher, creator</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    role === 'owner'
                      ? 'bg-[#191F1B] border-[#C7FF55] text-[#C7FF55]'
                      : 'bg-[#0B0D0C] border-[#212824] text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-semibold">Resource Custodian</div>
                  <div className="text-[10px] text-zinc-500">Faculty, lab manager</div>
                </button>
              </div>
              {role === 'owner' && (
                <span className="text-[10px] text-[#F0BE67] font-mono mt-1 block">
                  * Custodian accounts require verification by Institution Manager before listing equipment.
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Password (min 8 characters) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B0D0C] border border-[#2F3933] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Register Institutional Account</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#191F1B] text-center text-xs text-zinc-400">
            Already registered?{' '}
            <Link href="/login" className="text-[#C7FF55] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
