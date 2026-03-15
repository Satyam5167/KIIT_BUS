import { useEffect, useState } from "react";
import { Bus, MapPin, Activity, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import API_BASE from "../apiBase";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useToast } from "../components/ui/Toast";

export default function Vehicles() {
  const toast = useToast();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [stops, setStops] = useState([]);
  const [editingBus, setEditingBus] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', source: '', destination: '' });
  
  const [addingBus, setAddingBus] = useState(false);
  const [addForm, setAddForm] = useState({ code: '', status: 'idle', source: '', destination: '' });

  const fetchBusRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE}/getBusRoutes`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bus routes:", err.message);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStops = async () => {
    try {
      const res = await fetch(`${API_BASE}/getStops`);
      if (res.ok) {
        setStops(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch stops");
    }
  };

  useEffect(() => {
    fetchBusRoutes();
    fetchStops();
  }, []);

  const statusConfig = {
    active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    idle: { label: "Idle", className: "bg-amber-100 text-amber-700 border-amber-200" },
    maintenance: { label: "Maintenance", className: "bg-red-100 text-red-700 border-red-200" },
  };

  const handleStatusChange = async (busId, newStatus) => {
    setUpdating(busId);
    try {
      const res = await fetch(`${API_BASE}/admin/updateBusStatus`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busId: busId,
          status: newStatus
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state to reflect change
      setBuses(prev => prev.map(bus => 
        bus.bus_id === busId ? { ...bus, status: newStatus } : bus
      ));
      toast.success("Bus status updated");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleEditClick = (bus) => {
    const route = bus.route || [];
    setEditForm({
      status: bus.status || 'idle',
      source: route.length > 0 ? String(route[0].stop_id) : '',
      destination: route.length > 0 ? String(route[route.length - 1].stop_id) : ''
    });
    setEditingBus(bus);
  };

  const handleSaveEdit = async () => {
    if (editForm.source && editForm.destination && editForm.source === editForm.destination) {
      toast.error("Source and destination cannot be the same.");
      return;
    }

    setUpdating(editingBus.bus_id);
    try {
      // 1. Update Status (if changed)
      if (editForm.status !== editingBus.status) {
        const resStatus = await fetch(`${API_BASE}/admin/updateBusStatus`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ busId: editingBus.bus_id, status: editForm.status })
        });
        if (!resStatus.ok) throw new Error("Failed to update status");
      }

      // 2. Update Route (if changed and both provided)
      const oldRoute = editingBus.route || [];
      const oldSource = oldRoute.length > 0 ? String(oldRoute[0].stop_id) : '';
      const oldDest = oldRoute.length > 0 ? String(oldRoute[oldRoute.length - 1].stop_id) : '';

      if (editForm.source && editForm.destination && 
         (editForm.source !== oldSource || editForm.destination !== oldDest)) {
        const resRoute = await fetch(`${API_BASE}/admin/updateBusRoute`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            busId: editingBus.bus_id, 
            stopIds: [parseInt(editForm.source), parseInt(editForm.destination)] 
          })
        });
        const d = await resRoute.json();
        if (!resRoute.ok) throw new Error(d.message || "Failed to update route");
      }

      await fetchBusRoutes();
      setEditingBus(null);
      toast.success("Vehicle updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save changes");
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveAdd = async () => {
    if (!addForm.code.trim()) {
      toast.error("Vehicle code is required.");
      return;
    }
    if (addForm.source && addForm.destination && addForm.source === addForm.destination) {
      toast.error("Source and destination cannot be the same.");
      return;
    }

    setUpdating('adding');
    try {
      const res = await fetch(`${API_BASE}/admin/addVehicle`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          vehicleCode: addForm.code, 
          status: addForm.status,
          sourceId: addForm.source ? parseInt(addForm.source) : null,
          destinationId: addForm.destination ? parseInt(addForm.destination) : null
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Failed to add vehicle");

      await fetchBusRoutes();
      setAddingBus(false);
      setAddForm({ code: '', status: 'idle', source: '', destination: '' });
      toast.success("Vehicle added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add vehicle");
    } finally {
      setUpdating(null);
    }
  };

  const filteredBuses = buses.filter(bus => {
    const search = searchTerm.toLowerCase();
    const matchCode = bus.bus_code?.toLowerCase().includes(search);
    const matchStatus = bus.status?.toLowerCase().includes(search);
    const sourceName = bus.route?.length > 0 ? bus.route[0].name.toLowerCase() : '';
    const destName = bus.route?.length > 0 ? bus.route[bus.route.length - 1].name.toLowerCase() : '';
    const matchRoute = sourceName.includes(search) || destName.includes(search);
    
    return matchCode || matchStatus || matchRoute;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuses = filteredBuses.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">Vehicle Fleet</h1>
          <p className="text-slate-500 mt-1">Monitor and manage bus status</p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by code, status, route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
            />
          </div>
          <Button icon={Plus} variant="primary" onClick={() => setAddingBus(true)} className="whitespace-nowrap w-full sm:w-auto justify-center">Add Vehicle</Button>
        </div>
      </div>

      <Card className="hidden md:block border-0 shadow-lg shadow-slate-200/50 overflow-hidden !p-0">
        {/* Desktop View (Table) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle ID</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Route</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg skeleton-shimmer" />
                        <div className="h-4 w-20 rounded-md skeleton-shimmer" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-40 rounded-md skeleton-shimmer" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 rounded-full skeleton-shimmer" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-12 rounded-lg skeleton-shimmer ml-auto" /></td>
                  </tr>
                ))
              ) : currentBuses.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No vehicles found matching your search.</td></tr>
              ) : (
                currentBuses.map((bus) => {
                  const status = statusConfig[bus.status] || statusConfig.idle;
                  return (
                    <tr key={bus.bus_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                            <Bus size={20} />
                          </div>
                          <span className="font-bold text-secondary">{bus.bus_code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={16} className="text-slate-400" />
                          {bus.route.length > 0 ? (
                            <span>
                              {bus.route[0].name} <span className="text-slate-300 mx-1">→</span> {bus.route[bus.route.length - 1].name}
                            </span>
                          ) : <span className="text-slate-400 italic">No route assigned</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={bus.status || "idle"}
                          onChange={(e) => handleStatusChange(bus.bus_id, e.target.value)}
                          disabled={updating === bus.bus_id}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border cursor-pointer outline-none focus:ring-2 focus:ring-slate-300 transition-all ${status.className} ${updating === bus.bus_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="active">Active</option>
                          <option value="idle">Idle</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:bg-blue-50"
                          onClick={() => handleEditClick(bus)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile View (Independent Cards) */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card flex flex-col gap-4">
              {/* Top row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-5 w-24 rounded-md skeleton-shimmer" />
                    <div className="h-3 w-16 rounded-md skeleton-shimmer" />
                  </div>
                </div>
                <div className="h-8 w-14 rounded-lg skeleton-shimmer" />
              </div>
              {/* Route row */}
              <div className="h-10 rounded-lg skeleton-shimmer" />
              {/* Status row */}
              <div className="h-12 rounded-lg skeleton-shimmer" />
            </div>
          ))
        ) : currentBuses.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">No vehicles found matching your search.</Card>
        ) : (
          currentBuses.map((bus) => {
            const status = statusConfig[bus.status] || statusConfig.idle;
            return (
              <Card key={bus.bus_id} className="flex flex-col p-5 gap-4 shadow-md shadow-slate-200/50 border-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                      <Bus size={24} />
                    </div>
                    <div>
                      <span className="font-bold text-secondary text-lg block">{bus.bus_code}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest">ID: {bus.bus_id}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary bg-blue-50/50 hover:bg-blue-100"
                    onClick={() => handleEditClick(bus)}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <MapPin size={18} className="text-slate-400 shrink-0" />
                  <div className="truncate">
                    {bus.route.length > 0 ? (
                      <span>
                        {bus.route[0].name} <span className="text-slate-300 mx-2">→</span> {bus.route[bus.route.length - 1].name}
                      </span>
                    ) : <span className="text-slate-400 italic">No route assigned</span>}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-lg border border-slate-100 gap-3">
                  <span className="text-sm font-semibold text-slate-500">Status</span>
                  <select
                    value={bus.status || "idle"}
                    onChange={(e) => handleStatusChange(bus.bus_id, e.target.value)}
                    disabled={updating === bus.bus_id}
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider border cursor-pointer outline-none focus:ring-2 focus:ring-slate-300 transition-all ${status.className} ${updating === bus.bus_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 px-2">
          <p className="text-sm text-slate-500 font-medium order-2 sm:order-1">
            Showing <span className="text-secondary font-bold">{indexOfFirstItem + 1}</span> to <span className="text-secondary font-bold">{Math.min(indexOfLastItem, filteredBuses.length)}</span> of <span className="text-secondary font-bold">{filteredBuses.length}</span> vehicles
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, and pages around current
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === pageNum 
                          ? "bg-primary text-white shadow-md shadow-blue-200" 
                          : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 3 && pageNum > 1) || 
                  (pageNum === currentPage + 3 && pageNum < totalPages)
                ) {
                  return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                }
                return null;
              })}
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBus && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in shadow-2xl">
            <h2 className="text-xl font-bold text-secondary">
              Edit Vehicle: {editingBus.bus_code}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Source Stop</label>
                <select
                  value={editForm.source}
                  onChange={(e) => setEditForm(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="">-- Select Source --</option>
                  {stops.map(stop => (
                    <option key={stop.id} value={stop.id}>{stop.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Destination Stop</label>
                <select
                  value={editForm.destination}
                  onChange={(e) => setEditForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="">-- Select Destination --</option>
                  {stops.map(stop => (
                    <option key={stop.id} value={stop.id}>{stop.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={() => setEditingBus(null)}
                disabled={updating === editingBus.bus_id}
              >
                Cancel
              </Button>
              <Button 
                className="shadow-md shadow-indigo-200"
                onClick={handleSaveEdit} 
                disabled={updating === editingBus.bus_id}
              >
                {updating === editingBus.bus_id ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {addingBus && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in shadow-2xl">
            <h2 className="text-xl font-bold text-secondary">
              Add New Vehicle
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Vehicle Code</label>
                <input
                  type="text"
                  placeholder="e.g. 5236"
                  value={addForm.code}
                  onChange={(e) => setAddForm(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Status</label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Source Stop (Optional)</label>
                <select
                  value={addForm.source}
                  onChange={(e) => setAddForm(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="">-- Select Source --</option>
                  {stops.map(stop => (
                    <option key={stop.id} value={stop.id}>{stop.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Destination Stop (Optional)</label>
                <select
                  value={addForm.destination}
                  onChange={(e) => setAddForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="">-- Select Destination --</option>
                  {stops.map(stop => (
                    <option key={stop.id} value={stop.id}>{stop.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setAddingBus(false);
                  setAddForm({ code: '', status: 'idle', source: '', destination: '' });
                }}
                disabled={updating === 'adding'}
              >
                Cancel
              </Button>
              <Button 
                className="shadow-md shadow-indigo-200"
                onClick={handleSaveAdd} 
                disabled={updating === 'adding'}
              >
                {updating === 'adding' ? 'Saving...' : 'Add Vehicle'}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
