'use client';

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

  let colors = 'bg-stone-100 text-stone-700 border-stone-200';
  let dotColor = 'bg-stone-500';
  let label = status.replace(/_/g, ' ');

  if (['approved', 'returned', 'verified', 'active', 'passed', 'resolved'].includes(norm)) {
    colors = 'bg-[#EDFBF3] text-[#1E7E49] border-[#B7ECCB]';
    dotColor = 'bg-[#2EBF71]';
  } else if (['pending_approval', 'pending', 'under_review', 'awaiting_information', 'return_pending_inspection'].includes(norm)) {
    colors = 'bg-[#FFF8E6] text-[#A36200] border-[#FCE2A1]';
    dotColor = 'bg-[#F59E0B]';
  } else if (['waitlisted'].includes(norm)) {
    colors = 'bg-[#F3EFFF] text-[#6941C6] border-[#D9C8FF]';
    dotColor = 'bg-[#8A63D2]';
  } else if (['checked_in'].includes(norm)) {
    colors = 'bg-[#EEF4FF] text-[#2950C4] border-[#BDD5FF]';
    dotColor = 'bg-[#3B66F5]';
  } else if (['rejected', 'cancelled', 'overdue', 'incident_under_review', 'failed', 'suspended'].includes(norm)) {
    colors = 'bg-[#FFF0F0] text-[#C92A2A] border-[#FDC2C2]';
    dotColor = 'bg-[#EF4444]';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-sans capitalize font-semibold border rounded-full shadow-xs ${colors} ${sizeClasses} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
}
