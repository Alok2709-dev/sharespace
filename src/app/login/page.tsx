'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, Award, Shield, Sparkles, UserCheck } from 'lucide-react';

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
    <div className="flex-1 bg-[#F7F5EF] flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Soft Pastel Background Accents */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[350px] bg-[#FFEBDD] rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#EEF4FF] rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6 relative">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#EFF5FF] border border-[#BDD5FF] flex items-center justify-center text-[#4169E1] mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#20231F]">
            Sign in to ShareSpace
          </h1>
          <p className="text-xs text-[#555B53] font-sans">
            Access your campus resources, reservations, and handovers
          </p>
        </div>

        {/* Demo Fast Login Box for Judges */}
        <div className="p-6 rounded-3xl bg-white border border-[#E7E1D3] space-y-3.5 shadow-warm-md relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs uppercase text-[#4169E1] font-bold">
            <Award className="w-4 h-4 text-[#FF7A45]" />
            <span>Judge Evaluation 1-Click Fast Login</span>
          </div>
          <p className="text-[11px] text-[#555B53] leading-relaxed font-sans">
            Click any verified persona to test role-specific dashboards, access controls, and handover audits immediately:
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-seeker-01')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-[#EFF5FF] hover:bg-[#DEEBFF] border border-[#BDD5FF] text-left transition-all active:scale-95 shadow-xs"
            >
              <div className="text-xs font-bold text-[#20231F]">Elena Rostova</div>
              <div className="text-[10px] font-bold text-[#4169E1]">Seeker (Student)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-owner-01')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-[#FFF0E8] hover:bg-[#FFE3D4] border border-[#FFD2BC] text-left transition-all active:scale-95 shadow-xs"
            >
              <div className="text-xs font-bold text-[#20231F]">Dr. Aris Thorne</div>
              <div className="text-[10px] font-bold text-[#D9531E]">Resource Custodian</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-inst-01')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-[#F4EFFF] hover:bg-[#ECE4FF] border border-[#D9C8FF] text-left transition-all active:scale-95 shadow-xs"
            >
              <div className="text-xs font-bold text-[#20231F]">Marcus Vance</div>
              <div className="text-[10px] font-bold text-[#6941C6]">Institution Manager</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('usr-admin-01')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-[#FFF8E6] hover:bg-[#FEF0D0] border border-[#FCE2A1] text-left transition-all active:scale-95 shadow-xs"
            >
              <div className="text-xs font-bold text-[#20231F]">Sarah Chen</div>
              <div className="text-[10px] font-bold text-[#9A5B00]">Platform Admin</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-5 shadow-warm-md">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#FDC2C2] text-[#C92A2A] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#7C837C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@sharespace.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#7C837C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
              <span className="text-[10px] text-[#7C837C] mt-1.5 block font-medium">
                Default password for all personas: ShareSpace2026!
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-color-cobalt active:scale-95"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Sign In to Account</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#EFE9DD] text-center text-xs text-[#555B53]">
            Need an institutional account?{' '}
            <Link href="/register" className="text-[#4169E1] hover:underline font-bold">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
