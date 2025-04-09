'use client'

import { useState } from 'react'
import { Leaf, Thermometer, Droplets, Calendar } from 'lucide-react'
import { Header } from './Header'

export default function AddPlants() {
  const [formData, setFormData] = useState({
    name: '',
    specie: '',
    img: '',
    last_Watering_date: '',
    watering_frequency: '',
    min_temperature: '',
    max_temperature: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Aquí enviarías los datos al backend
  }

  return (
    <main className="h-screen bg-gray-700  text-white">
      <Header />
      <div className="flex flex-col items-center pt-20">
        <h1 className="text-5xl pb-10">Añadir Planta</h1>
        <section className="w-full max-w-2xl mx-auto shadow-lg border border-green-100 rounded-lg">
          <div className="bg-green-50 rounded-t-lg p-6">
            <div className="text-green-800 flex items-center gap-2 text-2xl font-semibold">
              <Leaf className="h-5 w-5 text-green-600" />
              Información de la planta
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Ingresa los detalles de tu planta para un mejor seguimiento de
              cuidados
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-green-700 text-sm font-medium block"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    placeholder="Nombre de tu planta"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="specie"
                    className="text-green-700 text-sm font-medium block"
                  >
                    Especie
                  </label>
                  <input
                    id="specie"
                    placeholder="Especie de la planta"
                    value={formData.specie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="img"
                  className="text-green-700 text-sm font-medium block"
                >
                  Imagen (URL)
                </label>
                <input
                  id="img"
                  placeholder="URL de la imagen"
                  value={formData.img}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="last_Watering_date"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Último Riego
                  </label>
                  <input
                    id="last_Watering_date"
                    type="date"
                    value={formData.last_Watering_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="watering_frequency"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Droplets className="h-4 w-4" />
                    Frecuencia de Riego (días)
                  </label>
                  <input
                    id="watering_frequency"
                    type="number"
                    placeholder="7"
                    value={formData.watering_frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="min_temperature"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Thermometer className="h-4 w-4" />
                    Temperatura Mínima (°C)
                  </label>
                  <input
                    id="min_temperature"
                    type="number"
                    placeholder="15"
                    value={formData.min_temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="max_temperature"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Thermometer className="h-4 w-4" />
                    Temperatura Máxima (°C)
                  </label>
                  <input
                    id="max_temperature"
                    type="number"
                    placeholder="25"
                    value={formData.max_temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-b-lg p-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                Guardar Planta
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
