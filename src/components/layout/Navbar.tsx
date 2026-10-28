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
  ChevronRight,
  Share2
} from 'lucide-react';
import { AIConciergeModal } from '../ai/AIConciergeModal';
import { ThemeToggle } from './ThemeToggle';

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
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/92 backdrop-blur-xl border-b border-[#E7E1D3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF9466] to-[#4169E1] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-editorial font-extrabold tracking-tight text-xl text-[#20231F] group-hover:text-[#4169E1] transition-colors">
                    ShareSpace
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF5FF] text-[#4169E1] font-bold border border-[#BDD5FF]">
                    Campus
                  </span>
                </div>
                <span className="text-[10px] tracking-wide text-[#7C837C] font-sans font-medium">
                  Good stuff should get shared
                </span>
              </div>
            </Link>

            {/* Main Nav Links */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/70 border border-[#E7E1D3] shadow-xs">
              <Link
                href="/resources"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  pathname === '/resources'
                    ? 'text-white bg-[#4169E1] shadow-xs'
                    : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                }`}
              >
                Browse Items
              </Link>
              <Link
                href="/how-it-works"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  pathname === '/how-it-works'
                    ? 'text-white bg-[#4169E1] shadow-xs'
                    : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                }`}
              >
                How It Works
              </Link>
              <Link
                href="/trust-and-safety"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  pathname === '/trust-and-safety'
                    ? 'text-white bg-[#4169E1] shadow-xs'
                    : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                }`}
              >
                Trust & Safety
              </Link>

              {/* Dynamic Role Links */}
              {user && (
                <>
                  <span className="text-stone-300 px-1 font-sans text-xs">|</span>
                  {role === 'seeker' && (
                    <>
                      <Link
                        href="/my-bookings"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname.startsWith('/my-bookings')
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/dashboard'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
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
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/owner/dashboard'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        Owner Hub
                      </Link>
                      <Link
                        href="/owner/requests"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/owner/requests'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        Requests
                      </Link>
                      <Link
                        href="/owner/handovers"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/owner/handovers'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
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
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/institution'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        Policies
                      </Link>
                      <Link
                        href="/incidents"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname.startsWith('/incidents')
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        Incidents
                      </Link>
                      <Link
                        href="/audit"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/audit'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        Audit
                      </Link>
                      <Link
                        href="/analytics"
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          pathname === '/analytics'
                            ? 'text-white bg-[#4169E1] shadow-xs'
                            : 'text-[#555B53] hover:text-[#20231F] hover:bg-[#EFE9DD]'
                        }`}
                      >
                        Analytics
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Theme Toggle */}
            <ThemeToggle />

            {/* Friendly AI Assistant Button */}
            <button
              onClick={() => setAiOpen(true)}
              className="relative px-3.5 py-2 rounded-full bg-[#F4EFFF] border border-[#D9C8FF] text-xs font-semibold text-[#6941C6] flex items-center gap-2 transition-all hover:bg-[#ECE4FF] hover:shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8A63D2]" />
              <span className="hidden sm:inline">Ask AI Assistant</span>
            </button>

            {/* List Resource (for owners/managers) */}
            {user && (role === 'owner' || role === 'institution_manager' || role === 'admin') && (
              <Link
                href="/owner/resources/new"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF0E8] hover:bg-[#FFE3D4] border border-[#FFD2BC] text-xs font-semibold text-[#D9531E] transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#FF7A45]" />
                <span>Share Something</span>
              </Link>
            )}

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#E7E1D3] text-[#555B53] relative transition-all active:scale-95 shadow-xs"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF7A45] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-sans shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#E7E1D3] rounded-3xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EFE9DD]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4169E1]" />
                        <span className="font-sans text-xs uppercase tracking-wider text-[#20231F] font-bold">
                          Notifications ({notifications.length})
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllNotificationsRead}
                          className="text-[11px] text-[#4169E1] hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#7C837C] py-6 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-2xl text-xs transition-all border ${
                              n.is_read
                                ? 'bg-[#F7F5EF] border-transparent text-[#7C837C]'
                                : 'bg-[#EFF5FF] border-[#BDD5FF] text-[#20231F]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[11px] text-[#4169E1]">{n.title}</span>
                              <span className="text-[10px] text-[#7C837C]">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed mb-2 text-[#555B53]">{n.message}</p>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => setNotificationsOpen(false)}
                                className="text-[10px] text-[#4169E1] font-semibold underline inline-flex items-center gap-1"
                              >
                                <span>View Details</span>
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
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#E7E1D3] transition-all shadow-xs"
              >
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-bold text-[#20231F] leading-tight">{user.full_name}</span>
                  <span className="text-[10px] font-sans text-[#7C837C] capitalize">{user.role}</span>
                </div>
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-[#DFD8C6]"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-[#555B53] hover:text-[#20231F] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-[#4169E1] text-white font-bold text-xs transition-all hover:bg-[#3459c9] shadow-xs active:scale-95"
                >
                  Join ShareSpace
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-full bg-white border border-[#E7E1D3] text-[#20231F] active:scale-95"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F7F5EF] border-b border-[#E7E1D3] px-5 py-4 space-y-2.5">
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#20231F]"
            >
              Browse Items
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#555B53] hover:text-[#20231F]"
            >
              How It Works
            </Link>
            <Link
              href="/trust-and-safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#555B53] hover:text-[#20231F]"
            >
              Trust & Safety
            </Link>

            <div className="pt-2 border-t border-[#E7E1D3] flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-[#555B53]">Theme Mode</span>
              <ThemeToggle />
            </div>
            {user && (
              <>
                <div className="pt-2 border-t border-[#E7E1D3]" />
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-[#4169E1] font-bold"
                >
                  My Bookings
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-[#555B53]"
                >
                  Dashboard
                </Link>
                {(role === 'owner' || role === 'institution_manager' || role === 'admin') && (
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-semibold text-[#555B53]"
                  >
                    Owner Hub
                  </Link>
                )}
                {(role === 'institution_manager' || role === 'admin') && (
                  <>
                    <Link
                      href="/institution"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm font-semibold text-[#555B53]"
                    >
                      Institution Oversight
                    </Link>
                    <Link
                      href="/audit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm font-semibold text-[#555B53]"
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
