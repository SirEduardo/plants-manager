import { Link, useLocation } from 'react-router'

export function Header() {
  const { pathname } = useLocation()
  return (
    <div>
      <header className="flex gap-10 p-4 justify-end">
        <div className="flex gap-10">
          <Link to={pathname === '/' ? '/add-plants' : '/'}>
            <button className="cursor-pointer">
              {pathname === '/'
                ? 'Añadir plantas'
                : pathname === '/add-plants'
                ? 'home'
                : ''}
            </button>
          </Link>
          <button className="cursor-pointer">Cerrar sesion</button>
        </div>
      </header>
    </div>
  )
}
