import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/axios'; // Наш axios с токеном

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],

      // 1. ЗАГРУЗИТЬ СПИСОК (вызывать при входе)
      fetchWatchlist: async () => {
        const token = localStorage.getItem('token');
        if (!token) return; // Если гость - ничего не делаем (берем из localstorage)

        try {
          const response = await api.get('/watchlist');
          // Преобразуем данные с бэкенда в формат, понятный фронту (восстанавливаем id)
          const formatted = response.data.map(item => ({
            ...item,
            id: item.movieId, // Важно! Бэк хранит movieId, а фронт ждет id
          }));
          set({ watchlist: formatted });
        } catch (error) {
          console.error('Ошибка загрузки избранного:', error);
        }
      },

      // 2. ДОБАВИТЬ
      addToWatchlist: async (movie) => {
        const token = localStorage.getItem('token');
        const list = get().watchlist;
        
        // Оптимистичное обновление (сразу показываем на экране)
        if (!list.find((i) => i.id === movie.id)) {
           set({ watchlist: [movie, ...list] });
        }

        // Если залогинен - шлем на сервер
        if (token) {
           try {
             await api.post('/watchlist', movie);
           } catch (e) {
             console.error('Ошибка сохранения на сервере', e);
           }
        }
      },

      // 3. УДАЛИТЬ
      removeFromWatchlist: async (id) => {
        const token = localStorage.getItem('token');
        
        // Сразу удаляем визуально
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        }));

        // Если залогинен - удаляем на сервере
        if (token) {
           try {
             await api.delete(`/watchlist/${id}`);
           } catch (e) {
             console.error('Ошибка удаления на сервере', e);
           }
        }
      },

      // 4. ПРОВЕРКА
      isInWatchlist: (id) => !!get().watchlist.find((i) => i.id === id),
      
      // 5. ОЧИСТКА (при выходе)
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    {
      name: 'filmzone-watchlist', // Для гостей всё еще храним в LocalStorage
    }
  )
);