'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle2, Clock, ArrowRight, Check } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAll() {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch {}
  }

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66F5] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
              Real-Time Feed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#20231F] mt-1.5">
              Notifications Center
            </h1>
          </div>

          <button
            onClick={handleMarkAll}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#EFE9DD] border border-[#EFE9DD] text-xs font-bold text-[#20231F] flex items-center gap-2 self-start shadow-sm transition-all"
          >
            <Check className="w-4 h-4 text-[#3B66F5]" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-400 font-medium text-sm">
            Loading notifications stream...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm bg-white border border-[#EFE9DD] rounded-2xl shadow-warm-md">
            You have no notifications on file.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  n.is_read
                    ? 'bg-white/80 border-[#EFE9DD] text-zinc-500'
                    : 'bg-white border-blue-200 text-[#20231F] ring-1 ring-blue-100'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#20231F]">{n.title}</span>
                    {!n.is_read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3B66F5]" />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600">{n.message}</p>
                  <span className="text-[11px] text-zinc-400 font-medium block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    className="px-4 py-2 rounded-xl bg-[#F7F5EF] hover:bg-[#3B66F5] hover:text-white border border-[#EFE9DD] text-xs font-bold text-[#20231F] flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-all"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
