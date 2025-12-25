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
  baseURL: import.meta.env.VITE_TMDB_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Если сервер молчит 10 секунд - отмена
});

// 1. ИНТЕРЦЕПТОР ЗАПРОСА (Добавляем ключ и язык)
api.interceptors.request.use(async (config) => {
  const currentLanguage = i18n.language || 'ru';
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_KEY,
    language: getLanguageForTMDB(currentLanguage),
  };
  return config;
});

// 2. ИНТЕРЦЕПТОР ОТВЕТА (Логика повтора / Retry)
api.interceptors.response.use(
  (response) => response, // Если всё ок, просто возвращаем данные
  async (error) => {
    const originalRequest = error.config;

    // Проверяем, сколько раз мы уже пытались (если нет счетчика, ставим 0)
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Если ошибка сети или 5xx (ошибка сервера) И мы пробовали меньше 3 раз
    if ((!error.response || error.response.status >= 500) && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;
      
      console.warn(`Attempt ${originalRequest._retryCount} retrying request to ${originalRequest.url}...`);

      // Ждем перед повтором (экспоненциальная задержка: 1сек, 2сек, 4сек)
      const delay = 1000 * originalRequest._retryCount;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Повторяем запрос
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;