"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "info" | "error";
interface ToastItem { id: number; message: string; type: ToastType; }

const ToastContext = React.createContext<{ show: (msg: string, type?: ToastType) => void } | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons = { success: Check, info: Info, error: X };
const colors = { success: "text-green", info: "text-accent", error: "text-red" };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const show = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[500] flex flex-col items-end gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex max-w-[300px] items-center gap-2.5 rounded-md border border-b2 bg-s2 px-4 py-2.5 text-sm shadow-xl"
              >
                <Icon size={15} className={cn("flex-shrink-0", colors[t.type])} />
                <span className="flex-1">{t.message}</span>
                <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="text-t3">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
