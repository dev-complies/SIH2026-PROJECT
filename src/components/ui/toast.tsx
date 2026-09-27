"use client";

import * as React from "react";
import { cn } from "@/utils";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const showToast = React.useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-control border p-3.5 shadow-lg flex items-start space-x-3 transition-all animate-in slide-in-from-bottom-5",
              t.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-950",
              t.type === "warning" && "bg-amber-50 border-amber-200 text-amber-950",
              t.type === "error" && "bg-red-50 border-red-200 text-red-950",
              t.type === "info" && "bg-blue-50 border-blue-200 text-blue-950"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {t.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {t.type === "error" && <AlertCircle className="w-4 h-4 text-gov-danger" />}
              {t.type === "info" && <Info className="w-4 h-4 text-gov-accent" />}
            </div>

            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold leading-tight">{t.title}</h4>
              {t.description && (
                <p className="text-xs opacity-90 mt-0.5 leading-normal">{t.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
