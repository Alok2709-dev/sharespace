import { execute, queryAll, queryOne, runTransaction } from '../db/database';
import { recordAuditEvent } from './audit-service';
import { createNotification } from './notification-service';

export interface CheckInParams {
  bookingId: string;
  conductedBy: string;
  conductorName: string;
  conductorRole: string;
  initialCondition: 'pristine' | 'good' | 'acceptable' | 'fair' | 'minor_wear';
  accessoriesIncluded: string[];
  notes?: string;
  imageUrls?: string[];
}

export interface ReturnParams {
  bookingId: string;
  conductedBy: string;
  conductorName: string;
  conductorRole: string;
  finalCondition: 'pristine' | 'good' | 'acceptable' | 'fair' | 'damaged' | 'heavily_soiled';
  accessoriesReturned: string[];
  notes?: string;
  imageUrls?: string[];
  flagForReview?: boolean;
}

export function performCheckIn(params: CheckInParams) {
  return runTransaction(() => {
    const booking = queryOne<any>(`
      SELECT b.*, r.title as resource_title, r.owner_id
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      WHERE b.id = ?
    `, [params.bookingId]);

    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'approved') {
      throw new Error(`Cannot check in booking with status '${booking.status}'. Booking must be in 'approved' status.`);
    }

    const existingCheckIn = queryOne<any>('SELECT id FROM check_in_records WHERE booking_id = ?', [params.bookingId]);
    if (existingCheckIn) {
      throw new Error('Check-in has already been recorded for this booking.');
    }

    const checkInId = 'chk-' + Math.random().toString(36).substring(2, 9);
    execute(`
      INSERT INTO check_in_records (
        id, booking_id, resource_id, user_id, conducted_by, handover_time,
        initial_condition, accessories_included, notes, image_urls, user_acknowledged
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, 1)
    `, [
      checkInId,
      booking.id,
      booking.resource_id,
      booking.user_id,
      params.conductedBy,
      params.initialCondition,
      JSON.stringify(params.accessoriesIncluded || []),
      params.notes || null,
      JSON.stringify(params.imageUrls || [])
    ]);

    execute(`
      UPDATE bookings
      SET status = 'checked_in', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [booking.id]);

    recordAuditEvent({
      actorId: params.conductedBy,
      actorName: params.conductorName,
      actorRole: params.conductorRole,
      actionType: 'HANDOVER_CHECKED_IN',
      entityType: 'booking',
      entityId: booking.id,
      prevState: 'approved',
      newState: 'checked_in',
      decisionReason: `Handover completed with initial condition: ${params.initialCondition}`,
      metadata: {
        accessories_count: params.accessoriesIncluded.length,
        notes: params.notes,
        resource: booking.resource_title
      }
    });

    createNotification({
      userId: booking.user_id,
      type: 'handover_complete',
      title: `Resource Checked Out: ${booking.resource_title}`,
      message: `Your handover for ${booking.booking_reference} has been completed and verified.`,
      link: `/bookings/${booking.id}`
    });

    return { checkInId, status: 'checked_in' };
  });
}

export function performReturn(params: ReturnParams) {
  return runTransaction(() => {
    const booking = queryOne<any>(`
      SELECT b.*, r.title as resource_title
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      WHERE b.id = ?
    `, [params.bookingId]);

    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'checked_in' && booking.status !== 'overdue') {
      throw new Error(`Cannot return booking with status '${booking.status}'. Booking must be 'checked_in' or 'overdue'.`);
    }

    const checkInRecord = queryOne<any>('SELECT * FROM check_in_records WHERE booking_id = ?', [params.bookingId]);
    const conditionChanged = checkInRecord
      ? checkInRecord.initial_condition !== params.finalCondition
      : false;

    const isFlagged = params.flagForReview || params.finalCondition === 'damaged' || params.finalCondition === 'heavily_soiled';
    const inspectionStatus = isFlagged ? 'flagged_for_review' : 'passed';
    const nextBookingState = isFlagged ? 'return_pending_inspection' : 'returned';

    const returnId = 'ret-' + Math.random().toString(36).substring(2, 9);
    execute(`
      INSERT INTO return_records (
        id, booking_id, resource_id, user_id, conducted_by, return_time,
        final_condition, accessories_returned, condition_changed,
        inspection_status, notes, image_urls
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)
    `, [
      returnId,
      booking.id,
      booking.resource_id,
      booking.user_id,
      params.conductedBy,
      params.finalCondition,
      JSON.stringify(params.accessoriesReturned || []),
      conditionChanged ? 1 : 0,
      inspectionStatus,
      params.notes || null,
      JSON.stringify(params.imageUrls || [])
    ]);

    execute(`
      UPDATE bookings
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [nextBookingState, booking.id]);

    recordAuditEvent({
      actorId: params.conductedBy,
      actorName: params.conductorName,
      actorRole: params.conductorRole,
      actionType: 'HANDOVER_RETURNED',
      entityType: 'booking',
      entityId: booking.id,
      prevState: booking.status,
      newState: nextBookingState,
      decisionReason: `Return inspection recorded with status ${inspectionStatus} (condition: ${params.finalCondition})`,
      metadata: {
        condition_changed: conditionChanged,
        inspection_status: inspectionStatus,
        resource: booking.resource_title
      }
    });

    createNotification({
      userId: booking.user_id,
      type: 'return_confirmed',
      title: `Return Verified: ${booking.resource_title}`,
      message: `Your return for ${booking.booking_reference} was accepted (${nextBookingState === 'returned' ? 'Completed' : 'Pending Inspection Review'}).`,
      link: `/bookings/${booking.id}`
    });

    return { returnId, status: nextBookingState, inspectionStatus };
  });
}

export function getBookingHandoverDetails(bookingId: string) {
  const checkIn = queryOne<any>(`
    SELECT c.*, u.full_name as conductor_name
    FROM check_in_records c
    JOIN users u ON c.conducted_by = u.id
    WHERE c.booking_id = ?
  `, [bookingId]);

  const returnRecord = queryOne<any>(`
    SELECT r.*, u.full_name as conductor_name
    FROM return_records r
    JOIN users u ON r.conducted_by = u.id
    WHERE r.booking_id = ?
  `, [bookingId]);

  return {
    checkIn: checkIn ? {
      ...checkIn,
      accessories_included: JSON.parse(checkIn.accessories_included || '[]'),
      image_urls: JSON.parse(checkIn.image_urls || '[]')
    } : null,
    returnRecord: returnRecord ? {
      ...returnRecord,
      accessories_returned: JSON.parse(returnRecord.accessories_returned || '[]'),
      image_urls: JSON.parse(returnRecord.image_urls || '[]')
    } : null
  };
}
