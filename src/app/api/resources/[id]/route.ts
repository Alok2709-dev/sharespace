import { NextRequest, NextResponse } from 'next/server';
import { queryOne, queryAll, execute } from '@/lib/db/database';
import { getCurrentUser } from '@/lib/auth/session';
import { checkUserResourceEligibility } from '@/lib/services/eligibility-service';
import { recordAuditEvent } from '@/lib/services/audit-service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    // Support lookup by either ID or Slug
    const resource = queryOne<any>(`
      SELECT r.*, u.full_name as owner_name, u.email as owner_email, u.avatar_url as owner_avatar,
             i.name as institution_name, i.location as institution_location
      FROM resources r
      JOIN users u ON r.owner_id = u.id
      JOIN institutions i ON r.institution_id = i.id
      WHERE r.id = ? OR r.slug = ?
    `, [id, id]);

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Requirements
    const requirements = queryAll<any>(`
      SELECT * FROM eligibility_requirements WHERE resource_id = ?
    `, [resource.id]);

    // Active reserved intervals for calendar
    const reservedSlots = queryAll<any>(`
      SELECT id, booking_reference, start_time, end_time, status
      FROM bookings
      WHERE resource_id = ? AND status IN ('approved', 'checked_in')
      ORDER BY start_time ASC
    `, [resource.id]);

    // User eligibility check if logged in
    let userEligibility = null;
    if (user) {
      userEligibility = checkUserResourceEligibility(user.id, resource.id);
    }

    return NextResponse.json({
      resource: {
        ...resource,
        images: JSON.parse(resource.images || '[]'),
        operating_hours: JSON.parse(resource.operating_hours || '{}')
      },
      requirements,
      reservedSlots,
      userEligibility
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const resource = queryOne<any>('SELECT * FROM resources WHERE id = ?', [id]);
    if (!resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

    // Authorization check
    const isOwner = resource.owner_id === user.id;
    const isManager = ['institution_manager', 'admin'].includes(user.role);
    if (!isOwner && !isManager) {
      return NextResponse.json({ error: 'Forbidden: You are not authorized to edit this resource' }, { status: 403 });
    }

    const body = await req.json();
    const { status, suspension_reason, operating_hours, deposit_amount, min_duration_minutes, max_duration_minutes } = body;

    const prevState = resource.status;
    let nextState = resource.status;

    if (status && ['active', 'maintenance', 'suspended', 'retired'].includes(status)) {
      nextState = status;
    }

    execute(`
      UPDATE resources
      SET status = ?, operating_hours = ?, deposit_amount = ?,
          min_duration_minutes = ?, max_duration_minutes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      nextState,
      operating_hours ? JSON.stringify(operating_hours) : resource.operating_hours,
      deposit_amount !== undefined ? deposit_amount : resource.deposit_amount,
      min_duration_minutes || resource.min_duration_minutes,
      max_duration_minutes || resource.max_duration_minutes,
      id
    ]);

    recordAuditEvent({
      actorId: user.id,
      actorName: user.full_name,
      actorRole: user.role,
      actionType: 'RESOURCE_UPDATED',
      entityType: 'resource',
      entityId: id,
      prevState,
      newState: nextState,
      decisionReason: suspension_reason || 'Resource configuration updated by custodian',
      metadata: { title: resource.title, new_status: nextState }
    });

    return NextResponse.json({ success: true, status: nextState });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
