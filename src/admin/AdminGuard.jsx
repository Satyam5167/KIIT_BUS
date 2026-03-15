import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import API_BASE from '../apiBase'
import AdminSidebar from '../components/AdminSidebar'
import { Menu, Bus } from 'lucide-react'

// Full-screen skeleton that matches the real sidebar+content layout
function AdminLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Skeleton sidebar */}
      <div className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-slate-900/95 p-6 gap-4">
        {/* Logo area */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg skeleton-shimmer opacity-30" />
          <div className="h-5 w-24 rounded-md skeleton-shimmer opacity-20" />
        </div>
        {/* Nav links */}
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-5 h-5 rounded skeleton-shimmer opacity-20" />
            <div className={`h-4 rounded-md skeleton-shimmer opacity-20`} style={{ width: `${55 + i * 7}px` }} />
          </div>
        ))}
      </div>

      {/* Skeleton content area */}
      <div className="flex-1 p-6 md:p-10 space-y-6">
        {/* Header bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-72 rounded-md skeleton-shimmer" />
          </div>
          <div className="h-10 w-32 rounded-xl skeleton-shimmer" />
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
              <div className="h-3 w-20 rounded skeleton-shimmer" />
              <div className="h-7 w-16 rounded-lg skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Content block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 h-64 skeleton-shimmer" />
          <div className="bg-white rounded-2xl border border-slate-100 p-6 h-64 skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default function AdminGuard() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, { credentials: 'include' })
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        if (data.role === 'admin') setIsAdmin(true)
      } catch {
        // no-op, isAdmin stays false
      } finally {
        setLoading(false)
      }
    }
    checkAdmin()
  }, [])

  if (loading) return <AdminLoadingSkeleton />
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 w-full min-w-0 transition-all duration-300">
        {/* Mobile top bar */}
        <div className="md:hidden h-14 bg-white border-b border-slate-100 flex items-center px-4 justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 font-bold text-secondary">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Bus size={14} className="text-white" />
            </div>
            KiitAdmin
          </div>
          <div className="w-9" />
        </div>

        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
