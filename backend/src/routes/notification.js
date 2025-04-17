import { Router } from 'express'
import { NotificationController } from '../controllers/notification.js'
import authenticateUser from '../utils/auth.js'

const notificationRoutes = Router()

notificationRoutes.get(
  '/',
  authenticateUser,
  NotificationController.getUserNotification
)
notificationRoutes.patch('/:id', NotificationController.patchNotification)
notificationRoutes.delete('/:id', NotificationController.deleteNotification)

export default notificationRoutes
