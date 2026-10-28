import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryOne, queryAll } from '@/lib/db/database';
import { getBookingHandoverDetails } from '@/lib/services/handover-service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const booking = queryOne<any>(`
      SELECT b.*, r.title as resource_title, r.category as resource_category,
             r.location as resource_location, r.images as resource_images,
             r.operating_hours, r.deposit_amount, r.owner_id,
             owner.full_name as owner_name, owner.email as owner_email,
             seeker.full_name as seeker_name, seeker.email as seeker_email,
             seeker.department as seeker_department,
             decider.full_name as decider_name,
             wl.position as waitlist_position, wl.explanation as waitlist_explanation
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      JOIN users owner ON r.owner_id = owner.id
      JOIN users seeker ON b.user_id = seeker.id
      LEFT JOIN users decider ON b.decided_by = decider.id
      LEFT JOIN waiting_list_entries wl ON b.id = wl.booking_id AND wl.status = 'active'
      WHERE b.id = ?
    `, [id]);

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Authorization check: Seeker, Owner, or Institutional Managers/Admins only
    const isSeeker = booking.user_id === user.id;
    const isOwner = booking.owner_id === user.id;
    const isManager = ['institution_manager', 'admin'].includes(user.role);
    if (!isSeeker && !isOwner && !isManager) {
      return NextResponse.json({ error: 'Forbidden: You are not authorized to view this booking' }, { status: 403 });
    }

    const handovers = getBookingHandoverDetails(booking.id);

    // Audit trail related to this booking
    const auditEvents = queryAll<any>(`
      SELECT * FROM audit_events
      WHERE entity_type = 'booking' AND entity_id = ?
      ORDER BY created_at ASC
    `, [booking.id]);

    // Related incidents
    const incidents = queryAll<any>(`
      SELECT * FROM incidents WHERE booking_id = ? ORDER BY created_at DESC
    `, [booking.id]);

    return NextResponse.json({
      booking: {
        ...booking,
        resource_images: JSON.parse(booking.resource_images || '[]'),
        operating_hours: JSON.parse(booking.operating_hours || '{}')
      },
      handovers,
      auditEvents,
      incidents
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
