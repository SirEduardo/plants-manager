import { PlantsController } from '../controllers/plants.js'
import { Router } from 'express'
import { uploadPlants } from '../middlewares/files.js'

const plantsRouter = Router()

plantsRouter.get('/', PlantsController.getAll)
plantsRouter.post('/', uploadPlants.single('image'), PlantsController.create)
plantsRouter.get('/:id', PlantsController.getById)
plantsRouter.get('/check-plant', PlantsController.checkPlantExists)

export default plantsRouter
