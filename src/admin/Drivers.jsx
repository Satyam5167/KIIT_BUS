import { useEffect, useState } from "react";
import { User, Phone, Bus, Trash2, Plus, Pencil, X, ChevronLeft, ChevronRight, Search, Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import API_BASE from "../apiBase";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useToast } from "../components/ui/Toast";

const ITEMS_PER_PAGE = 8;

// ─── Add Driver Modal ─────────────────────────────────────────────────────────
function AddDriverModal({ buses, onClose, onAdded, toast }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", busId: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Name, email and password are required."); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/addDriver`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          password: form.password,
          busId: form.busId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add driver");
      onAdded({
        id: String(data.userId),
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        vehicle: buses.find(b => b.id === Number(form.busId))?.code || null,
        bus_id: form.busId || null,
        status: "active",
      });
      toast.success(`Driver "${form.name.trim()}" added successfully`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/40 text-secondary placeholder:text-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Plus size={17} />
            </div>
            <h3 className="text-lg font-bold text-secondary">Add New Driver</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-100">
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name *</label>
            <input className={inputCls} placeholder="e.g. Ravi Kumar" value={form.name} onChange={set("name")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label>
            <input type="email" className={inputCls} placeholder="driver@kiit.ac.in" value={form.email} onChange={set("email")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
            <input className={inputCls} placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={set("phone")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputCls + " pr-10"}
                placeholder="Temporary password"
                value={form.password}
                onChange={set("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assign Bus (optional)</label>
            <div className="relative">
              <Bus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={form.busId}
                onChange={set("busId")}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/40 text-secondary bg-white cursor-pointer"
              >
                <option value="">-- No bus assigned yet --</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>{b.code}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-200"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Adding…" : "Add Driver"}
          </button>
        </div>
      </div>
    </div>
  );
}



// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditDriverModal({ driver, buses, onClose, onUpdated, onDeleted, toast }) {
  const [name, setName] = useState(driver.name || "");
  const [busId, setBusId] = useState(driver.bus_id || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/updateDriver/${driver.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), busId: busId || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Update failed");
      }
      onUpdated(driver.id, name.trim(), busId, buses.find(b => b.id === Number(busId))?.code);
      toast.success("Driver updated successfully");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/deleteDriver/${driver.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }
      onDeleted(driver.id);
      toast.success("Driver removed successfully");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User size={17} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary">Edit Driver</h3>
              <p className="text-xs text-slate-400">ID: {driver.id?.substring(0, 8)}…</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-100">
              <AlertTriangle size={15} />
              {error}
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/40 text-secondary"
              placeholder="Enter driver name"
            />
          </div>

          {/* Bus Assignment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assign Bus</label>
            <div className="relative">
              <Bus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/40 text-secondary bg-white cursor-pointer"
              >
                <option value="">-- Keep current ({driver.vehicle || "Unassigned"}) --</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>{b.code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Delete zone */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 mt-1 transition-colors"
            >
              <Trash2 size={15} /> Remove this driver permanently
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-sm text-red-700 font-medium">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 text-sm py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 text-sm py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  {deleting ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-200"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Drivers() {
  const toast = useToast();
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [drRes, busRes] = await Promise.all([
          fetch(`${API_BASE}/admin/getDriverDetails`, { credentials: "include" }),
          fetch(`${API_BASE}/getBusRoutes`,           { credentials: "include" }),
        ]);
        const drData  = drRes.ok  ? await drRes.json()  : [];
        const busData = busRes.ok ? await busRes.json() : [];
        setDrivers(Array.isArray(drData)  ? drData  : []);
        // getBusRoutes returns objects with bus_id + bus_code; normalise to {id, code}
        setBuses(
          (Array.isArray(busData) ? busData : []).map(b => ({
            id:   b.bus_id  ?? b.id,
            code: b.bus_code ?? b.code,
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

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

  const totalPages   = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);
  const indexOfFirst = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexOfLast  = indexOfFirst + ITEMS_PER_PAGE;
  const currentDrivers = filteredDrivers.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUpdated = (userId, newName, newBusId, newBusCode) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === userId
          ? { ...d, name: newName, bus_id: newBusId || d.bus_id, vehicle: newBusCode || d.vehicle }
          : d
      )
    );
  };

  const handleDeleted = (userId) => {
    setDrivers((prev) => prev.filter((d) => d.id !== userId));
  };

  const handleAdded = (newDriver) => {
    setDrivers((prev) => [newDriver, ...prev]);
    setCurrentPage(1);
  };

  // Skeleton components
  const DesktopSkeleton = () =>
    [...Array(ITEMS_PER_PAGE)].map((_, i) => (
      <tr key={i}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton-shimmer" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-28 rounded-md skeleton-shimmer" />
              <div className="h-3 w-16 rounded-md skeleton-shimmer" />
            </div>
          </div>
        </td>
        <td className="px-6 py-4"><div className="h-4 w-28 rounded-md skeleton-shimmer" /></td>
        <td className="px-6 py-4"><div className="h-6 w-24 rounded-full skeleton-shimmer" /></td>
        <td className="px-6 py-4"><div className="h-6 w-16 rounded-full skeleton-shimmer" /></td>
        <td className="px-6 py-4 text-right"><div className="h-9 w-9 rounded-lg skeleton-shimmer ml-auto" /></td>
      </tr>
    ));

  const MobileSkeleton = () =>
    [...Array(5)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton-shimmer" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-28 rounded-md skeleton-shimmer" />
              <div className="h-3 w-16 rounded-md skeleton-shimmer" />
            </div>
          </div>
          <div className="h-5 w-14 rounded-full skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 w-full rounded-md skeleton-shimmer" />
          <div className="h-4 w-full rounded-md skeleton-shimmer" />
        </div>
        <div className="h-9 rounded-lg skeleton-shimmer" />
      </div>
    ));

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
      status === "active" ? "bg-emerald-100 text-emerald-700" :
      status === "idle"   ? "bg-amber-100 text-amber-700"    :
                            "bg-red-100 text-red-700"
    }`}>{status || "Unknown"}</span>
  );

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">Driver Management</h1>
          <p className="text-slate-500 mt-1">Manage driver accounts and assignments</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={() => setShowAddModal(true)}>Add New Driver</Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, phone, vehicle, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
        />
      </div>

      {/* Desktop Table */}
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
              {loading ? <DesktopSkeleton /> : currentDrivers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No drivers found{searchTerm ? ` matching "${searchTerm}"` : ""}.
                  </td>
                </tr>
              ) : (
                currentDrivers.map((d, idx) => (
                  <tr key={d.id || idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-secondary text-sm">{d.name}</p>
                          <p className="text-xs text-slate-400">ID: #{d.id?.substring(0, 6) ?? "UNK"}</p>
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
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingDriver(d)}
                        className="text-slate-400 hover:text-primary hover:bg-primary/10"
                      >
                        <Pencil size={17} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? <MobileSkeleton /> : currentDrivers.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No drivers found{searchTerm ? ` matching "${searchTerm}"` : ""}.
          </div>
        ) : (
          currentDrivers.map((d, idx) => (
            <Card key={d.id || idx} className="p-4 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-secondary text-sm">{d.name}</p>
                    <p className="text-xs text-slate-400">ID: #{d.id?.substring(0, 6) ?? "UNK"}</p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400" />{d.phone || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Bus size={14} className="text-slate-400" />{d.vehicle || "Unassigned"}
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-slate-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDriver(d)}
                  className="w-full justify-center gap-2"
                >
                  <Pencil size={15} /> Edit Driver
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 px-2">
          <p className="text-sm text-slate-500 font-medium order-2 sm:order-1">
            Showing <span className="text-secondary font-bold">{indexOfFirst + 1}</span> to{" "}
            <span className="text-secondary font-bold">{Math.min(indexOfLast, filteredDrivers.length)}</span> of{" "}
            <span className="text-secondary font-bold">{filteredDrivers.length}</span> drivers
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button variant="ghost" size="sm" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40">
              <ChevronLeft size={20} />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                  return (
                    <button key={p} onClick={() => paginate(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === p
                          ? "bg-primary text-white shadow-md shadow-blue-200"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                      }`}>
                      {p}
                    </button>
                  );
                } else if ((p === currentPage - 3 && p > 1) || (p === currentPage + 3 && p < totalPages)) {
                  return <span key={p} className="px-1 text-slate-400">…</span>;
                }
                return null;
              })}
            </div>
            <Button variant="ghost" size="sm" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDriver && (
        <EditDriverModal
          driver={editingDriver}
          buses={buses}
          onClose={() => setEditingDriver(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
          toast={toast}
        />
      )}

      {showAddModal && (
        <AddDriverModal
          buses={buses}
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
          toast={toast}
        />
      )}
    </div>
  );
}
