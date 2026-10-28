import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryAll, queryOne } from '@/lib/db/database';
import { createBookingRequest } from '@/lib/services/booking-service';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'seeker'; // 'seeker', 'owner', 'all'
    const status = searchParams.get('status');

    let sql = `
      SELECT b.*, r.title as resource_title, r.category as resource_category,
             r.location as resource_location, r.images as resource_images,
             r.owner_id, owner.full_name as owner_name, seeker.full_name as seeker_name,
             seeker.email as seeker_email, seeker.department as seeker_department,
             wl.position as waitlist_position, wl.explanation as waitlist_explanation
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      JOIN users owner ON r.owner_id = owner.id
      JOIN users seeker ON b.user_id = seeker.id
      LEFT JOIN waiting_list_entries wl ON b.id = wl.booking_id AND wl.status = 'active'
      WHERE 1=1
    `;
    const params: any[] = [];

    if (scope === 'owner') {
      if (!['owner', 'institution_manager', 'admin'].includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (user.role === 'owner') {
        sql += ' AND r.owner_id = ?';
        params.push(user.id);
      }
    } else if (scope === 'all') {
      if (!['institution_manager', 'admin'].includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      // Default: Seeker's own bookings
      sql += ' AND b.user_id = ?';
      params.push(user.id);
    }

    if (status) {
      sql += ' AND b.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY b.created_at DESC';

    const bookings = queryAll<any>(sql, params);
    const formatted = bookings.map(b => ({
      ...b,
      resource_images: JSON.parse(b.resource_images || '[]')
    }));

    return NextResponse.json({ bookings: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = await req.json();
    const { resourceId, purpose, projectName, startTime, endTime, joinWaitlistIfConflict } = body;

    if (!resourceId || !purpose || !startTime || !endTime) {
      return NextResponse.json({ error: 'Resource, purpose, start time, and end time are required' }, { status: 400 });
    }

    const result = createBookingRequest({
      resourceId,
      userId: user.id,
      userName: user.full_name,
      userRole: user.role,
      purpose,
      projectName,
      startTime,
      endTime,
      joinWaitlistIfConflict: !!joinWaitlistIfConflict
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
