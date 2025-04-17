'use client'

import { LogOut, Leaf, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Notifications } from './notifications'
import { useState, useEffect } from 'react'

export function Header() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Detectar scroll para cambiar la apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      localStorage.removeItem('token')
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-10 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/10 border-b border-green-900/30'
          : 'bg-gray-800/70 backdrop-blur-sm border-b border-gray-700/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/plantsList"
              className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
            >
              <div
                className={`relative ${
                  scrolled
                    ? 'bg-gradient-to-br from-green-600 to-green-700'
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                } p-1.5 rounded-md shadow-md group-hover:shadow-green-500/20 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-green-400/20 rounded-md blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                <Leaf className="w-5 h-5 text-white relative z-10" />
              </div>
              <span
                className={`font-semibold text-lg hidden sm:block transition-colors duration-300 ${
                  scrolled
                    ? 'text-green-400 group-hover:text-green-300'
                    : 'text-white group-hover:text-green-300'
                }`}
              >
                PlantCare
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Notifications />

            {/* Dropdown para móviles */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-gray-700/70 hover:text-green-300 transition-all duration-300 transform hover:translate-y-[-1px]"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg shadow-black/20 overflow-hidden z-20">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-green-300 transition-colors duration-200 flex items-center gap-2"
                    >
                      {isLoggingOut ? (
                        <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <LogOut size={16} />
                      )}
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de cerrar sesión para pantallas más grandes */}
            <button
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-gray-700/70 hover:text-green-300 transition-all duration-300 transform hover:translate-y-[-1px] cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : (
                <LogOut size={18} />
              )}
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
