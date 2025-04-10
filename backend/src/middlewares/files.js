import multer from 'multer'
import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config() // Cargar variables de entorno

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const Storage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary.v2, // Asegurar que usas cloudinary.v2
    params: {
      folder: folder,
      esource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
  })
}

export const uploadPlants = multer({ storage: Storage('Plants') })
