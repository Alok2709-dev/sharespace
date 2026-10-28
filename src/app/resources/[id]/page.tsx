'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Clock, ShieldCheck, ShieldAlert, AlertTriangle,
  Calendar, CheckCircle2, User, ChevronRight, Layers,
  FileText, Info, ArrowLeft, Edit3, Sparkles, Cpu, Check,
  Share2, Heart
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
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3 text-[#7C837C] font-sans text-xs">
        <div className="w-8 h-8 rounded-full border-3 border-[#4169E1] border-t-transparent animate-spin" />
        <span>Loading item details...</span>
      </div>
    );
  }

  if (!data || !data.resource) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4 bg-[#F7F5EF]">
        <h2 className="font-editorial text-2xl font-bold text-[#20231F]">Resource Not Found</h2>
        <p className="text-xs text-[#555B53]">The requested item could not be found or has been decommissioned.</p>
        <Link href="/resources" className="px-6 py-2.5 rounded-full bg-[#4169E1] text-white font-bold text-xs">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const { resource, requirements, reservedSlots, userEligibility } = data;
  const isOwner = currentUser?.id === resource.owner_id;
  const isManager = ['institution_manager', 'admin'].includes(currentUser?.role);

  return (
    <div className="flex-1 bg-[#F7F5EF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[#7C837C]">
            <Link href="/resources" className="hover:text-[#20231F] transition-colors flex items-center gap-1 font-bold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to items</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-300" />
            <span className="text-[#555B53]">{resource.category}</span>
            <ChevronRight className="w-3 h-3 text-stone-300" />
            <span className="text-[#20231F] font-bold truncate max-w-xs">{resource.title}</span>
          </div>

          {(isOwner || isManager) && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E7E1D3] text-[10px] font-bold uppercase text-[#4169E1]">
                {isOwner ? 'Resource Custodian' : 'Institutional Oversight'}
              </span>
              <Link
                href={`/owner/resources/${resource.id}/edit`}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-[#EFE9DD] border border-[#DCD5C4] text-xs font-semibold text-[#20231F] flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#4169E1]" />
                <span>Edit Configuration</span>
              </Link>
            </div>
          )}
        </div>

        {/* Main Resource Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery & Description */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-3xl bg-white border border-[#E7E1D3] overflow-hidden p-3 shadow-warm-md space-y-3">
              <div className="relative h-80 sm:h-[440px] w-full rounded-2xl overflow-hidden bg-[#FAF7F2]">
                <img
                  src={resource.images[activeImageIdx] || resource.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'}
                  alt={resource.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                <div className="absolute top-4 left-4">
                  <StatusBadge status={resource.status} />
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#20231F] shadow-xs">
                    📍 {resource.institution_name}
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
                        activeImageIdx === idx ? 'border-[#4169E1] scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Overview */}
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-5 shadow-warm-md">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4169E1] uppercase">
                  <span>{resource.category}</span>
                  <span>•</span>
                  <span>{resource.resource_type}</span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#20231F] leading-snug">
                  {resource.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-[#7C837C] pt-1 font-medium">
                  <MapPin className="w-4 h-4 text-[#FF7A45]" />
                  <span>{resource.location}</span>
                  <span>•</span>
                  <span>Managed by {resource.institution_name}</span>
                </div>
              </div>

              <div className="border-t border-[#EFE9DD] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C837C] mb-2">
                  About this resource & capabilities
                </h3>
                <p className="text-sm text-[#555B53] leading-relaxed whitespace-pre-line font-sans">
                  {resource.description}
                </p>
              </div>

              {/* Operating Guidelines in Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EFE9DD]">
                <div className="p-5 rounded-2xl bg-[#FFF8E6] border border-[#FCE2A1] space-y-1.5">
                  <span className="text-xs uppercase text-[#9A5B00] font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Operating Guidelines
                  </span>
                  <p className="text-xs text-[#7A4B00] leading-relaxed">
                    {resource.usage_instructions || 'Follow certified laboratory handbook. All specimens must be logged before startup.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFF0E8] border border-[#FFD2BC] space-y-1.5">
                  <span className="text-xs uppercase text-[#D9531E] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Safety & PPE Requirements
                  </span>
                  <p className="text-xs text-[#B53D10] leading-relaxed">
                    {resource.safety_instructions || 'Safety glasses, lab coat, and closed-toe shoes required within perimeter.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Prerequisite Training Section */}
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-5 shadow-warm-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#4169E1]" />
                    <span>Prerequisite Training & Qualification Standards</span>
                  </h3>
                  <p className="text-xs text-[#7C837C] mt-0.5">
                    Required institutional certifications prior to access authorization.
                  </p>
                </div>
                {userEligibility && (
                  <span className={`px-3.5 py-1 rounded-full text-xs font-bold border shrink-0 ${
                    userEligibility.isEligible
                      ? 'bg-[#EDFBF3] text-[#1E7E49] border-[#B7ECCB]'
                      : 'bg-[#FFF0F0] text-[#C92A2A] border-[#FDC2C2]'
                  }`}>
                    {userEligibility.isEligible ? 'Eligible to Book' : 'Prerequisites Missing'}
                  </span>
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                {requirements.length === 0 ? (
                  <p className="text-xs text-[#7C837C] py-2">No special qualifications required. Open to all authorized members.</p>
                ) : (
                  requirements.map((req: any) => {
                    const statusRecord = userEligibility?.requirements?.find((r: any) => r.id === req.id);
                    const isVerified = statusRecord?.status === 'verified';

                    return (
                      <div
                        key={req.id}
                        className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
                          isVerified ? 'bg-[#EDFBF3]/50 border-[#B7ECCB]' : 'bg-[#FAF7F2] border-[#E7E1D3]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#20231F]">{req.title}</span>
                            <span className="text-[10px] uppercase font-bold text-[#7C837C]">
                              [{req.requirement_type}]
                            </span>
                          </div>
                          <p className="text-xs text-[#555B53]">{req.description}</p>
                        </div>

                        <div className="shrink-0 text-right">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#1E7E49] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#A36200] font-bold">
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

            {/* Reserved Slots Calendar Transparency */}
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-4 shadow-warm-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#20231F] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#FF7A45]" />
                    <span>Existing Schedule & Reserved Slots</span>
                  </h3>
                  <p className="text-xs text-[#7C837C] mt-0.5">
                    If your desired slot is currently taken, you can join the transparent FIFO queue.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#7C837C]">
                  {reservedSlots.length} active reservation(s)
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {reservedSlots.length === 0 ? (
                  <p className="text-xs text-[#7C837C] py-3 text-center bg-[#FAF7F2] rounded-2xl border border-[#E7E1D3]">
                    No conflicting reservations. Open calendar availability!
                  </p>
                ) : (
                  reservedSlots.map((slot: any) => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        <span className="text-[#20231F] font-medium">
                          {slot.start_time} &rarr; {slot.end_time}
                        </span>
                      </div>
                      <span className="text-[#7C837C] font-mono text-[11px] font-semibold">{slot.booking_reference}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Custodian Info & Action Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Booking Action Card */}
            <div className="p-8 rounded-3xl bg-white border border-[#E7E1D3] space-y-6 sticky top-24 shadow-warm-xl">
              <div className="space-y-1 pb-4 border-b border-[#EFE9DD]">
                <span className="text-[11px] uppercase text-[#7C837C] font-bold tracking-wider">
                  Access Pricing
                </span>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-editorial text-3xl font-extrabold text-[#20231F]">
                    {resource.deposit_amount > 0 ? `₹${Number(resource.deposit_amount).toLocaleString('en-IN')}` : 'Free Access'}
                  </span>
                  <span className="text-xs text-[#7C837C] font-medium">
                    {resource.deposit_amount > 0 ? 'Refundable Deposit' : 'Campus Funded'}
                  </span>
                </div>
              </div>

              {/* Resource Configuration Specs */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#EFE9DD]">
                  <span className="text-[#7C837C]">Operating Hours</span>
                  <span className="text-[#20231F] font-bold">
                    {resource.operating_hours?.start} - {resource.operating_hours?.end}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#EFE9DD]">
                  <span className="text-[#7C837C]">Duration Limit</span>
                  <span className="text-[#20231F] font-bold">
                    {resource.min_duration_minutes}m to {resource.max_duration_minutes}m
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#EFE9DD]">
                  <span className="text-[#7C837C]">Advance Notice</span>
                  <span className="text-[#20231F] font-bold">{resource.lead_time_hours} hours min</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#EFE9DD]">
                  <span className="text-[#7C837C]">Max Capacity</span>
                  <span className="text-[#20231F] font-bold">{resource.max_capacity} operator(s)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#EFE9DD]">
                  <span className="text-[#7C837C]">Supervision</span>
                  <span className={resource.supervision_required ? 'text-[#D9531E] font-bold' : 'text-[#1E7E49] font-bold'}>
                    {resource.supervision_required ? 'Staff Supervised' : 'Autonomous'}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={() => setBookingModalOpen(true)}
                  disabled={resource.status !== 'active'}
                  className="w-full py-4 rounded-full bg-[#4169E1] text-white font-bold text-sm hover:bg-[#3256c9] transition-all disabled:opacity-50 shadow-color-cobalt active:scale-95"
                >
                  {resource.status === 'active' ? 'Request Reservation' : `Unavailable (${resource.status})`}
                </button>
                <p className="text-[11px] text-[#7C837C] text-center mt-2.5 leading-tight">
                  Two-party handover inspection required at checkout & return.
                </p>
              </div>

              {/* Custodian Profile Card */}
              <div className="pt-4 border-t border-[#EFE9DD] space-y-3">
                <span className="text-[11px] uppercase text-[#7C837C] tracking-wider font-bold">
                  Resource Custodian & Approver
                </span>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7E1D3]">
                  <img
                    src={resource.owner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                    alt={resource.owner_name}
                    className="w-11 h-11 rounded-full object-cover border border-[#DCD5C4]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#20231F]">{resource.owner_name}</h4>
                    <p className="text-[11px] text-[#7C837C]">{resource.owner_email}</p>
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
