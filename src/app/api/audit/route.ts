import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getAuditEvents } from '@/lib/services/audit-service';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType') || undefined;
    const entityId = searchParams.get('entityId') || undefined;
    const actionType = searchParams.get('actionType') || undefined;
    const actorId = searchParams.get('actorId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // If seeker, only allow viewing audit events where actor is themselves or entity relates to them
    let filterActor = actorId;
    if (user.role === 'seeker') {
      filterActor = user.id;
    }

    const events = getAuditEvents({
      entityType,
      entityId,
      actionType,
      actorId: filterActor,
      limit,
      offset
    });

    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
