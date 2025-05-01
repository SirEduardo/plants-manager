import { Router } from 'express'
import { LocationController } from '../controllers/location.js'
import { uploadLocalization } from '../middlewares/files.js'
import authenticateUser from '../utils/auth.js'

const locationRoutes = Router()

locationRoutes.get('/', authenticateUser, LocationController.getLocation)
locationRoutes.post(
  '/',
  authenticateUser,
  uploadLocalization.single('image'),
  LocationController.create
)
locationRoutes.delete('/:id', authenticateUser, LocationController.delete)

export default locationRoutes
