import { Link } from 'react-router'

import { useEffect, useState } from 'react'
import { Plants } from '../types'
import { Leaf } from 'lucide-react'
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const PlantsList = () => {
  const [plants, setPlants] = useState([])
  useEffect(() => {
    const fetchPlants = async () => {
      const response = await fetch(`http://localhost:3000/plants`)
      const res = await response.json()
      console.log(res)

      setPlants(res)
    }
    fetchPlants()
  }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-10 text-white">
        <span className="inline-flex items-center gap-2">
          <Leaf className="text-green-400" size={28} />
          <span>Mi Jardín</span>
        </span>
      </h1>

      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plants.map((plant: Plants) => (
            <Link to={`/${plant.id}`} key={plant.id} className="block">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-green-400/20 hover:scale-105 transition-all duration-300 h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={plant.image || '/placeholder.svg'}
                    alt={plant.common_name}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-medium text-green-400 text-center">
                    {plant.common_name}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-800/50 rounded-xl max-w-md mx-auto">
          <Leaf className="text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 text-lg text-center mb-2">
            No hay plantas registradas
          </p>
          <p className="text-gray-500 text-sm text-center mb-6">
            Añade tu primera planta para comenzar tu jardín virtual
          </p>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            Añadir planta
          </button>
        </div>
      )}
    </div>
  )
}
