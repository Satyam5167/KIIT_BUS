import { Brain, TrendingUp, AlertCircle, Clock, ArrowRight } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function MLPredictions() {
  const predictions = [
    {
      hostel: 'Hostel K',
      time: '6:30 PM – 7:00 PM',
      action: 'Allocate Bus #12',
      level: 'High'
    },
    {
      hostel: 'Hostel B',
      time: '8:00 AM – 8:30 AM',
      action: 'Increase frequency',
      level: 'Medium'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Brain className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">AI Insights</h1>
            <p className="text-slate-500">Demand forecasting and automated suggestions</p>
          </div>
        </div>

        <div className="space-y-6">
          {predictions.map((p, i) => (
            <Card
              key={i}
              className={`!p-0 overflow-hidden border-l-8 ${p.level === 'High' ? 'border-l-red-500' : 'border-l-amber-400'
                }`}
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-secondary">{p.hostel}</h3>
                    {p.level === 'High' && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <AlertCircle size={12} /> Critical Demand
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mb-4">
                    <Clock size={16} />
                    <span className="font-medium text-sm">{p.time}</span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Recommended Action</p>
                    <div className="flex items-center gap-2 text-secondary font-semibold">
                      <TrendingUp className="text-indigo-600" size={18} />
                      {p.action}
                    </div>
                  </div>
                </div>

                <div className="self-end md:self-center">
                  <Button variant="outline" className="gap-2">
                    Apply Action <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
