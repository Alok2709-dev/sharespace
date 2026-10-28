'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Building, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="flex-1 bg-[#080908] flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#C7FF55]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2B3B2E] flex items-center justify-center text-[#C7FF55] mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#C7FF55]" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF]">
            Create SHARESPACE Account
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            Join the institutional network for verified resource sharing
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Vance"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                Institutional Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@sharespace.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                Department / Research Laboratory *
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Dept of Precision Mechanical Engineering"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                Account Role Intent
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                    role === 'seeker'
                      ? 'bg-[#18221B] border-[#C7FF55] text-[#C7FF55] shadow-sm'
                      : 'bg-[#090C0A] border-[#202B23] text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold">Resource Seeker</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Student, researcher, creator</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                    role === 'owner'
                      ? 'bg-[#18221B] border-[#C7FF55] text-[#C7FF55] shadow-sm'
                      : 'bg-[#090C0A] border-[#202B23] text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold">Resource Custodian</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Faculty, lab manager</div>
                </button>
              </div>
              {role === 'owner' && (
                <span className="text-[10px] text-[#F0BE67] font-mono mt-1.5 block">
                  * Custodian accounts require verification by Institution Manager before listing equipment.
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                Password (min 8 characters) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090C0A] border border-[#232F26] text-[#F4F5EF] text-xs focus:border-[#C7FF55] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Register Institutional Account</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#1C251F] text-center text-xs text-zinc-400">
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
