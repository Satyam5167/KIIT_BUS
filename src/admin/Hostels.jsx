import { Building, Users, AlertTriangle, Bus } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import Card from "../components/ui/Card";

export default function Hostels() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <AdminNavbar />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary tracking-tight">Hostel Demand</h1>
        <p className="text-slate-500 mt-1">Real-time monitoring of student waiting queues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-100/50">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Building size={24} />
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Normal</span>
          </div>
          <h3 className="text-xl font-bold text-secondary mb-1">Hostel B</h3>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
            <Bus size={14} /> 2 Buses Assigned
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Waiting</p>
              <p className="text-2xl font-bold text-secondary">78</p>
            </div>
            <Users size={32} className="text-slate-200" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-lg shadow-red-100/50">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase animate-pulse">Overcrowded</span>
          </div>
          <h3 className="text-xl font-bold text-secondary mb-1">Hostel K</h3>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
            <Bus size={14} /> 1 Bus Assigned
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Waiting</p>
              <p className="text-2xl font-bold text-red-600">112</p>
            </div>
            <Users size={32} className="text-red-100" />
          </div>
        </Card>
      </div>
    </div>
  );
}
