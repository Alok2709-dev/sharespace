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
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500 font-medium text-sm">
        Loading governance control console...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F7F5EF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase text-[#3B66F5] tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
              Root Security & Compliance Authority
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#20231F] tracking-tight">
              Platform Administration Console
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Administrator: {currentUser?.full_name} • Server Node: Node.js Native Engine
            </p>
          </div>

          <Link
            href="/audit"
            className="px-5 py-2.5 rounded-2xl bg-[#20231F] hover:bg-[#3B66F5] text-white text-xs font-bold transition-all shadow-sm self-start sm:self-center"
          >
            Review Security Audit Trail &rarr;
          </Link>
        </div>

        {/* Users Management Table */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE9DD] shadow-warm-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DD]">
            <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3B66F5]" />
              <span>Institutional Member Accounts ({users.length})</span>
            </h2>
            <span className="text-xs font-bold text-zinc-500 bg-[#F7F5EF] px-3 py-1 rounded-full border border-[#EFE9DD]">
              Role-Based Access Control (RBAC)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] border-b border-[#EFE9DD] text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DD]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#20231F]">{u.full_name}</div>
                      <div className="text-[11px] text-zinc-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3B66F5] border border-blue-100 font-bold uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 font-medium">
                      {u.department}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={u.status} size="sm" />
                      {u.suspension_reason && (
                        <div className="text-[10px] text-rose-600 truncate max-w-xs mt-0.5">
                          "{u.suspension_reason}"
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewRole(u.role);
                          setNewStatus(u.status);
                          setSuspensionReason(u.suspension_reason || '');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#F7F5EF] hover:bg-[#3B66F5] hover:text-white border border-[#EFE9DD] text-xs font-bold text-zinc-700 transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20231F]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#EFE9DD] rounded-3xl p-7 shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-black text-[#20231F]">
                Modify Member Privileges
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {selectedUser.full_name} ({selectedUser.email})
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
                >
                  <option value="seeker">Resource Seeker</option>
                  <option value="owner">Resource Owner / Custodian</option>
                  <option value="institution_manager">Institution Manager</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Account Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#EFE9DD] text-xs font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#3B66F5]"
                >
                  <option value="active">Active</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="suspended">Suspended (Access Revoked)</option>
                </select>
              </div>

              {newStatus === 'suspended' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-rose-600 mb-1.5">
                    Recorded Reason for Suspension *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={suspensionReason}
                    onChange={e => setSuspensionReason(e.target.value)}
                    placeholder="Document violation or safety breach reason..."
                    className="w-full px-4 py-2.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-[#20231F] focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-[#20231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-[#3B66F5] text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all"
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
