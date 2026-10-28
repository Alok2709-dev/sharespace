import React from 'react';

export type StatusType =
  | 'pending_approval'
  | 'approved'
  | 'waitlisted'
  | 'checked_in'
  | 'return_pending_inspection'
  | 'returned'
  | 'rejected'
  | 'cancelled'
  | 'overdue'
  | 'incident_under_review'
  | 'closed'
  | 'active'
  | 'maintenance'
  | 'suspended'
  | 'verified'
  | 'pending'
  | 'expired'
  | 'open'
  | 'under_review'
  | 'resolved';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const norm = status.toLowerCase();

  let colors = 'bg-zinc-800 text-zinc-300 border-zinc-700';
  let label = status.replace(/_/g, ' ');

  if (['approved', 'returned', 'verified', 'active', 'passed', 'resolved'].includes(norm)) {
    colors = 'bg-[#12241A] text-[#78D9A0] border-[#224A33]';
  } else if (['pending_approval', 'pending', 'under_review', 'awaiting_information', 'return_pending_inspection'].includes(norm)) {
    colors = 'bg-[#292212] text-[#F0BE67] border-[#4E3E1C]';
  } else if (['waitlisted'].includes(norm)) {
    colors = 'bg-[#211E29] text-[#C0A8F8] border-[#42385C]';
  } else if (['checked_in'].includes(norm)) {
    colors = 'bg-[#182613] text-[#C7FF55] border-[#37541E]';
  } else if (['rejected', 'cancelled', 'overdue', 'incident_under_review', 'failed', 'suspended'].includes(norm)) {
    colors = 'bg-[#2E1413] text-[#F17D78] border-[#592624]';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-mono uppercase tracking-wider font-medium border rounded-md ${colors} ${sizeClasses} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
}
