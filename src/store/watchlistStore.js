import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Создаем хранилище с авто-сохранением в LocalStorage
export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [], // Список фильмов

      // Добавить фильм
      addToWatchlist: (movie) => set((state) => {
        // Проверка на дубликаты
        if (state.watchlist.find(i => i.id === movie.id)) return state;
        return { watchlist: [movie, ...state.watchlist] };
      }),

      // Удалить фильм
      removeFromWatchlist: (id) => set((state) => ({
        watchlist: state.watchlist.filter((m) => m.id !== id)
      })),

      // Проверка: есть ли фильм в списке?
      isInWatchlist: (id) => !!get().watchlist.find(i => i.id === id),
    }),
    {
      name: 'filmzone-watchlist', // Имя ключа в LocalStorage
    }
  )
);