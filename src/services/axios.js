import axios from 'axios';
import i18n from '@/i18n/config';

// Функция для получения языка
const getLanguageForTMDB = (lang) => {
  const languageMap = {
    'ru': 'ru-RU',
    'en': 'en-US',
    'uz': 'uz-UZ',
  };
  return languageMap[lang] || languageMap['ru'];
};

const api = axios.create({
  // БЫЛО: baseURL: import.meta.env.VITE_TMDB_URL, 
  // (который равен http://localhost:5000/api/tmdb)

  // СТАЛО: Убираем /tmdb из базового пути (если есть)
  baseURL: import.meta.env.VITE_TMDB_URL?.replace('/tmdb', '') || import.meta.env.VITE_TMDB_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});

// 1. ИНТЕРЦЕПТОР ЗАПРОСА
api.interceptors.request.use(async (config) => {
  // Получаем актуальный язык из i18n (он обновляется при смене)
  // Если i18n еще не инициализирован, берем из localStorage
  let currentLanguage = 'ru';
  try {
    // Пытаемся получить язык из i18n (он всегда актуален)
    currentLanguage = i18n.language || localStorage.getItem('filmzone_language') || 'ru';
    // Убираем регион, если есть (en-US -> en)
    if (currentLanguage.includes('-')) {
      currentLanguage = currentLanguage.split('-')[0];
    }
  } catch (e) {
    // Fallback на localStorage или 'ru'
    currentLanguage = localStorage.getItem('filmzone_language') || 'ru';
  }
  
  // 🔥 НОВОЕ: Добавляем токен, если он есть
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  config.params = {
    ...config.params,
    language: getLanguageForTMDB(currentLanguage),
  };
  return config;
});
// 2. ИНТЕРЦЕПТОР ОТВЕТА (Оставляем как было, retry логика полезна)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if ((!error.response || error.response.status >= 500) && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;
      const delay = 1000 * originalRequest._retryCount;
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;