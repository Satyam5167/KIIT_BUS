import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  const { addToast } = ctx;
  return {
    success: (message, opts)  => addToast({ message, type: 'success', ...opts }),
    error:   (message, opts)  => addToast({ message, type: 'error',   ...opts }),
    info:    (message, opts)  => addToast({ message, type: 'info',    ...opts }),
  };
}

// ─── Individual Toast ─────────────────────────────────────────────────────────
const configs = {
  success: {
    icon:        CheckCircle2,
    iconClass:   'text-emerald-500',
    barClass:    'bg-emerald-500',
    borderClass: 'border-l-emerald-500',
  },
  error: {
    icon:        XCircle,
    iconClass:   'text-red-500',
    barClass:    'bg-red-500',
    borderClass: 'border-l-red-500',
  },
  info: {
    icon:        Info,
    iconClass:   'text-blue-500',
    barClass:    'bg-blue-500',
    borderClass: 'border-l-blue-500',
  },
};

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const cfg = configs[toast.type] || configs.info;
  const Icon = cfg.icon;

  // Entrance animation
  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), toast.duration - 400);
    const remove = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, []);

  return (
    <div
      className={`
        flex items-start gap-3 bg-white border border-slate-200 border-l-4 ${cfg.borderClass}
        rounded-xl shadow-lg shadow-slate-200/60 px-4 py-3.5 min-w-[280px] max-w-sm
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
    >
      <Icon size={19} className={`${cfg.iconClass} mt-0.5 shrink-0`} />
      <p className="text-sm font-medium text-slate-700 flex-1 leading-tight">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${cfg.barClass} origin-left`}
          style={{ animation: `shrink ${toast.duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div key={t.id} className="relative">
          <Toast toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
