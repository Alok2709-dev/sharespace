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
    <div className="flex-1 bg-[#F7F5EF] flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Soft Pastel Blobs */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[350px] bg-[#FFEBDD] rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#EEF4FF] rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#FFF0E8] border border-[#FFD2BC] flex items-center justify-center text-[#FF7A45] mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#20231F]">
            Join ShareSpace
          </h1>
          <p className="text-xs text-[#555B53] font-sans">
            Connect with campus resources, equipment, and fellow creators
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-5 shadow-warm-md">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#FDC2C2] text-[#C92A2A] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-[#7C837C]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Vance"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                Institutional Email Address *
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
                Department / Program *
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-3.5 w-4 h-4 text-[#7C837C]" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Media Arts & Film / Robotics Core"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] text-[#20231F] text-xs focus:border-[#4169E1] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                Account Intent
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`p-3.5 rounded-2xl border text-left transition-all active:scale-95 ${
                    role === 'seeker'
                      ? 'bg-[#EFF5FF] border-[#4169E1] text-[#4169E1] shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E7E1D3] text-[#555B53]'
                  }`}
                >
                  <div className="text-xs font-bold">Resource Seeker</div>
                  <div className="text-[10px] text-[#7C837C]">Student, creator, researcher</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-3.5 rounded-2xl border text-left transition-all active:scale-95 ${
                    role === 'owner'
                      ? 'bg-[#EFF5FF] border-[#4169E1] text-[#4169E1] shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E7E1D3] text-[#555B53]'
                  }`}
                >
                  <div className="text-xs font-bold">Resource Custodian</div>
                  <div className="text-[10px] text-[#7C837C]">Lab manager, faculty</div>
                </button>
              </div>
              {role === 'owner' && (
                <span className="text-[10px] text-[#D97706] font-medium mt-1.5 block">
                  * Custodian accounts require verification by Institution Manager before listing equipment.
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7C837C] uppercase tracking-wider mb-1.5">
                Password (min 8 characters) *
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#4169E1] text-white font-bold text-xs hover:bg-[#3256c9] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-color-cobalt active:scale-95"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Account</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#EFE9DD] text-center text-xs text-[#555B53]">
            Already registered?{' '}
            <Link href="/login" className="text-[#4169E1] hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
