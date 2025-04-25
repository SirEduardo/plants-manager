'use client'

import { Link, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'

import { HomeIcon, Plus, Loader2 } from 'lucide-react'
import axios from 'axios'

import { Localizations } from './types'
import { apiUrl } from './api/url'

export const Home = () => {
  const [localizations, setLocalizations] = useState<Localizations[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const handleNavigate = (name: string, id: string) => {
    navigate(`/${name}`, { state: { LocationId: id } })
  }

  useEffect(() => {
    const fetchLocalizations = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${apiUrl}/locations`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })

        console.log(response.data)
        setLocalizations(response.data)
      } catch (error) {
        console.error('Error fetching localizations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLocalizations()
  }, [])

  const capitalize = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white p-6">
      <div className="relative mb-12 pb-4 border-b border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 rounded-lg opacity-30"></div>
        <h1 className="text-3xl font-bold text-center py-6 text-white relative">
          <span className="inline-flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md"></div>
              <HomeIcon className="text-green-400 relative" size={32} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
              Mis ubicaciones
            </span>
          </span>
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
          <p className="text-green-400 font-medium">Cargando tu jardín...</p>
        </div>
      ) : localizations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {localizations.map((localization: Localizations) => (
            <div key={localization.id} className="relative">
              <div
                onClick={() =>
                  handleNavigate(
                    localization.name.toLowerCase(),
                    localization.id
                  )
                }
                key={localization.id}
                className="block group"
              >
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-green-500/30 hover:shadow-green-400/20 hover:scale-102 transition-all duration-300 h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      src={localization.image || '/placeholder.svg'}
                      alt={localization.name}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80"></div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-green-400 text-center group-hover:scale-105 transition-transform duration-300">
                      {capitalize(localization.name)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link to="/añadir-localización" className="block group">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 border-dashed hover:border-green-500/50 hover:shadow-green-400/20 hover:scale-102 transition-all duration-300 h-full flex flex-col items-center justify-center aspect-square">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-green-400/10 rounded-full blur-md group-hover:bg-green-400/20 transition-all duration-300"></div>
                <Plus className="relative z-10 w-10 h-10 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
              </div>
              <p className="text-green-400 group-hover:text-green-300 transition-colors duration-300 font-medium">
                Añadir ubicación
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-800/30 backdrop-blur-sm rounded-xl max-w-md mx-auto border border-gray-700/50">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gray-600/20 rounded-full blur-lg"></div>
            <HomeIcon className="text-gray-500 relative z-10" size={64} />
          </div>
          <h3 className="text-gray-300 text-xl font-semibold text-center mb-2">
            No hay ubicaciones registradas
          </h3>
          <p className="text-gray-400 text-center mb-8 max-w-xs">
            Añade tu primera ubicación para guardar tus plantas y comenzar tu
            jardín virtual y hacer un seguimiento de sus cuidados
          </p>
          <Link to="/añdir-localización">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center gap-2 transform hover:translate-y-[-2px]  cursor-pointer">
              <Plus size={18} />
              <span>Añadir primera ubicación</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
