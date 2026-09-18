"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 10000;

const TYPE_TITLES: Record<ToastType, string> = {
  success: "Succes",
  error: "Echec",
};

const TYPE_CARD_CLASSES: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
};

const TYPE_TITLE_CLASSES: Record<ToastType, string> = {
  success: "text-emerald-700",
  error: "text-red-700",
};

const TYPE_ICON_CLASSES: Record<ToastType, string> = {
  success: "text-emerald-600",
  error: "text-red-600",
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12.5 2.5 2.5L16 9" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

let nextToastId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextToastId++;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg ${TYPE_CARD_CLASSES[toast.type]}`}
          >
            <span className={`mt-0.5 shrink-0 ${TYPE_ICON_CLASSES[toast.type]}`}>
              <ToastIcon type={toast.type} />
            </span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${TYPE_TITLE_CLASSES[toast.type]}`}>{TYPE_TITLES[toast.type]}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Fermer"
                  className={`shrink-0 opacity-60 transition hover:opacity-100 ${TYPE_ICON_CLASSES[toast.type]}`}
                >
                  ×
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit etre utilise a l'interieur d'un ToastProvider");
  return ctx;
}
