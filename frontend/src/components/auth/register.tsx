'use client'

import type React from 'react'

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react'
import { useState } from 'react'
import type { AuthTab } from '../../types'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { apiUrl } from '../../api/url'

interface RegisterProps {
  activeTab: AuthTab
}

export function Register({ activeTab }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log('Datos del formulario:', formData)
      // Realizamos el registro
      const registerResponse = await axios.post(
        `${apiUrl}/users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )

      if (registerResponse.status === 201) {
        console.log('Usuario registrado')

        // Intentamos hacer login automáticamente después del registro
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

        // Si el login es exitoso, redirigimos a la lista de plantas
        if (loginResponse.status === 200) {
          const { token } = loginResponse.data
          localStorage.setItem('token', token)
          navigate('/plantsList')
        }
      } else {
        console.error('Error al registrar el usuario', registerResponse)
        setError(
          'Error al registrar el usuario: ' + registerResponse.data.message
        )
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Error desconocido'
        setError(errorMessage)
        console.error('Error del backend:', errorMessage)
      } else {
        console.error('Error inesperado:', error)
        setError('Ocurrió un error inesperado. Inténtalo más tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (error) setError(null)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.target
    setTouched((prev) => ({ ...prev, [id]: true }))
  }

  const isUsernameValid = (username: string) => {
    return username.length >= 3
  }

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isPasswordValid = (password: string) => {
    return password.length >= 6
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return 0
    if (password.length < 6) return 1
    if (password.length < 8) return 2
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      return 4
    if (
      (/[A-Z]/.test(password) && /[0-9]/.test(password)) ||
      (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) ||
      (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password))
    )
      return 3
    return 2
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordStrengthText = ['', 'Débil', 'Moderada', 'Buena', 'Fuerte']
  const passwordStrengthColor = [
    '',
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ]

  return (
    <div>
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="p-6 bg-gray-800/30">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-green-400 mb-2">
              Crear Cuenta Nueva
            </h2>
            <p className="text-sm text-gray-300">
              Únete para empezar a gestionar tus plantas
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-green-400"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full rounded-md border ${
                    touched.username && !isUsernameValid(formData.username)
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-green-500'
                  } bg-gray-700/70 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isUsernameValid(formData.username) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {touched.username && !isUsernameValid(formData.username) && (
                <p className="text-xs text-red-400 mt-1">
                  El nombre de usuario debe tener al menos 3 caracteres
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-400"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
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
                {touched.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEmailValid(formData.email) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-400"
              >
                Contraseña
              </label>
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

              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-400">Seguridad:</div>
                    <div
                      className={`text-xs ${
                        passwordStrength === 1
                          ? 'text-red-400'
                          : passwordStrength === 2
                          ? 'text-yellow-400'
                          : passwordStrength === 3
                          ? 'text-blue-400'
                          : 'text-green-400'
                      }`}
                    >
                      {passwordStrengthText[passwordStrength]}
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrengthColor[passwordStrength]} transition-all duration-300`}
                      style={{ width: `${passwordStrength * 25}%` }}
                    ></div>
                  </div>
                  {touched.password && !isPasswordValid(formData.password) && (
                    <p className="text-xs text-red-400 mt-1">
                      La contraseña debe tener al menos 6 caracteres
                    </p>
                  )}
                </div>
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
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <span>Crear Cuenta</span>
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
