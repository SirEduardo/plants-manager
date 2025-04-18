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
  static async patch(req, res) {
    try {
      const { id } = req.params
      const data = req.body
      if (!data || Object.keys(data).length === 0) {
        return res
          .status(400)
          .json({ error: 'No se proporcionaron datos para actualizar' })
      }

      const updatedPlant = await PlantsModel.updatePlant(id, data)
      if (!updatedPlant) {
        return res.status(404).json({ error: 'Planta no encontrada' })
      }

      return res.status(200).json(updatedPlant)
    } catch (error) {
      console.error('Error al actualizar la planta', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
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
