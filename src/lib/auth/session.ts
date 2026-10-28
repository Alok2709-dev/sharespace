import { cookies } from 'next/headers';
import { generateToken, verifyPassword } from './crypto';
import { queryOne, execute } from '../db/database';

export type UserRole = 'seeker' | 'owner' | 'institution_manager' | 'admin';

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  institution_id: string | null;
  institution_name?: string;
  department: string | null;
  avatar_url: string | null;
  status: 'active' | 'suspended' | 'pending_verification';
}

const COOKIE_NAME = 'sharespace_session';

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const session = queryOne<{ user_id: string; expires_at: string }>(
      'SELECT user_id, expires_at FROM sessions WHERE token = ?',
      [token]
    );

    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) {
      execute('DELETE FROM sessions WHERE token = ?', [token]);
      return null;
    }

    const user = queryOne<any>(`
      SELECT u.id, u.email, u.full_name, u.role, u.institution_id, u.department, u.avatar_url, u.status,
             i.name as institution_name
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.id
      WHERE u.id = ?
    `, [session.user_id]);

    if (!user || user.status === 'suspended') return null;

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      institution_id: user.institution_id,
      institution_name: user.institution_name,
      department: user.department,
      avatar_url: user.avatar_url,
      status: user.status
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const id = 'sess-' + Math.random().toString(36).substring(2, 10);

  execute(
    'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
    [id, userId, token, expiresAt]
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60
  });

  return token;
}

export async function clearSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      execute('DELETE FROM sessions WHERE token = ?', [token]);
      cookieStore.delete(COOKIE_NAME);
    }
  } catch {}
}

export function checkRole(user: UserSession | null, allowed: UserRole[]): boolean {
  if (!user) return false;
  return allowed.includes(user.role);
}
