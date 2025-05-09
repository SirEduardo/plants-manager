'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import {
  Calendar,
  Leaf,
  Upload,
  Droplet,
  X,
  ImageIcon,
  Check,
  ArrowLeft
} from 'lucide-react'
import { Header } from '../Header'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { apiUrl } from '../../api/url'

export default function AddPlants() {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    commonName: '',
    image: null as File | null,
    externalData: null as any,
    last_watering_date: '',
    last_fertilize_date: '',
    location: id || ''
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

  // Función para manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }))

      // Crear URL para vista previa
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(files[0])

      // Limpiar error
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.commonName.trim()) {
      newErrors.commonName = 'El nombre de la planta es obligatorio'
    }

    if (!formData.last_watering_date) {
      newErrors.last_watering_date = 'La fecha de último riego es obligatoria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Preparamos el FormData para enviar
      const form = new FormData()
      form.append('commonName', formData.commonName)
      if (formData.image) form.append('image', formData.image)
      form.append('last_watering_date', formData.last_watering_date)
      form.append('last_fertilize_date', formData.last_fertilize_date)
      form.append('location_id', formData.location)
      const response = await axios.post(`${apiUrl}/plants`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })

      if (response.status === 201) {
        console.log('✅ Planta añadida correctamente')
        navigate(`/${id}`)
      } else {
        console.error('❌ Error al añadir la planta', response.data)
      }
    } catch (error) {
      const err = error as any
      console.error('❌ Error en el envío del formulario:', error)
      if (err.response?.status === 404) {
        setErrors((prev) => ({
          ...prev,
          commonName: 'No se encontró esta planta en la base de datos'
        }))
      } else {
        alert('Ocurrió un error al enviar el formulario.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/Home')
  }

  return (
    <main className="min-h-svh bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white p-6">
      <Header />

      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8 cursor-pointer group mt-10"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        <span>Volver al jardín</span>
      </button>

      <div className="flex flex-col items-center pt-6">
        <section className="w-full max-w-2xl mx-auto shadow-xl border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-900/40 p-6 border-b border-green-800/50">
            <div className="text-green-400 flex items-center gap-3 text-2xl font-semibold">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md"></div>
                <Leaf className="h-6 w-6 text-green-400 relative z-10" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
                Información de la planta
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-2 ml-9">
              Ingresa los detalles de tu planta para un mejor seguimiento de
              cuidados
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 bg-gray-800/50">
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="commonName"
                    className="text-green-400 text-sm font-medium flex items-center gap-2"
                  >
                    <Leaf className="h-4 w-4" />
                    Nombre
                  </label>
                  <input
                    id="commonName"
                    placeholder="Nombre de tu planta"
                    value={formData.commonName.toLowerCase()}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-700/70 border ${
                      errors.commonName ? 'border-red-500' : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200`}
                  />
                  {errors.commonName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.commonName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-green-400 text-sm font-medium  flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Imagen
                </label>

                {!imagePreview ? (
                  <div
                    onClick={triggerFileInput}
                    className={`w-full h-40 border-2 border-dashed ${
                      errors.image ? 'border-red-500' : 'border-gray-600'
                    } rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors duration-200 bg-gray-700/30`}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-300 text-sm">
                      Haz clic para subir una imagen
                    </p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, GIF</p>
                  </div>
                ) : (
                  <div className="relative w-full h-56 rounded-md overflow-hidden group">
                    <img
                      src={imagePreview || '/placeholder.svg'}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />

                {errors.image && (
                  <p className="text-red-400 text-xs mt-1">{errors.image}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="last_watering_date"
                    className="text-green-400 flex items-center gap-2 text-sm font-medium"
                  >
                    <Droplet className="h-4 w-4" />
                    Último Riego
                  </label>
                  <input
                    id="last_watering_date"
                    type="date"
                    value={formData.last_watering_date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-700/70 border cursor-pointer ${
                      errors.last_watering_date
                        ? 'border-red-500'
                        : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition-all duration-200`}
                  />
                  {errors.last_watering_date && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.last_watering_date}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="last_fertilize_date"
                    className="text-green-400 flex items-center gap-2 text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Última Fertilización
                  </label>
                  <input
                    id="last_fertilize_date"
                    type="date"
                    value={formData.last_fertilize_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700/70 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition-all duration-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-900/40 p-6 flex justify-center md:justify-end border-t border-green-800/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 cursor-pointer ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20'
                } text-white rounded-md font-medium transition-all duration-300 flex items-center gap-2 transform hover:translate-y-[-2px]`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Guardar Planta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
