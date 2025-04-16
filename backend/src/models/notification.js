import { db } from '../database/db.js'

export class NotificationModel {
  static async createNotification(user_id, title, message) {
    const { rows: notification } = await db.query(
      'INSERT INTO notifications (user_id, title, message) VALUES($1, $2, $3)',
      [user_id, title, message]
    )
    console.log('📥 Insertando en DB...', user_id, title, message)
    return notification
  }

  static async getNotification(userId) {
    const { rows: notification } = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC ',
      [userId]
    )
    return notification
  }

  static async patchNotification(id) {
    const { rows: notification } = await db.query(
      'UPDATE notifications  SET status = TRUE WHERE id = $1 RETURNING *',
      [id]
    )
    return notification
  }
}
