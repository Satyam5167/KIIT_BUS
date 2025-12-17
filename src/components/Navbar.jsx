import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Show Buses', path: '/' },
    { label: 'Live Tracking', path: '/live-tracking' },
    { label: 'Routes', path: '/routes' },
    { label: 'Support', path: '/support' },
    { label: 'Complaints', path: '/complaints' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="1" y="6" width="22" height="12" rx="2"></rect>
                <circle cx="7" cy="19" r="2"></circle>
                <circle cx="17" cy="19" r="2"></circle>
              </svg>
            </div>
            <span className="text-xl font-bold text-dark">KiitBus</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-600 hover:text-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* ADMIN LINK */}
            <Link
              to="/admin/login"
              className={`font-semibold px-4 py-2 rounded-lg transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'bg-primary text-dark'
                  : 'text-primary hover:bg-yellow-100'
              }`}
            >
              Admin Portal
            </Link>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-300 flex items-center justify-center font-bold text-dark cursor-pointer">
              KB
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-slate">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-primary text-dark font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* MOBILE ADMIN LINK */}
            <Link to="/admin/login"
  className={`font-bold px-5 py-2 rounded-lg transition-all duration-200
    ${
      location.pathname.startsWith('/admin')
        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg ring-2 ring-red-400'
        : 'bg-gradient-to-r from-primary to-yellow-400 text-dark hover:shadow-lg hover:scale-105'
    }
  `}
>
  Admin Portal
</Link>


          </div>
        )}
      </div>
    </nav>
  )
}
