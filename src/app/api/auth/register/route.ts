import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db/database';
import { hashPassword } from '@/lib/auth/crypto';
import { createSession } from '@/lib/auth/session';
import { recordAuditEvent } from '@/lib/services/audit-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, department, requested_role } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Full name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = queryOne('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return NextResponse.json({ error: 'An account with this institutional email already exists' }, { status: 409 });
    }

    // Role enforcement: Users can register as 'seeker' or request 'owner' (subject to verification).
    // Privileged roles 'institution_manager' or 'admin' CANNOT be self-assigned!
    let assignedRole: 'seeker' | 'owner' = 'seeker';
    let userStatus: 'active' | 'pending_verification' = 'active';

    if (requested_role === 'owner') {
      assignedRole = 'owner';
      userStatus = 'pending_verification';
    }

    const userId = 'usr-' + Math.random().toString(36).substring(2, 9);
    const passwordHash = hashPassword(password);
    const defaultInst = queryOne<any>('SELECT id FROM institutions LIMIT 1');

    execute(`
      INSERT INTO users (
        id, email, password_hash, full_name, role, institution_id, department, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      cleanEmail,
      passwordHash,
      full_name.trim(),
      assignedRole,
      defaultInst?.id || 'inst-apex-01',
      department || 'General Academic Research',
      userStatus
    ]);

    recordAuditEvent({
      actorId: userId,
      actorName: full_name,
      actorRole: assignedRole,
      actionType: 'USER_REGISTERED',
      entityType: 'user',
      entityId: userId,
      prevState: null,
      newState: userStatus,
      decisionReason: assignedRole === 'owner' ? 'Registered with owner role, awaiting institutional verification' : 'Self-registration as Resource Seeker',
      metadata: { email: cleanEmail, department }
    });

    await createSession(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        full_name,
        role: assignedRole,
        department,
        status: userStatus
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
