import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import API_BASE from '../apiBase'

export default function AdminGuard() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: 'include' 
        })

        if (!res.ok) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        const data = await res.json()

        if (data.role === 'admin') {
          setIsAdmin(true)
        }

        setLoading(false)
      } catch {
        setIsAdmin(false)
        setLoading(false)
      }
    }

    checkAdmin()
  }, [])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-600 font-semibold">Checking admin access…</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
