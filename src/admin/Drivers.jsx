import { useEffect, useState } from "react";
import { User, Phone, Bus, Trash2, Plus, Shield } from "lucide-react";
import API_BASE from "../apiBase";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [driverToDelete, setDriverToDelete] = useState(null);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/getDriverDetails`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch drivers:", err.message);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // INITIATE DELETE
  const handleDeleteClick = (driver) => {
    setDriverToDelete(driver);
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    if (!driverToDelete) return;
    const { id: driverId } = driverToDelete;

    try {
      setDeletingId(driverId);

      const res = await fetch(
        `${API_BASE}/admin/deleteDriver/${driverId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error(`Delete failed (${res.status})`);

      // Remove driver from UI instantly
      setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    } catch (err) {
      console.error("Failed to delete driver:", err.message);
      alert("Failed to delete driver. Please try again.");
    } finally {
      setDeletingId(null);
      setDriverToDelete(null);
    }
  };

  // FILTER DRIVERS
  const filteredDrivers = drivers.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.name?.toLowerCase().includes(term) ||
      d.id?.toLowerCase().includes(term) ||
      d.phone?.toLowerCase().includes(term) ||
      d.vehicle?.toLowerCase().includes(term) ||
      d.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">Driver Management</h1>
          <p className="text-slate-500 mt-1">Manage driver accounts and assignments</p>
        </div>
        <Button icon={Plus} variant="primary">Add New Driver</Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search drivers by name, ID, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block border-0 shadow-lg shadow-slate-200/50 overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Driver Info</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading drivers...</td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No drivers found matching "{searchTerm}"</td>
                </tr>
              ) : (
                filteredDrivers.map((d, idx) => (
                  <tr key={d.id || d._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-secondary text-sm">{d.name}</p>
                          <p className="text-xs text-slate-400">ID: #{d.id ? d.id.substring(0, 6) : 'UNK'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {d.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
                        <Bus size={14} className="text-slate-500" />
                        {d.vehicle || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${d.status === "active" ? "bg-emerald-100 text-emerald-700" :
                        d.status === "idle" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                        }`}>
                        {d.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(d)}
                        isLoading={deletingId === d.id}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading drivers...</div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No drivers found matching "{searchTerm}"</div>
        ) : (
          filteredDrivers.map((d, idx) => (
            <Card key={d.id || d._id || idx} className="p-4 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-secondary text-sm">{d.name}</p>
                    <p className="text-xs text-slate-400">ID: #{d.id ? d.id.substring(0, 6) : 'UNK'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${d.status === "active" ? "bg-emerald-100 text-emerald-700" :
                  d.status === "idle" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>
                  {d.status || "Unknown"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  {d.phone || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Bus size={14} className="text-slate-400" />
                  {d.vehicle || "Unassigned"}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(d)}
                  isLoading={deletingId === d.id}
                  className="text-red-500 hover:bg-red-50 w-full justify-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Remove Driver
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {driverToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Delete Driver?</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to remove <span className="font-bold text-secondary">{driverToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 w-full justify-center"
                  onClick={() => setDriverToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 w-full justify-center bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                  onClick={confirmDelete}
                  isLoading={deletingId === driverToDelete.id}
                >
                  {deletingId ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
