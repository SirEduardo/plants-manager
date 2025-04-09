import { PlantsModel } from "../models/plants"
import { Request, Response } from "express"
import { validatePlant } from "../schemas/plants"

export class PlantsController {
    static async getAll(req: Request, res: Response){
        const plants = await PlantsModel.getAll()
        if(!plants) {
        res.status(404).json("No hay plantas")
        }
        res.json(plants)
    }
    static async create(req: Request, res: Response) {
        const result = validatePlant(req.body)
        if (!result.success) {
            // 422 Unprocessable Entity
            return res.status(400).json({ error: JSON.parse(result.error.message) })
          }
        const newPlant = await PlantsModel.addPlants({ input: result.data })
        res.status(201).json(newPlant)
    }
}