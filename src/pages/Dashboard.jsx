import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Bus, Clock, ChevronRight, Star, Shield } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-10">
      {/* HERO SECTION */}
      <section className="relative bg-primary text-white pt-10 pb-24 md:pb-32 px-6 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-xl shadow-blue-900/20">
        {/* Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/10 rounded-full blur-3xl rotate-12" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[150%] bg-blue-600/30 rounded-full blur-3xl -rotate-12" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-white/10">
                <Star size={12} className="text-yellow-300" fill="currentColor" />
                <span>Official Campus Transport</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
                Smart Ride <br />
                <span className="text-blue-200">Better Campus.</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
                Real-time tracking, accurate schedules, and seamless transit for everyone at KIIT.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/select-route" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full h-14 text-lg shadow-lg shadow-blue-900/20">
                    Find a Bus
                  </Button>
                </Link>
                <Link to="/live-tracking" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full h-14 text-lg bg-white/10 text-white hover:bg-white/20 border-white/20 border">
                    Live Map
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:w-1/2 w-full"
          >
            {/* Abstract App Preview / Illustration */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  <Bus className="text-orange-900" size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">Arriving Now</p>
                  <p className="text-blue-100 text-sm">Route 4 • Campus 12</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold text-2xl">2 <span className="text-sm font-normal">min</span></p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 flex gap-4 items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-green-400 rounded-full" />
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                  <Navigation size={20} />
                </div>
              </div>
              <div className="text-center text-xs text-blue-200 mt-2">
                Live GPS Tracking Active
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active Booking */}
          <Card className="!p-6 border-0 shadow-xl shadow-slate-200/50" hover>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                <Clock size={20} />
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Next Bus
              </span>
            </div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Upcoming</p>
            <h3 className="text-xl font-bold text-secondary mb-1">Campus 12 <span className="text-slate-400 font-normal">to</span> KIMS</h3>
            <p className="text-emerald-600 font-bold mb-4 flex items-center gap-1">
              <Clock size={16} /> 5 min away
            </p>
            <Link to="/live-tracking">
              <Button variant="outline" className="w-full text-sm py-2 h-auto">Track Now</Button>
            </Link>
          </Card>

          {/* Favorites */}
          <Card className="!p-6 border-0 shadow-xl shadow-slate-200/50" hover delay={0.1}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                <Star size={20} />
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Your Route</p>
            <h3 className="text-xl font-bold text-secondary mb-1">Route 5 Express</h3>
            <p className="text-slate-500 text-sm mb-4">
              Daily • 8:30 AM
            </p>
            <Link to="/select-route">
              <Button variant="outline" className="w-full text-sm py-2 h-auto">Book Seat</Button>
            </Link>
          </Card>

          {/* Notice */}
          <Card className="!p-6 border-0 shadow-xl shadow-slate-200/50" hover delay={0.2}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">
                INFO
              </span>
            </div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Safety</p>
            <h3 className="text-xl font-bold text-secondary mb-1">Safe Travel</h3>
            <p className="text-slate-500 text-sm mb-4">
              All buses sanitized daily and tracked via GPS.
            </p>
            <Button variant="ghost" className="w-full text-sm py-2 h-auto text-slate-400 pointer-events-none">Verified</Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-secondary mb-6 px-2">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/select-route" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-primary/30 transition-all text-center">
              <div className="w-12 h-12 mx-auto bg-blue-50 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bus size={24} />
              </div>
              <p className="font-bold text-secondary">Find Bus</p>
            </div>
          </Link>
          <Link to="/routes" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-primary/30 transition-all text-center">
              <div className="w-12 h-12 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <p className="font-bold text-secondary">Routes</p>
            </div>
          </Link>
          <Link to="/live-tracking" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-primary/30 transition-all text-center">
              <div className="w-12 h-12 mx-auto bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Navigation size={24} />
              </div>
              <p className="font-bold text-secondary">Track</p>
            </div>
          </Link>
          <Link to="/admin/login" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-primary/30 transition-all text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 text-slate-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <p className="font-bold text-secondary">Admin</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
