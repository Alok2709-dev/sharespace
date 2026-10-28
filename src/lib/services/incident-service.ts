import { execute, queryAll, queryOne, runTransaction } from '../db/database';
import { recordAuditEvent } from './audit-service';
import { createNotification } from './notification-service';

export interface ReportIncidentParams {
  bookingId?: string;
  resourceId: string;
  reporterId: string;
  reporterName: string;
  reporterRole: string;
  category: 'equipment_damage' | 'missing_accessories' | 'late_return' | 'unsafe_use' | 'unauthorized_access' | 'scheduling_dispute' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidenceUrls?: string[];
}

export function reportIncident(params: ReportIncidentParams) {
  return runTransaction(() => {
    const resource = queryOne<any>('SELECT title, owner_id, institution_id FROM resources WHERE id = ?', [params.resourceId]);
    if (!resource) throw new Error('Resource not found');

    const incidentId = 'inc-' + Math.random().toString(36).substring(2, 9);
    const refNumber = 'INC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    execute(`
      INSERT INTO incidents (
        id, incident_reference, booking_id, resource_id, reporter_id,
        category, severity, description, evidence_urls, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `, [
      incidentId,
      refNumber,
      params.bookingId || null,
      params.resourceId,
      params.reporterId,
      params.category,
      params.severity,
      params.description,
      JSON.stringify(params.evidenceUrls || [])
    ]);

    // If associated with a booking, flag the booking as incident_under_review
    if (params.bookingId) {
      execute(`
        UPDATE bookings
        SET status = 'incident_under_review', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [params.bookingId]);
    }

    recordAuditEvent({
      actorId: params.reporterId,
      actorName: params.reporterName,
      actorRole: params.reporterRole,
      actionType: 'INCIDENT_REPORTED',
      entityType: 'incident',
      entityId: incidentId,
      prevState: null,
      newState: 'open',
      decisionReason: `Incident filed under category: ${params.category} (${params.severity} severity)`,
      metadata: { refNumber, resource: resource.title, description: params.description }
    });

    // Notify institution manager & resource owner
    const managers = queryAll<any>("SELECT id FROM users WHERE role IN ('institution_manager', 'admin')");
    for (const mgr of managers) {
      createNotification({
        userId: mgr.id,
        type: 'incident_reported',
        title: `Incident Filed: ${refNumber}`,
        message: `${params.category.replace('_', ' ').toUpperCase()} reported on ${resource.title}`,
        link: `/incidents/${incidentId}`
      });
    }

    return { incidentId, refNumber, status: 'open' };
  });
}

export function updateIncidentStatus(params: {
  incidentId: string;
  status: 'open' | 'under_review' | 'awaiting_information' | 'resolved' | 'escalated';
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  resolutionNotes?: string;
  reopenBooking?: boolean;
}) {
  return runTransaction(() => {
    const incident = queryOne<any>('SELECT * FROM incidents WHERE id = ?', [params.incidentId]);
    if (!incident) throw new Error('Incident not found');

    const prevState = incident.status;
    const isResolved = params.status === 'resolved';

    execute(`
      UPDATE incidents
      SET status = ?, assigned_to = ?, resolution_notes = ?,
          resolved_at = ${isResolved ? 'CURRENT_TIMESTAMP' : 'NULL'},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [params.status, params.reviewerId, params.resolutionNotes || incident.resolutionNotes, params.incidentId]);

    // If resolved and had an associated booking, close or return the booking
    if (isResolved && incident.booking_id) {
      execute(`
        UPDATE bookings
        SET status = 'closed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [incident.booking_id]);
    }

    recordAuditEvent({
      actorId: params.reviewerId,
      actorName: params.reviewerName,
      actorRole: params.reviewerRole,
      actionType: 'INCIDENT_STATUS_CHANGED',
      entityType: 'incident',
      entityId: params.incidentId,
      prevState,
      newState: params.status,
      decisionReason: params.resolutionNotes || `Incident status updated to ${params.status}`,
      metadata: { refNumber: incident.incident_reference, reporterId: incident.reporter_id }
    });

    createNotification({
      userId: incident.reporter_id,
      type: 'incident_updated',
      title: `Incident ${incident.incident_reference} Updated`,
      message: `Status changed to ${params.status}. Review notes: ${params.resolutionNotes || 'No notes provided'}`,
      link: `/incidents/${params.incidentId}`
    });

    return { success: true, status: params.status };
  });
}

export function getIncidentList(filter: { resourceId?: string; status?: string; limit?: number } = {}) {
  let sql = `
    SELECT inc.*, r.title as resource_title, r.location as resource_location,
           u.full_name as reporter_name, rev.full_name as reviewer_name
    FROM incidents inc
    JOIN resources r ON inc.resource_id = r.id
    JOIN users u ON inc.reporter_id = u.id
    LEFT JOIN users rev ON inc.assigned_to = rev.id
    WHERE 1=1
  `;
  const params: any[] = [];
  if (filter.resourceId) {
    sql += ' AND inc.resource_id = ?';
    params.push(filter.resourceId);
  }
  if (filter.status) {
    sql += ' AND inc.status = ?';
    params.push(filter.status);
  }
  sql += ' ORDER BY inc.created_at DESC LIMIT ?';
  params.push(filter.limit || 50);

  const rows = queryAll<any>(sql, params);
  return rows.map(r => ({
    ...r,
    evidence_urls: JSON.parse(r.evidence_urls || '[]')
  }));
}
