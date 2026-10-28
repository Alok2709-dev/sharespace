import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryAll, queryOne } from '@/lib/db/database';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Overview KPIs
    const totalResources = queryOne<{ c: number }>('SELECT count(*) as c FROM resources')?.c || 0;
    const activeResources = queryOne<{ c: number }>("SELECT count(*) as c FROM resources WHERE status = 'active'")?.c || 0;
    const totalBookings = queryOne<{ c: number }>('SELECT count(*) as c FROM bookings')?.c || 0;
    const activeBookings = queryOne<{ c: number }>("SELECT count(*) as c FROM bookings WHERE status IN ('approved', 'checked_in')")?.c || 0;
    const pendingBookings = queryOne<{ c: number }>("SELECT count(*) as c FROM bookings WHERE status = 'pending_approval'")?.c || 0;
    const waitlistedCount = queryOne<{ c: number }>("SELECT count(*) as c FROM waiting_list_entries WHERE status = 'active'")?.c || 0;
    const openIncidents = queryOne<{ c: number }>("SELECT count(*) as c FROM incidents WHERE status != 'resolved'")?.c || 0;
    const totalAuditEvents = queryOne<{ c: number }>('SELECT count(*) as c FROM audit_events')?.c || 0;

    // Category breakdown
    const categoryStats = queryAll<any>(`
      SELECT category, count(*) as count,
             (SELECT count(*) FROM bookings b JOIN resources r2 ON b.resource_id = r2.id WHERE r2.category = resources.category) as bookings_count
      FROM resources
      GROUP BY category
    `);

    // Top utilized resources
    const topResources = queryAll<any>(`
      SELECT r.id, r.title, r.category, count(b.id) as booking_count
      FROM resources r
      LEFT JOIN bookings b ON r.id = b.resource_id
      GROUP BY r.id
      ORDER BY booking_count DESC
      LIMIT 5
    `);

    // Booking Status Distribution
    const statusDistribution = queryAll<any>(`
      SELECT status, count(*) as count
      FROM bookings
      GROUP BY status
    `);

    return NextResponse.json({
      kpis: {
        totalResources,
        activeResources,
        totalBookings,
        activeBookings,
        pendingBookings,
        waitlistedCount,
        openIncidents,
        totalAuditEvents
      },
      categoryStats,
      topResources,
      statusDistribution
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
