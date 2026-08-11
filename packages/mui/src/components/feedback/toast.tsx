"use client";

import MuiAlert from "@mui/material/Alert";
import MuiSnackbar from "@mui/material/Snackbar";
import * as React from "react";

export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

interface ActiveToast extends ToastOptions {
  id: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ActiveToast[]>([]);

  const showToast = React.useCallback((options: ToastOptions) => {
    toastIdCounter += 1;
    const toast: ActiveToast = { id: toastIdCounter, tone: "info", duration: 4000, ...options };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = React.useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast, index) => (
        <MuiSnackbar
          key={toast.id}
          open
          autoHideDuration={toast.duration}
          onClose={() => dismiss(toast.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ bottom: `${16 + index * 60}px !important` }}
        >
          <MuiAlert severity={toast.tone} onClose={() => dismiss(toast.id)} variant="filled" sx={{ width: "100%" }}>
            {toast.message}
          </MuiAlert>
        </MuiSnackbar>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}
