'use client'

import { Leaf, Sprout } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Login } from './login'
import { Register } from './register'
import type { AuthTab } from '../../types'

export function Auth() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [animateTab, setAnimateTab] = useState(false)

  // Efecto para la animación al cambiar de pestaña
  useEffect(() => {
    setAnimateTab(true)
    const timer = setTimeout(() => setAnimateTab(false), 300)
    return () => clearTimeout(timer)
  }, [activeTab])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-gray-800/70 shadow-2xl border border-gray-700/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-green-500/10">
        {/* Logo and App Name */}
        <div className="bg-gradient-to-r from-green-900/80 via-green-800/80 to-green-900/80 p-6 text-center border-b border-green-800/50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-5 right-10 w-16 h-16 bg-green-400/10 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md"></div>
                <Leaf className="h-8 w-8 text-green-400 relative z-10" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
                PlantCare
              </h1>
            </div>
            <p className="mt-2 text-sm text-green-300/80">
              Tu compañero para el cuidado de plantas
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-gray-700/50">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-4 text-center font-medium transition-all duration-300 cursor-pointer relative overflow-hidden ${
              activeTab === 'login'
                ? 'bg-gray-700/50 text-green-400'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/30 hover:text-green-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Leaf
                className={`h-4 w-4 ${
                  activeTab === 'login' ? 'text-green-400' : 'text-gray-400'
                }`}
              />
              <span>Iniciar Sesión</span>
            </div>
            {activeTab === 'login' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400/50 via-green-500 to-green-400/50"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-4 text-center font-medium transition-all duration-300 cursor-pointer relative overflow-hidden ${
              activeTab === 'register'
                ? 'bg-gray-700/50 text-green-400'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/30 hover:text-green-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sprout
                className={`h-4 w-4 ${
                  activeTab === 'register' ? 'text-green-400' : 'text-gray-400'
                }`}
              />
              <span>Registrarse</span>
            </div>
            {activeTab === 'register' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400/50 via-green-500 to-green-400/50"></div>
            )}
          </button>
        </div>

        {/* Form Container with Animation */}
        <div
          className={`transition-all duration-300 ${
            animateTab ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Login Form */}
          <Login activeTab={activeTab} />

          {/* Register Form */}
          <Register activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
