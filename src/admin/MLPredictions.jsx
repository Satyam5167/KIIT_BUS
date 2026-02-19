import { useState } from "react";
import { Brain, Upload, Bus, Truck, Play, CheckCircle, AlertCircle, FileText, Loader2, TrendingUp } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function MLPredictions() {
  const [file, setFile] = useState(null);
  const [buses, setBuses] = useState(5);
  const [shuttles, setShuttles] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const runPrediction = async () => {
    if (!file) {
      setError("Please upload a CSV file first.");
      return;
    }
    if (buses < 1 || shuttles < 1) {
      setError("Please enter valid vehicle counts.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("buses", buses);
    formData.append("shuttles", shuttles);

    try {
      const response = await fetch("http://localhost:4000/api/ml/phase1", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch predictions");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runPhase2 = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/api/ml/phase2", {
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch Phase 2 predictions");
      }

      const data = await response.json();
      // Merge phase 2 results into existing result object or handle separately
      setResult(prev => ({
        ...prev,
        ...data,
        // Assuming backend returns phase 2 result in a 'result' key that needs to be merged 
        // or we can just append the second_round_assignments to the existing result if structure allows.
        // Based on user input: "result": { "second_round_assignments": [...] }
        // We should probably just merge the inner 'result' object.
        result: {
          ...prev.result,
          ...data.result
        }
      }));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Brain className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">AI Transport Allocation</h1>
            <p className="text-slate-500">Upload demand data to optimize fleet allocation</p>
          </div>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-8">

            {/* File Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider">
                1. Upload Data (CSV)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${file ? 'border-green-500 bg-green-50' : 'border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-50'}`}>
                  {file ? (
                    <>
                      <FileText className="text-green-600 mb-2" size={32} />
                      <span className="font-semibold text-green-700 truncate max-w-full px-2">{file.name}</span>
                      <span className="text-xs text-green-600">Click to change</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-slate-400 mb-2 group-hover:text-indigo-500" size={32} />
                      <span className="font-medium text-slate-600 group-hover:text-indigo-700">Click to upload CSV</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider">
                2. Fleet Capability
              </label>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">Number of Buses</label>
                  <div className="relative">
                    <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      min="1"
                      value={buses}
                      onChange={(e) => setBuses(parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">Number of Shuttles</label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      min="1"
                      value={shuttles}
                      onChange={(e) => setShuttles(parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col justify-end gap-3">
              <Button
                onClick={runPrediction}
                disabled={loading || !file}
                className="w-full h-14 text-lg gap-2 shadow-xl shadow-indigo-200"
              >
                {loading && !result ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
                {loading && !result ? 'Processing...' : 'Run Simulation'}
              </Button>

              {result && !result.result.second_round_assignments && (
                <Button
                  onClick={runPhase2}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} />}
                  Run Phase 2 Optimization
                </Button>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fade-in">

            {/* Assignments Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                First Round Assignments
              </h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Vehicle</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Hostel</th>
                        <th className="px-6 py-4">Time Slot</th>
                        <th className="px-6 py-4">Assigned / Predict</th>
                        <th className="px-6 py-4">Utilization</th>
                        <th className="px-6 py-4">Trip Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {result.result.first_round_assignments.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-indigo-600">{item.vehicle_id}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.vehicle_type === 'Bus' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                              {item.vehicle_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-secondary">{item.hostel}</td>
                          <td className="px-6 py-4">{item.time_slot}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-700">{item.students_assigned}</span>
                            <span className="text-slate-400"> / {item.predicted_students}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${(item.capacity_used / item.capacity_total) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-500">
                                {Math.round((item.capacity_used / item.capacity_total) * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">
                            {item.start_time} - {item.end_time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Hostel Summary */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-secondary">Hostel Status Summary</h2>
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Hostel</th>
                          <th className="px-6 py-4">Served</th>
                          <th className="px-6 py-4">Remaining</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {result.result.hostel_first_round_summary.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 font-medium text-secondary">{item.hostel}</td>
                            <td className="px-6 py-4 text-green-600 font-bold">{item.served_in_first_round}</td>
                            <td className="px-6 py-4 text-red-500 font-bold">{item.remaining_after_first_round}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status_after_round_1 === 'Fully Served' ? 'bg-green-100 text-green-700' :
                                item.status_after_round_1 === 'Partially Served' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                {item.status_after_round_1}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Vehicle Fleet Status */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-secondary">Vehicle Fleet Usage</h2>
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Round 1</th>
                          <th className="px-6 py-4">Next Avail.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {result.result.vehicle_state_after_round_1.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 font-bold text-indigo-600">{item.vehicle_id}</td>
                            <td className="px-6 py-4 text-slate-500">{item.vehicle_type}</td>
                            <td className="px-6 py-4">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Completed</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-600">{item.available_from_time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>

            {/* Second Round Assignments */}
            {result.result.second_round_assignments && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                  <TrendingUp className="text-amber-500" />
                  Second Round Reassignments
                </h2>
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Vehicle</th>
                          <th className="px-6 py-4">From</th>
                          <th className="px-6 py-4">To Hostel</th>
                          <th className="px-6 py-4">Time Slot</th>
                          <th className="px-6 py-4">Assigned</th>
                          <th className="px-6 py-4">Reason</th>
                          <th className="px-6 py-4">Trip Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {result.result.second_round_assignments.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-indigo-600">{item.vehicle_id}</td>
                            <td className="px-6 py-4 text-slate-400 italic">{item.from_hostel}</td>
                            <td className="px-6 py-4 font-medium text-secondary">{item.to_hostel}</td>
                            <td className="px-6 py-4">{item.time_slot}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{item.students_assigned}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate" title={item.reason}>
                              {item.reason}
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-slate-500">
                              {item.start_time} - {item.arrival_time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          </div>
        )}
      </div>
    </div >
  );
}
