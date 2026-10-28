'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, Award, Shield } from 'lucide-react';

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
    <div className="flex-1 bg-[#0B0D0C] flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55] mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5EF]">
            Sign in to SHARESPACE
          </h1>
          <p className="text-xs text-zinc-400">
            Institutional authentication and access credentials
          </p>
        </div>

        {/* Demo Fast Login Box for Judges */}
        <div className="p-4 rounded-xl bg-[#131715] border border-[#C7FF55]/30 space-y-3 shadow-lg">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#C7FF55] font-semibold">
            <Award className="w-4 h-4" />
            <span>Judge Evaluation Fast Login</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Select a verified persona to test role-specific dashboards and permissions instantly:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-seeker-01')}
              disabled={loading}
              className="p-2 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#212824] text-left transition-colors"
            >
              <div className="text-xs font-semibold text-[#F4F5EF]">Elena Rostova</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Seeker</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-owner-01')}
              disabled={loading}
              className="p-2 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#212824] text-left transition-colors"
            >
              <div className="text-xs font-semibold text-[#F4F5EF]">Dr. Aris Thorne</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Owner / Custodian</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-inst-01')}
              disabled={loading}
              className="p-2 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#212824] text-left transition-colors"
            >
              <div className="text-xs font-semibold text-[#F4F5EF]">Marcus Vance</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Institution Mgr</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-admin-01')}
              disabled={loading}
              className="p-2 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#212824] text-left transition-colors"
            >
              <div className="text-xs font-semibold text-[#F4F5EF]">Sarah Chen</div>
              <div className="text-[10px] font-mono text-[#C7FF55]">Platform Admin</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Institutional Email Address
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
                Password
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
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Demo password for all accounts: ShareSpace2026!
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#C7FF55] text-[#171A17] font-semibold text-xs hover:bg-[#b5f23d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Authenticate Account</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#191F1B] text-center text-xs text-zinc-400">
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
