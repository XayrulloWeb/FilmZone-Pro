import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/axios';

export const useHistoryStore = create(
  persist(
    (set) => ({
      history: [],

      // 1. ЗАГРУЗИТЬ
      fetchHistory: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await api.get('/history');
          const formatted = response.data.map(item => ({
            ...item,
            id: item.movieId,
          }));
          set({ history: formatted });
        } catch (error) {
          console.error('Ошибка загрузки истории:', error);
        }
      },

      // 2. ДОБАВИТЬ В ИСТОРИЮ
      addToHistory: async (item) => {
        const token = localStorage.getItem('token');
        
        // Оптимистичное обновление (для UI)
        set((state) => {
          const filtered = state.history.filter((m) => m.id !== item.id);
          return { history: [item, ...filtered].slice(0, 20) };
        });

        // Если залогинен - шлем на сервер
        if (token) {
           try {
             await api.post('/history', item);
           } catch (e) {
             console.error('Ошибка сохранения истории', e);
           }
        }
      },

      // 3. ОЧИСТИТЬ
      clearHistory: async () => {
        set({ history: [] });
        
        const token = localStorage.getItem('token');
        if (token) {
           try {
             await api.delete('/history');
           } catch (e) {
             console.error('Ошибка очистки истории', e);
           }
        }
      },
    }),
    {
      name: 'filmzone-history',
    }
  )
);