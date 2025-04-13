import { PlantsModel } from '../models/plants.js'
import { validatePlant } from '../schemas/plants.js'
import { deleteFiles } from '../utils/deleteFiles.js'

export class PlantsController {
  static async getAll(req, res) {
    try {
      const plants = await PlantsModel.getAll()
      if (plants.length === 0) {
        res.status(404).json({ error: 'No hay plantas' })
      }
      res.json(plants)
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo las plantas' })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    try {
      const plant = await PlantsModel.getById(id)
      res.status(200).json(plant)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }

  static async create(req, res) {
    const result = validatePlant(req.body)
    console.log(result)

    if (!result.success) {
      console.log('Detalles del error:', result.error.errors)
      return res.status(400).json({ error: result.error.errors })
    }
    const data = result.data
    try {
      if (!data) {
        return res.status(400).json({ error: 'Datos de planta inválidos' })
      }

      data.edible = data.edible === 'true'
      data.toxicity = data.toxicity === 'true'
      if (req.file) {
        data.image = req.file.path // Aquí se obtiene la URL de Cloudinary
      } else {
        data.image = null // Puedes definir una imagen por defecto si lo deseas
      }
      console.log('Datos a insertar en la BD:', data)
      const newPlant = await PlantsModel.addPlants(data)

      return res.status(201).json(newPlant)
    } catch (error) {
      console.error('Error creando la planta:', error)
      return res
        .status(500)
        .json({ error: 'Internal Server Error', message: error.message })
    }
  }
  static async delete(req, res) {
    const { id } = req.params
    const deletedPlant = await PlantsModel.deletePLants(id)
    if (!deletedPlant) {
      return res.status(404).json({ message: 'Failed to find plant' })
    }
    if (deletedPlant.image) {
      deleteFiles(deletedPlant.image)
    }
    return res.status(200).json(deletedPlant)
  }
}
