import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, createSession, clearSession } from '@/lib/auth/session';
import { queryOne, execute } from '@/lib/db/database';
import { verifyPassword } from '@/lib/auth/crypto';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Demo Switch Mode (allows quick switcher for evaluation)
    if (body.demoUserId) {
      const demoUser = queryOne<any>('SELECT * FROM users WHERE id = ?', [body.demoUserId]);
      if (!demoUser) {
        return NextResponse.json({ error: 'Demo user not found' }, { status: 404 });
      }
      await createSession(demoUser.id);
      return NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          full_name: demoUser.full_name,
          role: demoUser.role,
          department: demoUser.department,
          avatar_url: demoUser.avatar_url
        }
      });
    }

    // 2. Standard Email/Password Login
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = queryOne<any>('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status === 'suspended') {
      return NextResponse.json({
        error: `Account suspended: ${user.suspension_reason || 'Contact institutional administrator'}`
      }, { status: 403 });
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        avatar_url: user.avatar_url
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}
