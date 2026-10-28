import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { performCheckIn } from '@/lib/services/handover-service';
import { queryOne } from '@/lib/db/database';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = await req.json();
    const { bookingId, initialCondition, accessoriesIncluded, notes, imageUrls } = body;

    if (!bookingId || !initialCondition) {
      return NextResponse.json({ error: 'Booking ID and initial condition are required' }, { status: 400 });
    }

    // Verify authorized actor: owner of resource or manager/admin
    const booking = queryOne<any>(`
      SELECT b.*, r.owner_id
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      WHERE b.id = ?
    `, [bookingId]);

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const isOwner = booking.owner_id === user.id;
    const isManager = ['institution_manager', 'admin'].includes(user.role);
    if (!isOwner && !isManager) {
      return NextResponse.json({
        error: 'Forbidden: Only the resource custodian or institution manager can sign off on resource handover.'
      }, { status: 403 });
    }

    const result = performCheckIn({
      bookingId,
      conductedBy: user.id,
      conductorName: user.full_name,
      conductorRole: user.role,
      initialCondition,
      accessoriesIncluded: accessoriesIncluded || [],
      notes,
      imageUrls: imageUrls || []
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
