'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import {
  MapPin,
  UploadCloud,
  ImagePlus,
  X,
  Check,
  ArrowLeft
} from 'lucide-react'
import { Header } from '../Header'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { apiUrl } from '../../api/url'

export default function AddLocalizations() {
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) {
      const newErrors = { ...errors }
      delete newErrors[id]
      setErrors(newErrors)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(files[0])
      if (errors.image) {
        const newErrors = { ...errors }
        delete newErrors.image
        setErrors(newErrors)
      }
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) {
      newErrors.name = 'La ubicación es obligatoria'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const form = new FormData()
      form.append('name', formData.name)
      if (formData.image) form.append('image', formData.image)
      const response = await axios.post(`${apiUrl}/locations`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },

        withCredentials: true
      })
      if (response.status === 201) navigate('/Home')
      else console.error('Error:', response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => navigate('/Home')

  return (
    <main className="min-h-svh bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white p-6">
      <Header />

      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-colors mb-6 mt-10"
      >
        <ArrowLeft size={20} />
        <span>Volver al Inicio</span>
      </button>

      <div className="flex flex-col items-center">
        <section className="w-full max-w-2xl mx-auto shadow-xl border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="bg-amber-100 p-6 border-b border-amber-200">
            <div className="text-amber-700 flex items-center gap-3 text-2xl font-semibold">
              <MapPin className="h-6 w-6" />
              <span>Ubicaciones</span>
            </div>
            <p className="text-stone-500 text-sm mt-2 ml-9">
              Añade una nueva ubicación para tus plantas
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 bg-gray-800/50">
              <div>
                <label
                  htmlFor="name"
                  className="text-amber-600 text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </label>
                <input
                  id="name"
                  placeholder="Madrid, Salamanca, Sevilla..."
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md bg-gray-700/70 border ${
                    errors.Name ? 'border-red-400' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-500 placeholder-amber-500 transition`}
                />
                {errors.Name && (
                  <p className="text-red-500 text-xs mt-1">{errors.Name}</p>
                )}
              </div>

              <div>
                <label className="text-amber-600 text-sm font-medium flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  Imagen
                </label>

                {!imagePreview ? (
                  <div
                    onClick={triggerFileInput}
                    className={`w-full h-40  border-2 border-dashed ${
                      errors.image ? 'border-red-400' : 'border-stone-300'
                    } bg-gray-700/70 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 transition`}
                  >
                    <UploadCloud className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-amber-500 text-sm">
                      Haz clic para subir una imagen
                    </p>
                    <p className="text-amber-500 text-xs mt-1">JPG, PNG, GIF</p>
                  </div>
                ) : (
                  <div className="relative w-full h-56 rounded-md overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
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
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
              </div>
            </div>

            <div className="bg-amber-100 p-6 flex justify-center md:justify-end border-t border-amber-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-md font-medium text-white flex items-center gap-2 transition ${
                  isSubmitting
                    ? 'bg-stone-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Guardar Ubicación</span>
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
