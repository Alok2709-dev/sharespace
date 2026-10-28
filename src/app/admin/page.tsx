'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, UserCheck, AlertTriangle, Users, Database,
  Settings, CheckCircle2, Lock, ArrowLeft, Loader2
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit user state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('seeker');
  const [newStatus, setNewStatus] = useState('active');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const sessRes = await fetch('/api/auth/session');
      const sess = await sessRes.json();
      if (!sess.user) {
        router.push('/login');
        return;
      }
      if (sess.user.role !== 'admin') {
        router.push('/access-denied');
        return;
      }
      setCurrentUser(sess.user);

      const uRes = await fetch('/api/admin/users');
      const uData = await uRes.json();
      setUsers(uData.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdating(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: newRole,
          status: newStatus,
          suspensionReason
        })
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to update user');

      setSelectedUser(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-mono text-xs">
        Loading governance control console...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0D0C] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#2F3933] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider">
              Root Security & Compliance Authority
            </span>
            <h1 className="text-2xl font-bold text-[#F4F5EF]">
              Platform Administration Console
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Administrator: {currentUser?.full_name} • Server Node: Node.js 24 Native Engine
            </p>
          </div>

          <Link
            href="/audit"
            className="px-4 py-2 rounded-lg bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-[#C7FF55] self-start"
          >
            Review Security Audit Trail &rarr;
          </Link>
        </div>

        {/* Users Management Table */}
        <div className="p-6 rounded-xl bg-[#131715] border border-[#212824] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#212824]">
            <h2 className="text-sm font-bold text-[#F4F5EF] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C7FF55]" />
              <span>Institutional Member Accounts ({users.length})</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              Role-Based Access Control (RBAC)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#191F1B] border-b border-[#212824] text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#191F1B]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#191F1B]/40">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#F4F5EF]">{u.full_name}</div>
                      <div className="text-[11px] text-zinc-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#C7FF55]/10 text-[#C7FF55] border border-[#C7FF55]/20 font-bold uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {u.department}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={u.status} size="sm" />
                      {u.suspension_reason && (
                        <div className="text-[10px] text-red-400 truncate max-w-xs mt-0.5">
                          "{u.suspension_reason}"
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewRole(u.role);
                          setNewStatus(u.status);
                          setSuspensionReason(u.suspension_reason || '');
                        }}
                        className="px-3 py-1 rounded bg-[#191F1B] hover:bg-[#232B26] border border-[#2F3933] text-xs font-mono text-zinc-300 hover:text-white"
                      >
                        Modify Privileges
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modify User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131715] border border-[#2F3933] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F4F5EF]">
              Modify Member Privileges
            </h3>
            <p className="text-xs text-zinc-400">
              {selectedUser.full_name} ({selectedUser.email})
            </p>

            {error && (
              <div className="p-2 text-xs bg-red-950/40 border border-red-800 text-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                >
                  <option value="seeker">Resource Seeker</option>
                  <option value="owner">Resource Owner / Custodian</option>
                  <option value="institution_manager">Institution Manager</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Account Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-[#2F3933] text-xs text-[#F4F5EF]"
                >
                  <option value="active">Active</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="suspended">Suspended (Access Revoked)</option>
                </select>
              </div>

              {newStatus === 'suspended' && (
                <div>
                  <label className="block text-[11px] font-mono uppercase text-red-400 mb-1">
                    Recorded Reason for Suspension *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={suspensionReason}
                    onChange={e => setSuspensionReason(e.target.value)}
                    placeholder="Document violation or safety breach reason..."
                    className="w-full px-3 py-2 rounded bg-[#0B0D0C] border border-red-900 text-xs text-[#F4F5EF]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded bg-[#C7FF55] text-[#171A17] font-bold text-xs hover:bg-[#b5f23d]"
                >
                  {updating ? 'Saving...' : 'Confirm & Log Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
