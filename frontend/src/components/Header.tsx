import { Home, LogOut, PlusCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router'

export function Header() {
  const { pathname } = useLocation()
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-green-500 p-1.5 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M6.8 22L12 13.9 17.2 22M12 2V14"></path>
                </svg>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">
                PlantCare
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={pathname === '/' ? '/add-plants' : '/'}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors
                ${
                  pathname === '/' || pathname === '/add-plants'
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              {pathname === '/' ? (
                <>
                  <PlusCircle size={18} />
                  <span className="hidden sm:block">Añadir plantas</span>
                </>
              ) : pathname === '/add-plants' ? (
                <>
                  <Home size={18} />
                  <span className="hidden sm:block">Inicio</span>
                </>
              ) : null}
            </Link>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={() => {
                /* Logout logic here */
              }}
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
