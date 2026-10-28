import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryOne } from '@/lib/db/database';
import { decideBooking } from '@/lib/services/booking-service';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const booking = queryOne<any>(`
      SELECT b.*, r.owner_id
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      WHERE b.id = ?
    `, [id]);

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Authorization: User must be resource owner or institution manager/admin
    const isOwner = booking.owner_id === user.id;
    const isManager = ['institution_manager', 'admin'].includes(user.role);

    if (!isOwner && !isManager) {
      return NextResponse.json({
        error: 'Forbidden: You cannot decide booking requests for resources you do not own.'
      }, { status: 403 });
    }

    // Seeker cannot approve their own booking even if they are somehow an owner of another resource!
    if (booking.user_id === user.id && !['institution_manager', 'admin'].includes(user.role)) {
      return NextResponse.json({
        error: 'Conflict of interest: You cannot approve or reject your own booking request.'
      }, { status: 403 });
    }

    const body = await req.json();
    const { decision, reason } = body;

    if (!decision || !['approve', 'reject'].includes(decision)) {
      return NextResponse.json({ error: "Decision must be 'approve' or 'reject'" }, { status: 400 });
    }

    const result = decideBooking({
      bookingId: id,
      decision,
      reason: reason || (decision === 'approve' ? 'Approved by resource custodian.' : 'Request declined.'),
      decidedBy: user.id,
      deciderName: user.full_name,
      deciderRole: user.role
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
