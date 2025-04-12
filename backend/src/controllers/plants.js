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

      data.edible = data.edible === 'true' // Asegura que 'edible' sea un booleano
      data.toxicity = data.toxicity === 'true' // Asegura que 'toxicity' sea un booleano
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

  static async checkPlantExists(req, res) {
    if (!req || !res) {
      console.log('Request o Response no están definidos correctamente')
      return
    }
    const { commonName } = req.query
    if (!commonName) {
      return res
        .status(400)
        .json({ error: 'Se requiere el nombre de la planta' })
    }

    try {
      const [existingPlant] = await db.query(
        'SELECT * FROM external_plant_data WHERE common_name = ?',
        [commonName]
      )

      if (existingPlant.length > 0) {
        return res.json({ exists: true, data: existingPlant[0] })
      } else {
        return res.json({ exists: false })
      }
    } catch (error) {
      console.error('Error al verificar la existencia de la planta:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
