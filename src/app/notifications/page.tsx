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
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF55]">
              Real-Time Alert Feed
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5EF] mt-1">
              Notifications Center
            </h1>
          </div>

          <button
            onClick={handleMarkAll}
            className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#F4F5EF] flex items-center gap-1.5 self-start"
          >
            <Check className="w-3.5 h-3.5 text-[#C7FF55]" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs">
            Loading notifications stream...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs bg-[#131715] border border-[#212824] rounded-xl">
            You have no notifications on file.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  n.is_read
                    ? 'bg-[#131715] border-[#212824] text-zinc-400'
                    : 'bg-[#191F1B] border-[#2F3933] text-[#F4F5EF]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#C7FF55]">{n.title}</span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#C7FF55]" />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-300">{n.message}</p>
                  <span className="text-[10px] text-zinc-500 font-mono block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    className="px-3 py-1.5 rounded bg-[#0B0D0C] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#C7FF55] flex items-center gap-1 shrink-0 self-start sm:self-center"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
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
