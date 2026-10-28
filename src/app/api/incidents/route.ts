import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getIncidentList, reportIncident } from '@/lib/services/incident-service';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resourceId') || undefined;
    const status = searchParams.get('status') || undefined;

    const incidents = getIncidentList({ resourceId, status });
    return NextResponse.json({ incidents });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = await req.json();
    const { resourceId, bookingId, category, severity, description, evidenceUrls } = body;

    if (!resourceId || !category || !description) {
      return NextResponse.json({ error: 'Resource, category, and description are required' }, { status: 400 });
    }

    const result = reportIncident({
      resourceId,
      bookingId,
      reporterId: user.id,
      reporterName: user.full_name,
      reporterRole: user.role,
      category,
      severity: severity || 'medium',
      description,
      evidenceUrls: evidenceUrls || []
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
