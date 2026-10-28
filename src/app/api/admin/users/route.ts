import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { queryAll, queryOne, execute } from '@/lib/db/database';
import { recordAuditEvent } from '@/lib/services/audit-service';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const users = queryAll<any>(`
      SELECT u.id, u.email, u.full_name, u.role, u.department, u.status, u.suspension_reason,
             u.avatar_url, u.created_at, i.name as institution_name
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.id
      ORDER BY u.created_at DESC
    `);

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, role, status, suspensionReason } = body;

    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const target = queryOne<any>('SELECT * FROM users WHERE id = ?', [userId]);
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const nextRole = role || target.role;
    const nextStatus = status || target.status;

    execute(`
      UPDATE users
      SET role = ?, status = ?, suspension_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [nextRole, nextStatus, suspensionReason || (nextStatus === 'suspended' ? 'Suspended by administrator' : null), userId]);

    recordAuditEvent({
      actorId: user.id,
      actorName: user.full_name,
      actorRole: 'admin',
      actionType: 'USER_ACCOUNT_MODIFIED',
      entityType: 'user',
      entityId: userId,
      prevState: `${target.role}/${target.status}`,
      newState: `${nextRole}/${nextStatus}`,
      decisionReason: suspensionReason || `Role/status updated by platform administrator`,
      metadata: { target_email: target.email }
    });

    return NextResponse.json({ success: true, user: { id: userId, role: nextRole, status: nextStatus } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
