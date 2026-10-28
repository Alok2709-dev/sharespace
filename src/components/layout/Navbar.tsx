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
  Building2
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
      <header className="sticky top-0 z-40 bg-[#0B0D0C]/90 backdrop-blur-md border-b border-[#212824]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-[#191F1B] border border-[#2F3933] flex items-center justify-center text-[#C7FF55] group-hover:border-[#C7FF55] transition-colors">
                <span className="font-mono font-black text-sm tracking-tighter">SS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold tracking-tight text-base text-[#F4F5EF] group-hover:text-[#C7FF55] transition-colors">
                  SHARESPACE
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#A0A69F] uppercase -mt-1">
                  Access More. Own Less.
                </span>
              </div>
            </Link>

            {/* Main Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/resources"
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  pathname === '/resources' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                }`}
              >
                Marketplace
              </Link>
              <Link
                href="/how-it-works"
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  pathname === '/how-it-works' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                }`}
              >
                How It Works
              </Link>
              <Link
                href="/trust-and-safety"
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  pathname === '/trust-and-safety' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                }`}
              >
                Trust & Safety
              </Link>

              {/* Role specific dynamic menus */}
              {user && (
                <>
                  <span className="text-zinc-700 mx-1">|</span>
                  {role === 'seeker' && (
                    <>
                      <Link
                        href="/my-bookings"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname.startsWith('/my-bookings') ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/dashboard' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
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
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/owner/dashboard' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        Owner Hub
                      </Link>
                      <Link
                        href="/owner/requests"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/owner/requests' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        Requests
                      </Link>
                      <Link
                        href="/owner/handovers"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/owner/handovers' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
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
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/institution' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        Institution Policy
                      </Link>
                      <Link
                        href="/incidents"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname.startsWith('/incidents') ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        Incidents
                      </Link>
                      <Link
                        href="/audit"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/audit' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        Audit Log
                      </Link>
                      <Link
                        href="/analytics"
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          pathname === '/analytics' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        Analytics
                      </Link>
                      {role === 'admin' && (
                        <Link
                          href="/admin"
                          className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            pathname === '/admin' ? 'text-[#C7FF55] bg-[#191F1B]' : 'text-zinc-300 hover:text-white'
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
          <div className="flex items-center gap-2.5">
            {/* AI Concierge Trigger */}
            <button
              onClick={() => setAiOpen(true)}
              className="px-3 py-1.5 rounded-md bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#C7FF55] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Concierge</span>
            </button>

            {/* List Resource Quick Link (for owners) */}
            {user && (role === 'owner' || role === 'institution_manager' || role === 'admin') && (
              <Link
                href="/owner/resources/new"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] transition-all"
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
                  className="p-2 rounded-md bg-[#131715] hover:bg-[#191F1B] border border-[#212824] text-zinc-300 relative transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C7FF55] text-black text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131715] border border-[#2F3933] rounded-lg shadow-2xl z-50 p-3">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#212824]">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#F4F5EF] font-bold">
                        Notifications ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllNotificationsRead}
                          className="text-[11px] text-[#C7FF55] hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-4 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded text-xs transition-colors border ${
                              n.is_read
                                ? 'bg-[#191F1B]/50 border-transparent text-zinc-400'
                                : 'bg-[#191F1B] border-[#2F3933] text-[#F4F5EF]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[11px] text-[#C7FF55] font-mono">{n.title}</span>
                              <span className="text-[10px] text-zinc-500">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed mb-1">{n.message}</p>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => setNotificationsOpen(false)}
                                className="text-[10px] text-[#C7FF55] underline hover:opacity-80 block"
                              >
                                View Details &rarr;
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
                className="flex items-center gap-2 p-1 pl-2 rounded-md bg-[#131715] hover:bg-[#191F1B] border border-[#212824] transition-colors"
              >
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-medium text-[#F4F5EF] leading-tight">{user.full_name}</span>
                  <span className="text-[10px] font-mono uppercase text-[#A0A69F]">{user.role}</span>
                </div>
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="w-7 h-7 rounded object-cover border border-[#2F3933]"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-md bg-[#C7FF55] text-[#171A17] font-semibold text-xs transition-colors hover:bg-[#b5f23d]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-md bg-[#131715] border border-[#212824] text-zinc-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#131715] border-b border-[#212824] px-4 py-3 space-y-2">
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
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-[#C7FF55]"
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
