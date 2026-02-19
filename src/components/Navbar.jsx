import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Navigation, LifeBuoy, AlertCircle, LogIn, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const isExcluded = location.pathname.startsWith('/admin') || location.pathname === '/admin/login' || location.pathname.startsWith('/driver'); // Hide on admin & driver routes

  if (isExcluded) return null;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Live', path: '/live-tracking', icon: MapPin },
    { label: 'Routes', path: '/routes', icon: Navigation },
    { label: 'Support', path: '/support', icon: LifeBuoy },
    { label: 'Complaints', path: '/complaints', icon: AlertCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* DESKTOP TOP BAR */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[2000]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                <circle cx="7" cy="18" r="2.5"></circle>
                <circle cx="17" cy="18" r="2.5"></circle>
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-blue-600">
              KiitTransport
            </span>
          </Link>

          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(item.path)
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-200/50'
                  }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            to="/admin/login"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-secondary text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
          >
            <LogIn size={16} />
            Admin
          </Link>
        </div>
      </nav>

      {/* MOBILE TOP BAR (Logo + Admin) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-[2000] h-14 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-800">Transport</span>
        </Link>
        <Link to="/admin/login" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:text-primary hover:bg-blue-50">
          <LogIn size={20} />
        </Link>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-1 px-4 z-[2000] pb-5">
        <div className="flex justify-between items-end">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 w-full transition-all duration-300 relative ${active ? 'text-primary transform -translate-y-2' : 'text-slate-400'
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                  />
                )}
                <item.icon size={active ? 24 : 22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

    </>
  );
}
