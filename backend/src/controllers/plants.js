import { PlantsModel } from '../models/plants.js'
import { validatePlant } from '../schemas/plants.js'
import {
  fetchExternalDataId,
  fetchExternalDetails
} from '../services/perenualService.js'
import { deleteFiles } from '../utils/deleteFiles.js'

export class PlantsController {
  static async getAll(req, res) {
    const userId = req.userId
    if (!userId) {
      return res.status(400).json({ error: 'Usuario no autenticado' })
    }
    try {
      const plants = await PlantsModel.getAll(userId)
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
      if (req.file) {
        data.image = req.file.path // Aquí se obtiene la URL de Cloudinary
      } else {
        data.image = null // Puedes definir una imagen por defecto si lo deseas
      }
      data.user_id = req.userId
      console.log('Datos a insertar en la BD:', data)
      const newPlant = await PlantsModel.addPlants(data, data.user_id)

      return res.status(201).json(newPlant)
    } catch (error) {
      console.error('Error creando la planta:', error)
      return res
        .status(500)
        .json({ error: 'Internal Server Error', message: error.message })
    }
  }
  static async getOrFetchPlantDetails(req, res) {
    const { commonName } = req.query
    try {
      // Buscar en DB
      const [existingExternalData] = await db.query(
        'SELECT * FROM plants WHERE LOWER(common_name) = LOWER(?)',
        [commonName]
      )

      if (existingExternalData.length > 0) {
        console.log('Informacion insertada desde la base de datos local')
        return res.status(200).json(existingExternalData[0])
      }

      // Si no está, usar API externa
      const plantId = await fetchExternalDataId(commonName)
      const externalDetails = await fetchExternalDetails(plantId)

      if (!externalDetails) {
        return res
          .status(404)
          .json({ message: 'Planta no encontrada en la API externa' })
      }

      // Guardar en base de datos
      await db.query(
        'INSERT INTO plants (common_name, watering, sunlight, location, edible, toxicity, description, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          commonName,
          externalDetails.watering ?? 'unknown',
          externalDetails.sunlight?.join(', ') ?? 'unknown',
          externalDetails.indoor ?? 'unknown',
          externalDetails.edible_fruit ?? false,
          externalDetails.poisonous_to_humans ?? 'unknown',
          externalDetails.description ?? 'No description available.',
          'External API'
        ]
      )
      console.log('Informacion insertada desde la api externa')

      return res.status(200).json(externalDetails)
    } catch (err) {
      console.error('Error buscando o guardando detalles:', err)
      return res.status(500).json({ message: 'Error interno del servidor' })
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
