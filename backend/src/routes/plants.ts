import { Router } from "express";
import { PlantsController } from "../controllers/plants";


const plantsRouter = Router()

plantsRouter.get("/", PlantsController.getAll)

export default plantsRouter