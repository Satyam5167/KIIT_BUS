import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
  e.preventDefault()

  localStorage.setItem('isAdmin', 'true')
  navigate('/admin')
}


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8 border-l-4 border-red-500">
        <h1 className="text-3xl font-bold text-dark mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-6">
          Restricted access — Transport Department only
        </p>

        {error && (
          <div className="mb-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@kiit.ac.in"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  )
}
