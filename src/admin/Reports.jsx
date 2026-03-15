import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { BarChart3, TrendingUp, Clock, Users, Bus, AlertCircle } from "lucide-react";
import Card from "../components/ui/Card";

// ─── Dummy data ───────────────────────────────────────────────────────────────
const dailyRides = [
  { day: "Mon", rides: 980,  capacity: 1200 },
  { day: "Tue", rides: 1140, capacity: 1200 },
  { day: "Wed", rides: 1248, capacity: 1200 },
  { day: "Thu", rides: 1075, capacity: 1200 },
  { day: "Fri", rides: 1340, capacity: 1200 },
  { day: "Sat", rides: 620,  capacity: 1200 },
  { day: "Sun", rides: 210,  capacity: 1200 },
];

const waitTrend = [
  { time: "6 AM",  wait: 3  },
  { time: "7 AM",  wait: 7  },
  { time: "8 AM",  wait: 14 },
  { time: "9 AM",  wait: 11 },
  { time: "10 AM", wait: 5  },
  { time: "12 PM", wait: 8  },
  { time: "2 PM",  wait: 6  },
  { time: "4 PM",  wait: 12 },
  { time: "6 PM",  wait: 9  },
  { time: "8 PM",  wait: 4  },
];

const utilizationByRoute = [
  { route: "KH-7",  util: 92 },
  { route: "KH-11", util: 78 },
  { route: "KH-3",  util: 85 },
  { route: "KH-15", util: 61 },
  { route: "KH-2",  util: 74 },
  { route: "KH-9",  util: 88 },
];

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="!p-5 border-0 shadow-sm border border-slate-100 hover:border-primary/20">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <h3 className="text-2xl font-black text-secondary mt-1 mb-0.5">{value}</h3>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </Card>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Reports() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary tracking-tight">Analytics & Reports</h1>
        <p className="text-slate-500 mt-1">Live performance metrics and usage statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users}      label="Daily Rides"      value="1,248"        sub="↑ 6% vs yesterday"      color="bg-blue-50 text-blue-600" />
        <StatCard icon={Clock}      label="Peak Hour"        value="8 – 9 AM"     sub="Highest congestion"      color="bg-orange-50 text-orange-600" />
        <StatCard icon={TrendingUp} label="Avg Wait"         value="6 mins"       sub="↓ 1 min vs last week"   color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={BarChart3}  label="Bus Utilization"  value="82%"          sub="5 routes above 80%"      color="bg-purple-50 text-purple-600" />
      </div>

      {/* Charts row 1: Daily usage + Wait time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Rides Bar Chart */}
        <Card className="!p-6 border-0 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-secondary">Daily Ridership</h2>
              <p className="text-xs text-slate-400 mt-0.5">Rides vs. fleet capacity this week</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" />Rides</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />Capacity</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyRides} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rides"    fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Wait Time Line Chart */}
        <Card className="!p-6 border-0 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-secondary">Wait Time Throughout Day</h2>
              <p className="text-xs text-slate-400 mt-0.5">Average minutes — today</p>
            </div>
            <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={waitTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={32} unit="m" />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="wait"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ fill: '#f97316', r: 3 }}
                activeDot={{ r: 5 }}
                name="Wait (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2: Route utilization */}
      <Card className="!p-6 border-0 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-secondary">Route Utilization</h2>
            <p className="text-xs text-slate-400 mt-0.5">% of passengers vs. bus capacity per route</p>
          </div>
          <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center">
            <Bus size={16} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={utilizationByRoute} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <YAxis type="category" dataKey="route" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="util" name="Utilization %" radius={[0, 4, 4, 0]}
              fill="#7c3aed"
              background={{ fill: '#f1f5f9', radius: [0, 4, 4, 0] }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 mt-6 text-xs text-slate-400">
        <AlertCircle size={13} />
        All data shown above is illustrative dummy data. Connect real analytics APIs to replace.
      </div>
    </div>
  );
}
