import { create } from 'zustand';
import api from '@/services/axios';
import { useWatchlistStore } from './watchlistStore'; // Стор Избранного
import { useHistoryStore } from './historyStore';     // Стор Истории

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // РЕГИСТРАЦИЯ
  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: access_token, isAuthenticated: true, isLoading: false });

      // 🔥 Загружаем данные с сервера
      useWatchlistStore.getState().fetchWatchlist();
      useHistoryStore.getState().fetchHistory();
      
      return true;
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Ошибка регистрации' 
      });
      return false;
    }
  },

  // ВХОД
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: access_token, isAuthenticated: true, isLoading: false });

      // 🔥 Загружаем данные с сервера
      useWatchlistStore.getState().fetchWatchlist();
      useHistoryStore.getState().fetchHistory();

      return true;
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Ошибка входа' 
      });
      return false;
    }
  },

  // ВЫХОД
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    set({ user: null, token: null, isAuthenticated: false });

    // 🔥 Очищаем локальные данные, чтобы не показывать чужое
    useWatchlistStore.getState().clearWatchlist();
    useHistoryStore.getState().clearHistory();
  },

  // Очистка ошибок
  clearError: () => set({ error: null }),
}));