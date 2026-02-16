import { BarChart3, TrendingUp, Clock, Users } from "lucide-react";
import Card from "../components/ui/Card";

export default function Reports() {
  const reports = [
    { title: 'Daily Usage', value: '1,248 rides', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Peak Hour', value: '8:00 AM – 9:00 AM', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Avg Wait Time', value: '6 mins', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Bus Utilization', value: '82%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-2">Analytics Report</h1>
        <p className="text-slate-500 mb-10">Performance metrics and usage statistics</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reports.map((r, i) => (
            <Card key={i} className="!p-6 border-0 shadow-lg shadow-slate-200/50" hover delay={i * 0.1}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.bg} ${r.color}`}>
                  <r.icon size={24} />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{r.title}</p>
              <h3 className="text-2xl font-black text-secondary mt-1">{r.value}</h3>
            </Card>
          ))}
        </div>

        {/* Placeholder Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-80 flex items-center justify-center bg-white border border-slate-100">
            <p className="text-slate-400 font-medium">Usage Trends Chart (Placeholder)</p>
          </Card>
          <Card className="h-80 flex items-center justify-center bg-white border border-slate-100">
            <p className="text-slate-400 font-medium">Route Efficiency Chart (Placeholder)</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
