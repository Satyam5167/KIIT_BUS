import { Navigate, Outlet } from 'react-router-dom'

export default function AdminGuard() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />
}
