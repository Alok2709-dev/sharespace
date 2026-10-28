'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Bell,
  Layers,
  Calendar,
  Shield,
  BarChart3,
  FileText,
  User,
  PlusCircle,
  Menu,
  X,
  AlertTriangle,
  Building2,
  ChevronRight
} from 'lucide-react';
import { AIConciergeModal } from '../ai/AIConciergeModal';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  async function fetchSession() {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setUser(data.user);
      if (data.user) {
        fetchNotifications();
      }
    } catch {}
  }

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.is_read).length);
      }
    } catch {}
  }

  async function handleMarkAllNotificationsRead() {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch {}
  }

  const role = user?.role || 'guest';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080908]/85 backdrop-blur-xl border-b border-[#1E2621] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo with Editorial Typography */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2621] to-[#121614] border border-[#2E3C32] flex items-center justify-center text-[#C7FF55] group-hover:border-[#C7FF55]/60 transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(199,255,85,0.2)]">
                <span className="font-mono font-black text-sm tracking-tighter">SS</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C7FF55] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-extrabold tracking-tight text-base text-[#F4F5EF] group-hover:text-[#C7FF55] transition-colors">
                    SHARESPACE
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#C7FF55]/10 text-[#C7FF55] border border-[#C7FF55]/20 font-medium">
                    v2.4
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-[#9BA39B] uppercase">
                  Access More. Own Less.
                </span>
              </div>
            </Link>

            {/* Main Nav Links with subtle pill hover states */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#121614]/80 border border-[#1E2621]">
              <Link
                href="/resources"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  pathname === '/resources' 
                    ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                }`}
              >
                Marketplace
              </Link>
              <Link
                href="/how-it-works"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  pathname === '/how-it-works' 
                    ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                }`}
              >
                How It Works
              </Link>
              <Link
                href="/trust-and-safety"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  pathname === '/trust-and-safety' 
                    ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                }`}
              >
                Trust & Safety
              </Link>

              {/* Role specific dynamic menus */}
              {user && (
                <>
                  <span className="text-zinc-700 px-1 font-mono text-xs">/</span>
                  {role === 'seeker' && (
                    <>
                      <Link
                        href="/my-bookings"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname.startsWith('/my-bookings') 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/dashboard' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Dashboard
                      </Link>
                    </>
                  )}

                  {role === 'owner' && (
                    <>
                      <Link
                        href="/owner/dashboard"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/owner/dashboard' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Owner Hub
                      </Link>
                      <Link
                        href="/owner/requests"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/owner/requests' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Requests
                      </Link>
                      <Link
                        href="/owner/handovers"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/owner/handovers' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Handovers
                      </Link>
                    </>
                  )}

                  {(role === 'institution_manager' || role === 'admin') && (
                    <>
                      <Link
                        href="/institution"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/institution' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Policies
                      </Link>
                      <Link
                        href="/incidents"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname.startsWith('/incidents') 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Incidents
                      </Link>
                      <Link
                        href="/audit"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/audit' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Audit
                      </Link>
                      <Link
                        href="/analytics"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          pathname === '/analytics' 
                            ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                            : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                        }`}
                      >
                        Analytics
                      </Link>
                      {role === 'admin' && (
                        <Link
                          href="/admin"
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                            pathname === '/admin' 
                              ? 'text-[#080908] bg-[#C7FF55] font-semibold shadow-sm' 
                              : 'text-zinc-400 hover:text-white hover:bg-[#1A211C]'
                          }`}
                        >
                          Admin
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* AI Concierge Trigger with Iridescent Neon Border */}
            <button
              onClick={() => setAiOpen(true)}
              className="relative group px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#171E19] to-[#121614] border border-[#2B3B2E] text-xs font-mono text-[#C7FF55] flex items-center gap-2 transition-all hover:border-[#C7FF55]/60 hover:shadow-[0_0_20px_rgba(199,255,85,0.2)] active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-[#C7FF55]" />
              <span className="hidden sm:inline font-bold">AI Concierge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF55]" />
            </button>

            {/* List Resource Quick Link (for owners) */}
            {user && (role === 'owner' || role === 'institution_manager' || role === 'admin') && (
              <Link
                href="/owner/resources/new"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171E19] hover:bg-[#1F2A22] border border-[#27352B] text-xs font-mono text-[#F4F5EF] transition-all hover:border-[#C7FF55]/40"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#C7FF55]" />
                <span>List Resource</span>
              </Link>
            )}

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-xl bg-[#121614] hover:bg-[#1A221C] border border-[#1E2621] text-zinc-300 relative transition-all active:scale-95"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4 text-zinc-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C7FF55] text-black text-[10px] font-bold rounded-full flex items-center justify-center font-mono shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#121614]/95 backdrop-blur-2xl border border-[#2E3C32] rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2621]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C7FF55]" />
                        <span className="font-mono text-xs uppercase tracking-wider text-[#F4F5EF] font-bold">
                          System Alerts ({notifications.length})
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllNotificationsRead}
                          className="text-[11px] text-[#C7FF55] hover:underline font-mono"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-6 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-xl text-xs transition-all border ${
                              n.is_read
                                ? 'bg-[#171D19]/40 border-transparent text-zinc-400'
                                : 'bg-[#171E19] border-[#2A372E] text-[#F4F5EF]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-[11px] text-[#C7FF55] font-mono">{n.title}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed mb-2 text-zinc-300">{n.message}</p>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => setNotificationsOpen(false)}
                                className="text-[10px] text-[#C7FF55] underline hover:opacity-80 inline-flex items-center gap-1 font-mono"
                              >
                                <span>Inspect record</span>
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar or Login / Register */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-[#121614] hover:bg-[#1A221C] border border-[#1E2621] transition-all hover:border-[#2E3C32]"
              >
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-semibold text-[#F4F5EF] leading-tight">{user.full_name}</span>
                  <span className="text-[10px] font-mono uppercase text-[#C7FF55]">{user.role}</span>
                </div>
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#2B3B2E]"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs transition-all hover:bg-[#b5f23d] shadow-sm hover:shadow-[0_0_15px_rgba(199,255,85,0.3)]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-xl bg-[#121614] border border-[#1E2621] text-zinc-300 active:scale-95"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F1311] border-b border-[#1E2621] px-5 py-4 space-y-3">
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              Marketplace
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              How It Works
            </Link>
            <Link
              href="/trust-and-safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              Trust & Safety
            </Link>
            {user && (
              <>
                <div className="pt-2 border-t border-[#1E2621]" />
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-[#C7FF55] font-semibold"
                >
                  My Bookings
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-zinc-300"
                >
                  Dashboard
                </Link>
                {(role === 'owner' || role === 'institution_manager' || role === 'admin') && (
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-zinc-300"
                  >
                    Owner Hub & Requests
                  </Link>
                )}
                {(role === 'institution_manager' || role === 'admin') && (
                  <>
                    <Link
                      href="/institution"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-zinc-300"
                    >
                      Institution Oversight
                    </Link>
                    <Link
                      href="/audit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-zinc-300"
                    >
                      Audit Trail
                    </Link>
                    <Link
                      href="/analytics"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-zinc-300"
                    >
                      Analytics
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </header>

      {/* AI Concierge Modal */}
      <AIConciergeModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
