import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryOne } from '@/lib/db/database';
import { cancelBooking } from '@/lib/services/booking-service';

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

    const isSeeker = booking.user_id === user.id;
    const isOwner = booking.owner_id === user.id;
    const isManager = ['institution_manager', 'admin'].includes(user.role);

    if (!isSeeker && !isOwner && !isManager) {
      return NextResponse.json({ error: 'Forbidden: You cannot cancel this booking' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const reason = body.reason || (isSeeker ? 'Cancelled by user.' : 'Cancelled by resource custodian.');

    const result = cancelBooking(id, user.id, user.full_name, user.role, reason);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
