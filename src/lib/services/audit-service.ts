import { execute, queryAll, queryOne } from '../db/database';

export interface RecordAuditParams {
  actorId?: string | null;
  actorName: string;
  actorRole: string;
  actionType: string;
  entityType: string;
  entityId: string;
  prevState?: string | null;
  newState?: string | null;
  decisionReason?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export function recordAuditEvent(params: RecordAuditParams) {
  const id = 'aud-' + Math.random().toString(36).substring(2, 10);
  execute(`
    INSERT INTO audit_events (
      id, actor_id, actor_name, actor_role, action_type, entity_type, entity_id,
      prev_state, new_state, decision_reason, metadata, ip_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    params.actorId || null,
    params.actorName,
    params.actorRole,
    params.actionType,
    params.entityType,
    params.entityId,
    params.prevState || null,
    params.newState || null,
    params.decisionReason || null,
    JSON.stringify(params.metadata || {}),
    params.ipAddress || '127.0.0.1'
  ]);
  return id;
}

export interface AuditFilter {
  entityType?: string;
  entityId?: string;
  actorId?: string;
  actionType?: string;
  limit?: number;
  offset?: number;
}

export function getAuditEvents(filter: AuditFilter = {}) {
  let query = 'SELECT * FROM audit_events WHERE 1=1';
  const params: any[] = [];

  if (filter.entityType) {
    query += ' AND entity_type = ?';
    params.push(filter.entityType);
  }
  if (filter.entityId) {
    query += ' AND entity_id = ?';
    params.push(filter.entityId);
  }
  if (filter.actorId) {
    query += ' AND actor_id = ?';
    params.push(filter.actorId);
  }
  if (filter.actionType) {
    query += ' AND action_type = ?';
    params.push(filter.actionType);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(filter.limit || 50);
  params.push(filter.offset || 0);

  const events = queryAll<any>(query, params);
  return events.map(e => ({
    ...e,
    metadata: typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata
  }));
}
