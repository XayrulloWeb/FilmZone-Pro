import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { Check, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

// 1. Стор для управления уведомлениями
export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Автоудаление через 3 секунды
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// 2. Сам компонент уведомления
const ToastItem = ({ toast }) => {
  const { removeToast } = useToastStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 min-w-[300px]",
        toast.type === 'success' && "bg-green-500/10 text-green-500",
        toast.type === 'error' && "bg-red-500/10 text-red-500",
        toast.type === 'info' && "bg-blue-500/10 text-blue-500"
      )}
    >
      <div className={clsx("p-1 rounded-full", 
          toast.type === 'success' && "bg-green-500/20",
          toast.type === 'error' && "bg-red-500/20",
          toast.type === 'info' && "bg-blue-500/20"
      )}>
        {toast.type === 'success' && <Check size={16} />}
        {toast.type === 'error' && <X size={16} />}
        {toast.type === 'info' && <Info size={16} />}
      </div>
      
      <span className="text-white font-medium text-sm flex-1">{toast.message}</span>
      
      <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
        <X size={14} />
      </button>
    </motion.div>
  );
};

// 3. Контейнер (вставляется в App.jsx)
const ToastContainer = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
             <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;