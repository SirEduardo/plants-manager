import { Leaf } from 'lucide-react'
import { useState } from 'react'
import { Login } from './login'
import { Register } from './register'
import { AuthTab } from '../../types'

export function Auth() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Logo and App Name */}
        <div className="bg-green-500 opacity-85 p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Leaf className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">PlantCare</h1>
          </div>
          <p className="mt-1 text-sm text-green-100">
            Your plant management companion
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-green-100">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-3 text-center font-medium transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'bg-green-50 text-green-800'
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 text-center font-medium transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'bg-green-50 text-green-800'
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        <Login activeTab={activeTab} />

        {/* Register Form */}
        <Register activeTab={activeTab} />
      </div>
    </div>
  )
}
