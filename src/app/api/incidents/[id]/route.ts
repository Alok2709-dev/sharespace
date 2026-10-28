import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryOne } from '@/lib/db/database';
import { updateIncidentStatus } from '@/lib/services/incident-service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const incident = queryOne<any>(`
      SELECT inc.*, r.title as resource_title, r.location as resource_location,
             u.full_name as reporter_name, u.email as reporter_email,
             rev.full_name as reviewer_name,
             b.booking_reference, b.start_time, b.end_time
      FROM incidents inc
      JOIN resources r ON inc.resource_id = r.id
      JOIN users u ON inc.reporter_id = u.id
      LEFT JOIN users rev ON inc.assigned_to = rev.id
      LEFT JOIN bookings b ON inc.booking_id = b.id
      WHERE inc.id = ?
    `, [id]);

    if (!incident) return NextResponse.json({ error: 'Incident not found' }, { status: 404 });

    return NextResponse.json({
      incident: {
        ...incident,
        evidence_urls: JSON.parse(incident.evidence_urls || '[]')
      }
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

    if (!['owner', 'institution_manager', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Only managers and owners can update incident review status' }, { status: 403 });
    }

    const body = await req.json();
    const { status, resolutionNotes } = body;

    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

    const result = updateIncidentStatus({
      incidentId: id,
      status,
      reviewerId: user.id,
      reviewerName: user.full_name,
      reviewerRole: user.role,
      resolutionNotes
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
