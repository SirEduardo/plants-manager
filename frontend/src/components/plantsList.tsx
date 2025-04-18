'use client'

import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import type { Plants } from '../types'
import {
  Leaf,
  Plus,
  Loader2,
  Droplet,
  Calendar,
  Check,
  Flower
} from 'lucide-react'
import axios from 'axios'
import { apiUrl } from '../api/url'

export const PlantsList = () => {
  const [plants, setPlants] = useState<Plants[]>([])
  const [loading, setLoading] = useState(true)
  const [wateringPlants, setWateringPlants] = useState<Record<string, boolean>>(
    {}
  )
  const [fertilizingPlants, setFertilizingPlants] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${apiUrl}/plants`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })

        console.log(response.data)
        setPlants(response.data)
      } catch (error) {
        console.error('Error fetching plants:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlants()
  }, [])

  const updateWateringDate = async (id: string) => {
    setWateringPlants((prev) => ({ ...prev, [id]: true }))
    const response = await axios.patch(
      `${apiUrl}/plants/${id}`,
      { last_watering_date: new Date().toLocaleDateString('en-CA') },
      {
        withCredentials: true
      }
    )
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id
          ? {
              ...plant,
              last_watering_date:
                response.data.last_watering_date ||
                new Date().toLocaleDateString()
            }
          : plant
      )
    )
  }

  const updateFertilizeDate = async (id: string) => {
    setFertilizingPlants((prev) => ({ ...prev, [id]: true }))
    const response = await axios.patch(
      `${apiUrl}/plants/${id}`,
      {
        last_fertilize_date: new Date().toLocaleDateString('en-CA')
      },
      {
        withCredentials: true
      }
    )
    setPlants((prevPlant) =>
      prevPlant.map((plant) =>
        plant.id === id
          ? {
              ...plant,
              last_fertilize_date:
                response.data.last_fertilize_date ||
                new Date().toLocaleDateString()
            }
          : plant
      )
    )
  }
  const formatDate = (date: string) => {
    if (!date) return 'No disponible'
    const d = new Date(date)
    return d.toLocaleDateString('es-ES') // "dd/mm/yyyy"
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white p-6">
      <div className="relative mb-12 pb-4 border-b border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 rounded-lg opacity-30"></div>
        <h1 className="text-3xl font-bold text-center py-6 text-white relative z-10">
          <span className="inline-flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md"></div>
              <Leaf className="text-green-400 relative z-10" size={32} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
              Mi Jardín
            </span>
          </span>
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
          <p className="text-green-400 font-medium">Cargando tu jardín...</p>
        </div>
      ) : plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plants.map((plant: Plants) => (
            <div key={plant.id} className="relative">
              <Link to={`/${plant.id}`} key={plant.id} className="block group">
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-green-500/30 hover:shadow-green-400/20 hover:scale-102 transition-all duration-300 h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      src={plant.image || '/placeholder.svg'}
                      alt={plant.common_name}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80"></div>

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex justify-between items-center text-xs text-gray-300">
                        {plant.last_watering_date && (
                          <div className="flex items-center gap-1">
                            <Droplet size={12} className="text-blue-400" />
                            <span>{formatDate(plant.last_watering_date)}</span>
                          </div>
                        )}
                        {plant.last_fertilize_date && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-green-400" />
                            <span>{formatDate(plant.last_fertilize_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-green-400 text-center group-hover:scale-105 transition-transform duration-300">
                      {plant.common_name}
                    </h2>
                  </div>
                </div>
              </Link>
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    updateWateringDate(plant.id)
                  }}
                  disabled={wateringPlants[plant.id]}
                  className="bg-blue-500/80 hover:bg-blue-600 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-blue-400/30 cursor-pointer"
                  title="Registrar riego"
                >
                  {wateringPlants[plant.id] ? (
                    <Check className="h-5 w-5 text-white animate-pulse" />
                  ) : (
                    <Droplet className="h-5 w-5 text-white" />
                  )}
                </button>

                {/* Fertilization button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    updateFertilizeDate(plant.id)
                  }}
                  disabled={fertilizingPlants[plant.id]}
                  className="bg-amber-700/80 hover:bg-amber-800 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-amber-700/30 cursor-pointer"
                  title="Registrar fertilización"
                >
                  {fertilizingPlants[plant.id] ? (
                    <Check className="h-5 w-5 text-white animate-pulse" />
                  ) : (
                    <Flower className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          ))}
          <Link to="/add-plants" className="block group">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 border-dashed hover:border-green-500/50 hover:shadow-green-400/20 hover:scale-102 transition-all duration-300 h-full flex flex-col items-center justify-center aspect-square">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-green-400/10 rounded-full blur-md group-hover:bg-green-400/20 transition-all duration-300"></div>
                <Plus className="relative z-10 w-10 h-10 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
              </div>
              <p className="text-green-400 group-hover:text-green-300 transition-colors duration-300 font-medium">
                Añadir planta
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-800/30 backdrop-blur-sm rounded-xl max-w-md mx-auto border border-gray-700/50">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gray-600/20 rounded-full blur-lg"></div>
            <Leaf className="text-gray-500 relative z-10" size={64} />
          </div>
          <h3 className="text-gray-300 text-xl font-semibold text-center mb-2">
            No hay plantas registradas
          </h3>
          <p className="text-gray-400 text-center mb-8 max-w-xs">
            Añade tu primera planta para comenzar tu jardín virtual y hacer un
            seguimiento de sus cuidados
          </p>
          <Link to="/add-plants">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center gap-2 transform hover:translate-y-[-2px]  cursor-pointer">
              <Plus size={18} />
              <span>Añadir primera planta</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
