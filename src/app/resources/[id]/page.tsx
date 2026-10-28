'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Clock, ShieldCheck, ShieldAlert, AlertTriangle,
  Calendar, CheckCircle2, User, ChevronRight, Layers,
  FileText, Info, ArrowLeft, Edit3, Sparkles, Cpu, Check
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { BookingModal } from '@/components/resources/BookingModal';
import { TiltCard } from '@/components/ui/TiltCard';

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    fetchResourceDetails();
    fetchSession();
  }, [id]);

  async function fetchSession() {
    try {
      const res = await fetch('/api/auth/session');
      const d = await res.json();
      setCurrentUser(d.user);
    } catch {}
  }

  async function fetchResourceDetails() {
    setLoading(true);
    try {
      const res = await fetch(`/api/resources/${id}`);
      if (!res.ok) throw new Error('Resource not found');
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3 text-zinc-500 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-[#C7FF55] border-t-transparent animate-spin" />
        <span>Loading institutional asset specifications...</span>
      </div>
    );
  }

  if (!data || !data.resource) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F4F5EF]">Resource Not Found</h2>
        <p className="text-xs text-zinc-400">The requested resource could not be found or has been decommissioned.</p>
        <Link href="/resources" className="px-5 py-2.5 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-xs">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const { resource, requirements, reservedSlots, userEligibility } = data;
  const isOwner = currentUser?.id === resource.owner_id;
  const isManager = ['institution_manager', 'admin'].includes(currentUser?.role);

  return (
    <div className="flex-1 bg-[#080908] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link href="/resources" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Marketplace</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-500 uppercase">{resource.category}</span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-[#C7FF55] truncate max-w-xs font-semibold">{resource.title}</span>
          </div>

          {(isOwner || isManager) && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#151D18] border border-[#26352A] text-[10px] font-mono uppercase text-[#C7FF55]">
                {isOwner ? 'Resource Custodian' : 'Institutional Oversight'}
              </span>
              <Link
                href={`/owner/resources/${resource.id}/edit`}
                className="px-3.5 py-1.5 rounded-xl bg-[#151B17] hover:bg-[#1E2621] border border-[#253229] text-xs font-mono text-[#F4F5EF] flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3 h-3 text-[#C7FF55]" />
                <span>Edit Configuration</span>
              </Link>
            </div>
          )}
        </div>

        {/* Main Resource Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery & Description */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Gallery with 3D Depth Card */}
            <div className="rounded-3xl bg-[#111613] border border-[#202C23] overflow-hidden space-y-3 p-3 shadow-xl">
              <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-[#080908]">
                <img
                  src={resource.images[activeImageIdx] || resource.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'}
                  alt={resource.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111613] via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 left-4">
                  <StatusBadge status={resource.status} />
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#080908]/90 backdrop-blur-md border border-[#253228] text-xs font-mono text-[#C7FF55]">
                    {resource.institution_name}
                  </span>
                </div>
              </div>

              {resource.images.length > 1 && (
                <div className="flex items-center gap-2.5 px-1 pb-1 overflow-x-auto">
                  {resource.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIdx === idx ? 'border-[#C7FF55] scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Overview */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C7FF55] uppercase font-semibold">
                  <span>{resource.category}</span>
                  <span>•</span>
                  <span>{resource.resource_type}</span>
                </div>
                <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-[#F4F5EF] leading-snug">
                  {resource.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1 font-mono">
                  <MapPin className="w-4 h-4 text-[#C7FF55]" />
                  <span>{resource.location}</span>
                  <span>•</span>
                  <span>Managed by {resource.institution_name}</span>
                </div>
              </div>

              <div className="border-t border-[#1C251F] pt-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2">
                  Technical Specifications & Research Scope
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                  {resource.description}
                </p>
              </div>

              {/* Usage & Safety Protocols in Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1C251F]">
                <div className="p-4 rounded-2xl bg-[#0B0F0D] border border-[#1E2721] space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-[#C7FF55] font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Operating Guidelines
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {resource.usage_instructions || 'Follow certified laboratory handbook. All specimens must be logged before startup.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0F0D] border border-[#1E2721] space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-[#F0BE67] font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Safety & PPE Requirements
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {resource.safety_instructions || 'Safety glasses, lab coat, and closed-toe shoes required within perimeter.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Prerequisite Eligibility Check Section */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C7FF55]" />
                    <span>Prerequisite Training & Qualification Standards</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Mandatory institutional qualifications required prior to access authorization.
                  </p>
                </div>
                {userEligibility && (
                  <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase font-bold border shrink-0 ${
                    userEligibility.isEligible
                      ? 'bg-[#12241A] text-[#78D9A0] border-[#224A33]'
                      : 'bg-[#2E1413] text-[#F17D78] border-[#592624]'
                  }`}>
                    {userEligibility.isEligible ? 'Eligible to Book' : 'Prerequisites Missing'}
                  </span>
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                {requirements.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-2">No special qualifications required. Open to authorized institutional members.</p>
                ) : (
                  requirements.map((req: any) => {
                    const statusRecord = userEligibility?.requirements?.find((r: any) => r.id === req.id);
                    const isVerified = statusRecord?.status === 'verified';

                    return (
                      <div
                        key={req.id}
                        className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                          isVerified ? 'bg-[#12241A]/40 border-[#224A33]' : 'bg-[#0B0F0D] border-[#1E2721]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#F4F5EF]">{req.title}</span>
                            <span className="text-[10px] font-mono uppercase text-zinc-500">
                              [{req.requirement_type}]
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">{req.description}</p>
                        </div>

                        <div className="shrink-0 text-right">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#78D9A0] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F0BE67] font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Reserved Intervals & Schedule Transparency */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#202C23] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F4F5EF] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C7FF55]" />
                    <span>Live Booking Schedule & Reserved Slots</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Active reservations recorded in the database ledger. Overlapping requests can enter the FIFO queue.
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {reservedSlots.length} active reservation(s)
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {reservedSlots.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3 text-center">No conflicting reservations on record. Open calendar availability.</p>
                ) : (
                  reservedSlots.map((slot: any) => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-xl bg-[#0B0F0D] border border-[#1E2721] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#F0BE67]" />
                        <span className="text-zinc-300">
                          {slot.start_time} &rarr; {slot.end_time}
                        </span>
                      </div>
                      <span className="text-zinc-500 font-semibold">{slot.booking_reference}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Custodian Info & Action Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Booking Action Card */}
            <div className="p-7 rounded-3xl bg-[#111613] border border-[#27352B] space-y-6 sticky top-24 shadow-2xl">
              <div className="space-y-1 pb-4 border-b border-[#1C251F]">
                <span className="text-[10px] font-mono uppercase text-[#C7FF55] tracking-wider font-semibold">
                  Institutional Access Allocation
                </span>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-3xl font-extrabold text-[#F4F5EF] font-mono">
                    {resource.deposit_amount > 0 ? `$${resource.deposit_amount}` : 'Free Access'}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {resource.deposit_amount > 0 ? 'Refundable Security Deposit' : 'Core Research Grant'}
                  </span>
                </div>
              </div>

              {/* Resource Configuration Specs */}
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-1.5 border-b border-[#172019]">
                  <span className="text-zinc-500">Operating Hours</span>
                  <span className="text-zinc-300 font-medium">
                    {resource.operating_hours?.start} - {resource.operating_hours?.end}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#172019]">
                  <span className="text-zinc-500">Duration Range</span>
                  <span className="text-zinc-300 font-medium">
                    {resource.min_duration_minutes}m to {resource.max_duration_minutes}m
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#172019]">
                  <span className="text-zinc-500">Advance Lead Time</span>
                  <span className="text-zinc-300 font-medium">{resource.lead_time_hours} hours min</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#172019]">
                  <span className="text-zinc-500">Max Capacity</span>
                  <span className="text-zinc-300 font-medium">{resource.max_capacity} operator(s)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#172019]">
                  <span className="text-zinc-500">Supervision Required</span>
                  <span className={resource.supervision_required ? 'text-[#F0BE67] font-semibold' : 'text-[#78D9A0] font-semibold'}>
                    {resource.supervision_required ? 'Yes (Staff Mandatory)' : 'No (Autonomous)'}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={() => setBookingModalOpen(true)}
                  disabled={resource.status !== 'active'}
                  className="w-full py-4 rounded-xl bg-[#C7FF55] text-[#080908] font-bold text-sm hover:bg-[#b5f23d] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(199,255,85,0.25)] hover:shadow-[0_0_30px_rgba(199,255,85,0.4)] active:scale-98"
                >
                  {resource.status === 'active' ? 'Request Reservation' : `Unavailable (${resource.status})`}
                </button>
                <p className="text-[11px] text-zinc-500 text-center mt-2.5 leading-tight font-mono">
                  Two-party handover inspection required at checkout & return.
                </p>
              </div>

              {/* Custodian Profile Card */}
              <div className="pt-4 border-t border-[#1C251F] space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                  Resource Custodian & Approver
                </span>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0E1310] border border-[#1E2621]">
                  <img
                    src={resource.owner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                    alt={resource.owner_name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#27352B]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#F4F5EF]">{resource.owner_name}</h4>
                    <p className="text-[11px] text-zinc-400 font-mono">{resource.owner_email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        resource={resource}
        userEligibility={userEligibility}
        onSuccess={() => {
          fetchResourceDetails();
        }}
      />
    </div>
  );
}
