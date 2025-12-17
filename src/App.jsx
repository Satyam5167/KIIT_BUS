import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Student pages
import Dashboard from './pages/Dashboard'
import SelectRoute from './pages/SelectRoute'
import LiveTracking from './pages/LiveTracking'
import RoutesPage from './pages/Routes'
import Support from './pages/Support'
import Complaints from './pages/Complaints'

// Admin pages
import AdminDashboard from './admin/AdminDashboard'
import Vehicles from './admin/Vehicles'
import Hostels from './admin/Hostels'
import Drivers from './admin/Drivers'
import Reports from './admin/Reports'
import LiveMap from './admin/LiveMap'
import MLPredictions from './admin/MLPredictions'
import AdminLogin from './admin/AdminLogin'
import AdminGuard from './admin/AdminGuard'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        <main className="flex-1 pt-16">
          <Routes>
            {/* STUDENT ROUTES */}
            <Route path="/" element={<SelectRoute />} />
            <Route path="/live-tracking" element={<LiveTracking />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/complaints" element={<Complaints />} />

            {/* ADMIN LOGIN */}
            <Route path="/admin/login" element={<AdminLogin />} />

          
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<AdminDashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="hostels" element={<Hostels />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="live-map" element={<LiveMap />} />
              <Route path="ml" element={<MLPredictions />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}
