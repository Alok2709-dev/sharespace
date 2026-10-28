import { execute, queryAll, queryOne } from '../db/database';

export interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export function createNotification(params: CreateNotificationParams) {
  const id = 'notif-' + Math.random().toString(36).substring(2, 10);
  execute(`
    INSERT INTO notifications (id, user_id, type, title, message, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `, [
    id,
    params.userId,
    params.type,
    params.title,
    params.message,
    params.link || null
  ]);
  return id;
}

export function getUserNotifications(userId: string, limit = 30) {
  return queryAll<any>(`
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `, [userId, limit]);
}

export function markNotificationRead(id: string, userId: string) {
  return execute(`
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `, [id, userId]);
}

export function markAllNotificationsRead(userId: string) {
  return execute(`
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ?
  `, [userId]);
}

export function getUnreadNotificationCount(userId: string): number {
  const res = queryOne<{ count: number }>(`
    SELECT COUNT(*) as count FROM notifications
    WHERE user_id = ? AND is_read = 0
  `, [userId]);
  return res?.count || 0;
}
