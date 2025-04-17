'use client'

import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { AuthTab } from '../../types'
import axios from 'axios'
import { apiUrl } from '../../api/url'

interface LoginProps {
  activeTab: AuthTab
}

export function Login({ activeTab }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const loginResponse = await axios.post(
        `${apiUrl}/users/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )
      console.log('respuesta del login', loginResponse)

      if (loginResponse.status === 200) {
        console.log('Usuario autenticado, verificando token...')

        const authResponse = await axios.get(`${apiUrl}/auth`, {
          withCredentials: true
        })

        if (authResponse.status === 200) {
          console.log('Token verificado. Redirigiendo...')
          navigate('/plantsList')
        } else {
          console.error('El token no fue verificado aún. No redirigimos.')
          setError('Error de autenticación. Inténtalo de nuevo.')
        }
      } else {
        console.error(
          'Error al iniciar sesión después del login',
          loginResponse
        )
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Error desconocido'
        setError('Usuario o contraseña incorrecta')
        console.error('Error del backend:', errorMessage)
      } else {
        console.error('Error inesperado:', error)
        setError('Ocurrió un error inesperado. Inténtalo más tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (error) setError('')
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.target
    setTouched((prev) => ({ ...prev, [id]: true }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isPasswordValid = (password: string) => {
    return password.length >= 6
  }

  return (
    <div>
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="p-6 bg-gray-800/30">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-green-400 mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-sm text-gray-300">
              Inicia sesión para ver y gestionar tus plantas
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-400"
              >
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full rounded-md border ${
                    touched.email && !isEmailValid(formData.email)
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-green-500'
                  } bg-gray-700/70 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.email && !isEmailValid(formData.email) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                )}
              </div>
              {touched.email && !isEmailValid(formData.email) && (
                <p className="text-xs text-red-400 mt-1">
                  Por favor, introduce un email válido
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-green-400"
                >
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-green-400 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full rounded-md border ${
                    touched.password && !isPasswordValid(formData.password)
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-green-500'
                  } bg-gray-700/70 py-2 pl-10 pr-10 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400 transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {touched.password && !isPasswordValid(formData.password) && (
                <p className="text-xs text-red-400 mt-1">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-md cursor-pointer ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20'
              } py-2.5 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:translate-y-[-2px] flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-center">
              <p className="text-red-400 text-sm flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  )
}
