import { execute, queryAll, queryOne } from '../db/database';
import { recordAuditEvent } from './audit-service';

export interface EligibilityCheckResult {
  isEligible: boolean;
  totalRequirements: number;
  verifiedCount: number;
  requirements: Array<{
    id: string;
    requirement_type: string;
    title: string;
    description: string;
    is_mandatory: number;
    status: 'verified' | 'pending' | 'rejected' | 'not_submitted' | 'expired';
    notes?: string;
    expires_at?: string;
  }>;
}

export function checkUserResourceEligibility(userId: string, resourceId: string): EligibilityCheckResult {
  const requirements = queryAll<any>(`
    SELECT * FROM eligibility_requirements
    WHERE resource_id = ?
  `, [resourceId]);

  if (requirements.length === 0) {
    return {
      isEligible: true,
      totalRequirements: 0,
      verifiedCount: 0,
      requirements: []
    };
  }

  const verifications = queryAll<any>(`
    SELECT * FROM eligibility_verifications
    WHERE user_id = ?
  `, [userId]);

  const verMap = new Map<string, any>();
  for (const v of verifications) {
    verMap.set(v.requirement_type, v);
  }

  let verifiedCount = 0;
  let allMandatorySatisfied = true;

  const resultList = requirements.map(req => {
    const userVer = verMap.get(req.requirement_type);
    let status: 'verified' | 'pending' | 'rejected' | 'not_submitted' | 'expired' = 'not_submitted';
    let notes: string | undefined = undefined;
    let expiresAt: string | undefined = undefined;

    if (userVer) {
      if (userVer.status === 'verified') {
        if (userVer.expires_at && new Date(userVer.expires_at) < new Date()) {
          status = 'expired';
        } else {
          status = 'verified';
          verifiedCount++;
        }
      } else {
        status = userVer.status;
      }
      notes = userVer.verification_notes;
      expiresAt = userVer.expires_at;
    }

    if (req.is_mandatory && status !== 'verified') {
      allMandatorySatisfied = false;
    }

    return {
      id: req.id,
      requirement_type: req.requirement_type,
      title: req.title,
      description: req.description,
      is_mandatory: req.is_mandatory,
      status,
      notes,
      expires_at: expiresAt
    };
  });

  return {
    isEligible: allMandatorySatisfied,
    totalRequirements: requirements.length,
    verifiedCount,
    requirements: resultList
  };
}

export function getUserVerifications(userId: string) {
  return queryAll<any>(`
    SELECT ev.*, u.full_name as verifier_name
    FROM eligibility_verifications ev
    LEFT JOIN users u ON ev.verified_by = u.id
    WHERE ev.user_id = ?
    ORDER BY ev.updated_at DESC
  `, [userId]);
}

export function updateVerificationStatus(params: {
  id: string;
  status: 'verified' | 'rejected' | 'pending';
  verifiedBy: string;
  verifierName: string;
  verifierRole: string;
  notes?: string;
  expiresAt?: string | null;
}) {
  const existing = queryOne<any>('SELECT * FROM eligibility_verifications WHERE id = ?', [params.id]);
  if (!existing) throw new Error('Verification record not found');

  execute(`
    UPDATE eligibility_verifications
    SET status = ?, verified_by = ?, verification_notes = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [params.status, params.verifiedBy, params.notes || null, params.expiresAt || null, params.id]);

  recordAuditEvent({
    actorId: params.verifiedBy,
    actorName: params.verifierName,
    actorRole: params.verifierRole,
    actionType: 'ELIGIBILITY_STATUS_CHANGED',
    entityType: 'eligibility_verification',
    entityId: params.id,
    prevState: existing.status,
    newState: params.status,
    decisionReason: params.notes || 'Status updated by authorized institutional reviewer.',
    metadata: { requirement_type: existing.requirement_type, target_user: existing.user_id }
  });
}
