import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryOne, queryAll, execute } from '@/lib/db/database';
import { recordAuditEvent } from '@/lib/services/audit-service';

export async function GET() {
  try {
    const institution = queryOne<any>('SELECT * FROM institutions LIMIT 1');
    if (!institution) return NextResponse.json({ error: 'Institution not found' }, { status: 404 });

    const members = queryAll<any>(`
      SELECT id, email, full_name, role, department, status, avatar_url
      FROM users
      WHERE institution_id = ?
      ORDER BY role ASC, full_name ASC
    `, [institution.id]);

    return NextResponse.json({
      institution: {
        ...institution,
        policy_settings: JSON.parse(institution.policy_settings || '{}')
      },
      members
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    if (!['institution_manager', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Only Institution Managers or Admins can configure institutional fair-use policies' }, { status: 403 });
    }

    const body = await req.json();
    const { policy_settings, description, location } = body;

    const currentInst = queryOne<any>('SELECT * FROM institutions LIMIT 1');
    if (!currentInst) return NextResponse.json({ error: 'Institution not found' }, { status: 404 });

    const updatedPolicy = policy_settings
      ? JSON.stringify({ ...JSON.parse(currentInst.policy_settings || '{}'), ...policy_settings })
      : currentInst.policy_settings;

    execute(`
      UPDATE institutions
      SET policy_settings = ?, description = ?, location = ?
      WHERE id = ?
    `, [updatedPolicy, description || currentInst.description, location || currentInst.location, currentInst.id]);

    recordAuditEvent({
      actorId: user.id,
      actorName: user.full_name,
      actorRole: user.role,
      actionType: 'INSTITUTION_POLICY_UPDATED',
      entityType: 'institution',
      entityId: currentInst.id,
      prevState: currentInst.policy_settings,
      newState: updatedPolicy,
      decisionReason: 'Institutional fair-use policy updated by oversight manager',
      metadata: { modified_by: user.full_name }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
