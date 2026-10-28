import { NextResponse } from 'next/server';
import { getDatabase, queryOne } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDatabase();
    const userCount = queryOne<{ c: number }>('SELECT count(*) as c FROM users');
    const resourceCount = queryOne<{ c: number }>('SELECT count(*) as c FROM resources');
    const bookingCount = queryOne<{ c: number }>('SELECT count(*) as c FROM bookings');

    return NextResponse.json({
      status: 'healthy',
      platform: 'SHARESPACE Core v1.0.0',
      database: 'SQLite (Native WAL Engine)',
      metrics: {
        users: userCount?.c || 0,
        resources: resourceCount?.c || 0,
        bookings: bookingCount?.c || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
