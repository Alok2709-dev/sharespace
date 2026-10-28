import { execute, queryAll, queryOne, runTransaction } from '../db/database';
import { recordAuditEvent } from './audit-service';
import { createNotification } from './notification-service';
import { checkUserResourceEligibility } from './eligibility-service';

export interface CreateBookingParams {
  resourceId: string;
  userId: string;
  userName: string;
  userRole: string;
  purpose: string;
  projectName?: string;
  startTime: string; // ISO format or 'YYYY-MM-DD HH:MM:SS'
  endTime: string;
  joinWaitlistIfConflict?: boolean;
}

export interface BookingDecisionParams {
  bookingId: string;
  decision: 'approve' | 'reject';
  reason: string;
  decidedBy: string;
  deciderName: string;
  deciderRole: string;
}

export function getResourceOverlaps(resourceId: string, startTime: string, endTime: string, excludeBookingId?: string) {
  let sql = `
    SELECT * FROM bookings
    WHERE resource_id = ?
      AND status IN ('approved', 'checked_in')
      AND start_time < ?
      AND end_time > ?
  `;
  const params: any[] = [resourceId, endTime, startTime];
  if (excludeBookingId) {
    sql += ' AND id != ?';
    params.push(excludeBookingId);
  }
  return queryAll<any>(sql, params);
}

export function getUserActiveBookingCount(userId: string): number {
  const result = queryOne<{ count: number }>(`
    SELECT COUNT(*) as count FROM bookings
    WHERE user_id = ? AND status IN ('pending_approval', 'approved', 'checked_in')
  `, [userId]);
  return result?.count || 0;
}

export function createBookingRequest(params: CreateBookingParams) {
  return runTransaction(() => {
    const resource = queryOne<any>('SELECT * FROM resources WHERE id = ?', [params.resourceId]);
    if (!resource) throw new Error('Resource not found');
    if (resource.status !== 'active') throw new Error(`Resource is currently ${resource.status}`);

    // 1. Check Seeker Eligibility
    const eligibility = checkUserResourceEligibility(params.userId, params.resourceId);
    if (!eligibility.isEligible) {
      const missing = eligibility.requirements.filter(r => r.is_mandatory && r.status !== 'verified').map(r => r.title).join(', ');
      throw new Error(`Ineligible to book this resource. Missing required verifications: ${missing}`);
    }

    // 2. Fair-Use Active Bookings Cap
    const institution = queryOne<any>('SELECT policy_settings FROM institutions WHERE id = ?', [resource.institution_id]);
    const policy = institution?.policy_settings ? JSON.parse(institution.policy_settings) : {};
    const maxActive = policy.max_active_bookings_per_user || 3;
    const activeCount = getUserActiveBookingCount(params.userId);

    if (activeCount >= maxActive) {
      throw new Error(`Fair-use policy limit reached: You currently have ${activeCount} active bookings (maximum allowed: ${maxActive}). Return or close existing bookings to submit new requests.`);
    }

    // 3. Time Validation
    const start = new Date(params.startTime);
    const end = new Date(params.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error('Invalid booking dates provided');
    if (end <= start) throw new Error('Booking end time must be strictly after start time');
    if (start < new Date()) throw new Error('Cannot request booking in the past');

    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    if (durationMinutes < resource.min_duration_minutes) {
      throw new Error(`Duration (${durationMinutes}m) is below resource minimum of ${resource.min_duration_minutes} minutes`);
    }
    if (durationMinutes > resource.max_duration_minutes) {
      throw new Error(`Duration (${durationMinutes}m) exceeds resource maximum of ${resource.max_duration_minutes} minutes`);
    }

    // 4. Overlap & Conflict Check
    const overlaps = getResourceOverlaps(params.resourceId, params.startTime, params.endTime);
    const bookingId = 'bk-' + Math.random().toString(36).substring(2, 9);
    const refNumber = 'BK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    if (overlaps.length > 0) {
      // Slot has conflict
      if (!params.joinWaitlistIfConflict) {
        throw new Error(`Scheduling conflict: The requested time interval overlaps with an existing reservation (${overlaps[0].booking_reference}). You can join the waiting list for this slot.`);
      }

      // Add as waitlisted
      const waitlistCount = queryOne<{ count: number }>(`
        SELECT COUNT(*) as count FROM waiting_list_entries
        WHERE resource_id = ? AND status = 'active'
      `, [params.resourceId])?.count || 0;

      const position = waitlistCount + 1;
      const explanation = `You are #${position} on the waiting list. This slot is currently occupied by reservation ${overlaps[0].booking_reference}. If earlier reservations are cancelled or modified, your request will be promoted in FIFO order.`;

      execute(`
        INSERT INTO bookings (
          id, booking_reference, resource_id, user_id, purpose, project_name,
          start_time, end_time, status, decision_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'waitlisted', ?)
      `, [
        bookingId, refNumber, params.resourceId, params.userId, params.purpose,
        params.projectName || null, params.startTime, params.endTime,
        `Placed on waiting list at position #${position}`
      ]);

      const waitlistId = 'wl-' + Math.random().toString(36).substring(2, 9);
      execute(`
        INSERT INTO waiting_list_entries (
          id, resource_id, booking_id, user_id, position, requested_start_time,
          requested_end_time, explanation, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `, [
        waitlistId, params.resourceId, bookingId, params.userId, position,
        params.startTime, params.endTime, explanation
      ]);

      recordAuditEvent({
        actorId: params.userId,
        actorName: params.userName,
        actorRole: params.userRole,
        actionType: 'WAITLIST_JOINED',
        entityType: 'booking',
        entityId: bookingId,
        prevState: null,
        newState: 'waitlisted',
        decisionReason: explanation,
        metadata: { position, resource: resource.title, refNumber }
      });

      createNotification({
        userId: params.userId,
        type: 'waitlist_entry',
        title: `Added to Waitlist (#${position}): ${resource.title}`,
        message: explanation,
        link: `/my-bookings`
      });

      return { bookingId, refNumber, status: 'waitlisted', position, explanation };
    }

    // No overlap: Normal pending approval
    execute(`
      INSERT INTO bookings (
        id, booking_reference, resource_id, user_id, purpose, project_name,
        start_time, end_time, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_approval')
    `, [
      bookingId, refNumber, params.resourceId, params.userId, params.purpose,
      params.projectName || null, params.startTime, params.endTime
    ]);

    recordAuditEvent({
      actorId: params.userId,
      actorName: params.userName,
      actorRole: params.userRole,
      actionType: 'BOOKING_REQUESTED',
      entityType: 'booking',
      entityId: bookingId,
      prevState: null,
      newState: 'pending_approval',
      decisionReason: params.purpose,
      metadata: { resource: resource.title, refNumber, start: params.startTime, end: params.endTime }
    });

    createNotification({
      userId: resource.owner_id,
      type: 'pending_approval',
      title: `New Booking Request: ${resource.title}`,
      message: `${params.userName} requested booking ${refNumber} for ${params.startTime}`,
      link: '/owner/requests'
    });

    return { bookingId, refNumber, status: 'pending_approval' };
  });
}

export function decideBooking(params: BookingDecisionParams) {
  return runTransaction(() => {
    const booking = queryOne<any>(`
      SELECT b.*, r.title as resource_title, r.owner_id, u.full_name as seeker_name
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `, [params.bookingId]);

    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'pending_approval') {
      throw new Error(`Cannot decide booking in state '${booking.status}'`);
    }

    if (params.decision === 'approve') {
      // Re-verify no conflicts
      const conflicts = getResourceOverlaps(booking.resource_id, booking.start_time, booking.end_time, booking.id);
      if (conflicts.length > 0) {
        throw new Error(`Cannot approve: Conflict exists with booking ${conflicts[0].booking_reference}`);
      }

      execute(`
        UPDATE bookings
        SET status = 'approved', decision_reason = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [params.reason, params.decidedBy, params.bookingId]);

      recordAuditEvent({
        actorId: params.decidedBy,
        actorName: params.deciderName,
        actorRole: params.deciderRole,
        actionType: 'BOOKING_APPROVED',
        entityType: 'booking',
        entityId: params.bookingId,
        prevState: 'pending_approval',
        newState: 'approved',
        decisionReason: params.reason,
        metadata: { booking_reference: booking.booking_reference, resource: booking.resource_title }
      });

      createNotification({
        userId: booking.user_id,
        type: 'booking_approved',
        title: `Booking Approved: ${booking.resource_title}`,
        message: `Your booking ${booking.booking_reference} has been approved. Decision notes: ${params.reason}`,
        link: `/bookings/${params.bookingId}`
      });
    } else {
      if (!params.reason || params.reason.trim().length === 0) {
        throw new Error('A recorded decision reason is mandatory when rejecting a booking request');
      }

      execute(`
        UPDATE bookings
        SET status = 'rejected', decision_reason = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [params.reason, params.decidedBy, params.bookingId]);

      recordAuditEvent({
        actorId: params.decidedBy,
        actorName: params.deciderName,
        actorRole: params.deciderRole,
        actionType: 'BOOKING_REJECTED',
        entityType: 'booking',
        entityId: params.bookingId,
        prevState: 'pending_approval',
        newState: 'rejected',
        decisionReason: params.reason,
        metadata: { booking_reference: booking.booking_reference, resource: booking.resource_title }
      });

      createNotification({
        userId: booking.user_id,
        type: 'booking_rejected',
        title: `Booking Rejected: ${booking.resource_title}`,
        message: `Your booking ${booking.booking_reference} was rejected. Reason: ${params.reason}`,
        link: `/bookings/${params.bookingId}`
      });
    }

    return { success: true, newStatus: params.decision === 'approve' ? 'approved' : 'rejected' };
  });
}

export function cancelBooking(bookingId: string, actorId: string, actorName: string, actorRole: string, reason: string) {
  return runTransaction(() => {
    const booking = queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) throw new Error('Booking not found');

    const allowedCancelStates = ['pending_approval', 'approved', 'waitlisted'];
    if (!allowedCancelStates.includes(booking.status)) {
      throw new Error(`Cannot cancel a booking in status '${booking.status}'`);
    }

    const prevState = booking.status;
    execute(`
      UPDATE bookings
      SET status = 'cancelled', cancellation_reason = ?, cancelled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [reason, bookingId]);

    // If waitlisted, also cancel waiting list entry
    if (prevState === 'waitlisted') {
      execute("UPDATE waiting_list_entries SET status = 'cancelled' WHERE booking_id = ?", [bookingId]);
    }

    recordAuditEvent({
      actorId,
      actorName,
      actorRole,
      actionType: 'BOOKING_CANCELLED',
      entityType: 'booking',
      entityId: bookingId,
      prevState,
      newState: 'cancelled',
      decisionReason: reason,
      metadata: { booking_reference: booking.booking_reference }
    });

    // If it was an approved booking, check and promote waiting list!
    if (prevState === 'approved') {
      promoteNextInWaitlist(booking.resource_id, booking.start_time, booking.end_time);
    }

    return { success: true };
  });
}

export function promoteNextInWaitlist(resourceId: string, startTime: string, endTime: string) {
  const candidate = queryOne<any>(`
    SELECT w.*, b.id as booking_id, b.user_id, b.booking_reference, u.full_name as user_name, r.title as resource_title
    FROM waiting_list_entries w
    JOIN bookings b ON w.booking_id = b.id
    JOIN users u ON b.user_id = u.id
    JOIN resources r ON w.resource_id = r.id
    WHERE w.resource_id = ?
      AND w.status = 'active'
      AND w.requested_start_time < ?
      AND w.requested_end_time > ?
    ORDER BY w.position ASC, w.joined_at ASC
    LIMIT 1
  `, [resourceId, endTime, startTime]);

  if (!candidate) return null;

  // Re-verify eligibility before promotion
  const eligibility = checkUserResourceEligibility(candidate.user_id, resourceId);
  if (!eligibility.isEligible) {
    // Cannot promote ineligible user even if next in line! (Spec requirement Section 10)
    execute("UPDATE waiting_list_entries SET status = 'expired', explanation = 'Skipped promotion due to missing or expired mandatory eligibility requirements.' WHERE id = ?", [candidate.id]);
    // Try next candidate recursively
    return promoteNextInWaitlist(resourceId, startTime, endTime);
  }

  // Promote booking to approved
  execute(`
    UPDATE bookings
    SET status = 'approved', decision_reason = 'Automatically promoted from waiting list (Position #1) following cancellation of previous reservation.', decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [candidate.booking_id]);

  execute(`
    UPDATE waiting_list_entries
    SET status = 'promoted', promoted_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [candidate.id]);

  // Re-index remaining active waitlist entries for this resource
  const remaining = queryAll<any>(`
    SELECT id FROM waiting_list_entries
    WHERE resource_id = ? AND status = 'active'
    ORDER BY position ASC, joined_at ASC
  `, [resourceId]);

  let newPos = 1;
  for (const item of remaining) {
    execute('UPDATE waiting_list_entries SET position = ? WHERE id = ?', [newPos++, item.id]);
  }

  recordAuditEvent({
    actorId: null,
    actorName: 'SHARESPACE Fair Allocation Engine',
    actorRole: 'system',
    actionType: 'WAITLIST_PROMOTED',
    entityType: 'booking',
    entityId: candidate.booking_id,
    prevState: 'waitlisted',
    newState: 'approved',
    decisionReason: 'Promoted from waiting list position #1 upon slot opening.',
    metadata: { resource: candidate.resource_title, promoted_user: candidate.user_name }
  });

  createNotification({
    userId: candidate.user_id,
    type: 'waitlist_promoted',
    title: `Slot Available: Booking Promoted! (${candidate.resource_title})`,
    message: `A conflicting reservation was cancelled. Your booking ${candidate.booking_reference} has been automatically promoted to Approved status.`,
    link: `/bookings/${candidate.booking_id}`
  });

  return candidate;
}
