import { NotificationModel } from '../models/notification.js'

export class NotificationController {
  static async getUserNotification(req, res) {
    try {
      const userId = req.userId
      const notification = await NotificationModel.getNotification(userId)
      if (notification.length === 0) {
        return res
          .status(404)
          .json({ message: 'No hay notificaciones pendientes.' })
      }
      return res.status(200).json({ notification })
    } catch (error) {
      console.error('Error al obtener notificaciones:', error)
      return res
        .status(500)
        .json({ message: 'Error interno al obtener notificaciones' })
    }
  }

  static async patchNotification(req, res) {
    const { id } = req.params
    try {
      const status = await NotificationModel.patchNotification(id)
      return res.status(200).json({ message: 'status cambiado', status })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error interno al obtener notificaciones' })
    }
  }

  static async deleteNotification(req, res) {
    const { id } = req.params
    try {
      await NotificationModel.deleteNotification(id)
      return res.status(200).json({ message: 'Notificación eliminada' })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al intentar eliminar la notificación' })
    }
  }
}
