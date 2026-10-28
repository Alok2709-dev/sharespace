'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, Award, Shield, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickDemo(userId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoUserId: userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

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
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#C7FF55]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6 relative">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C281F] to-[#121A15] border border-[#2B3B2E] flex items-center justify-center text-[#C7FF55] mx-auto mb-3 shadow-md">
            <Lock className="w-5 h-5 text-[#C7FF55]" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF]">
            Sign in to SHARESPACE
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            Institutional authentication and access credentials
          </p>
        </div>

        {/* Demo Fast Login Box for Judges */}
        <div className="p-5 rounded-3xl bg-[#111613] border border-[#C7FF55]/30 space-y-3.5 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C7FF55] font-bold">
            <Award className="w-4 h-4 animate-pulse" />
            <span>Judge Evaluation 1-Click Fast Login</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Select a verified persona to test role-specific dashboards, access controls, and handover audits immediately:
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-seeker-01')}
              disabled={loading}
              className="p-3 rounded-2xl bg-[#090C0A] hover:bg-[#162019] border border-[#222E26] hover:border-[#C7FF55]/50 text-left transition-all active:scale-95 shadow-sm"
            >
              <div className="text-xs font-bold text-[#F4F5EF]">Elena Rostova</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Seeker (Researcher)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-owner-01')}
              disabled={loading}
              className="p-3 rounded-2xl bg-[#090C0A] hover:bg-[#162019] border border-[#222E26] hover:border-[#C7FF55]/50 text-left transition-all active:scale-95 shadow-sm"
            >
              <div className="text-xs font-bold text-[#F4F5EF]">Dr. Aris Thorne</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Owner / Custodian</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-inst-01')}
              disabled={loading}
              className="p-3 rounded-2xl bg-[#090C0A] hover:bg-[#162019] border border-[#222E26] hover:border-[#C7FF55]/50 text-left transition-all active:scale-95 shadow-sm"
            >
              <div className="text-xs font-bold text-[#F4F5EF]">Marcus Vance</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Institution Manager</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-admin-01')}
              disabled={loading}
              className="p-3 rounded-2xl bg-[#090C0A] hover:bg-[#162019] border border-[#222E26] hover:border-[#C7FF55]/50 text-left transition-all active:scale-95 shadow-sm"
            >
              <div className="text-xs font-bold text-[#F4F5EF]">Sarah Chen</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Platform Admin</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 font-medium">
                Institutional Email Address
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
                Password
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
              <span className="text-[10px] text-zinc-500 font-mono mt-1.5 block">
                Default password for all personas: ShareSpace2026!
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs hover:bg-[#b5f23d] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(199,255,85,0.2)] active:scale-95"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Authenticate Account</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#1C251F] text-center text-xs text-zinc-400">
            Need an institutional account?{' '}
            <Link href="/register" className="text-[#C7FF55] hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
