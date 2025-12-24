import axios from 'axios';
import i18n from '@/i18n/config'; // Мы создадим это в след. шаге

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор запроса (Middleware)
// Срабатывает ПЕРЕД каждым запросом
api.interceptors.request.use(async (config) => {
  // 1. Добавляем API Key
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_KEY,
    // 2. Автоматически подставляем язык (ru, en, uz)
    language: i18n.language || 'ru', 
  };
  return config;
});

export default api;