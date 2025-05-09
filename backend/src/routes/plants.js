import { PlantsController } from '../controllers/plants.js'
import { Router } from 'express'
import { uploadPlants } from '../middlewares/files.js'
import authenticateUser from '../utils/auth.js'

const plantsRouter = Router()

plantsRouter.get('/', authenticateUser, PlantsController.getAll)
plantsRouter.post(
  '/',
  uploadPlants.single('image'),
  authenticateUser,
  PlantsController.create
)
plantsRouter.get('/:id', PlantsController.getById)
plantsRouter.get('/city/:name', authenticateUser, PlantsController.getByCity)
plantsRouter.patch('/:id', PlantsController.patch)
plantsRouter.delete('/:id', PlantsController.delete)

export default plantsRouter
