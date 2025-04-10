import { PlantsModel } from '../models/plants.js'
import { validatePlant } from '../schemas/plants.js'

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
    const plant = await PlantsModel.getById(id)
    if (plant) return res.status(200).json(plant)
    res.status(404).json({ message: 'Plant not found' })
  }

  static async create(req, res) {
    const result = validatePlant(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors })
    }
    try {
      console.log('Archivo recibido:', req.file)
      console.log('Datos del body:', req.body)
      const data = result.data

      if (!data || !data.name) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      data.watering_frequency = Number(data.watering_frequency)
      data.fertilize_frequency = Number(data.fertilize_frequency)
      data.min_temperature = Number(data.min_temperature)
      data.max_temperature = Number(data.max_temperature)

      // Si las fechas no están en el formato adecuado, puedes convertirlas también
      data.last_watering_date = new Date(data.last_watering_date)
      data.last_fertilize_date = new Date(data.last_fertilize_date)
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
}
