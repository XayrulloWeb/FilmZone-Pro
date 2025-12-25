import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (item) => set((state) => {
        // Удаляем дубликат, если такой фильм уже был в истории (чтобы поднять его наверх)
        const filtered = state.history.filter((m) => m.id !== item.id);
        // Добавляем в начало, храним максимум 20 последних
        return { history: [item, ...filtered].slice(0, 20) };
      }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'filmzone-history',
    }
  )
);