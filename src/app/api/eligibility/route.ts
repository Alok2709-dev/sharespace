import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { checkUserResourceEligibility, getUserVerifications, updateVerificationStatus } from '@/lib/services/eligibility-service';
import { queryAll } from '@/lib/db/database';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resourceId');
    const allUsers = searchParams.get('allUsers');

    if (resourceId) {
      const eligibility = checkUserResourceEligibility(user.id, resourceId);
      return NextResponse.json(eligibility);
    }

    if (allUsers && ['institution_manager', 'admin', 'owner'].includes(user.role)) {
      const verifications = queryAll<any>(`
        SELECT ev.*, u.full_name as user_name, u.email as user_email, u.department as user_department,
               verifier.full_name as verifier_name
        FROM eligibility_verifications ev
        JOIN users u ON ev.user_id = u.id
        LEFT JOIN users verifier ON ev.verified_by = verifier.id
        ORDER BY ev.updated_at DESC
      `);
      return NextResponse.json({ verifications });
    }

    // Default: Return current user's verifications
    const verifications = getUserVerifications(user.id);
    return NextResponse.json({ verifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    if (!['owner', 'institution_manager', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Only authorized personnel can verify qualifications' }, { status: 403 });
    }

    const body = await req.json();
    const { verificationId, status, notes, expiresAt } = body;

    if (!verificationId || !status) {
      return NextResponse.json({ error: 'Verification ID and status are required' }, { status: 400 });
    }

    updateVerificationStatus({
      id: verificationId,
      status,
      verifiedBy: user.id,
      verifierName: user.full_name,
      verifierRole: user.role,
      notes,
      expiresAt
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
