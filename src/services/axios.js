import axios from 'axios';
import i18n from '@/i18n/config';

// Маппинг языковых кодов для TMDB API
// TMDB требует полные коды локалей (ru-RU, en-US и т.д.)
const getLanguageForTMDB = (lang) => {
  const languageMap = {
    'ru': 'ru-RU',
    'en': 'en-US',
    'uz': 'uz-UZ', // Узбекский
  };
  return languageMap[lang] || languageMap['ru'];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор запроса (Middleware)
// Срабатывает ПЕРЕД каждым запросом
api.interceptors.request.use(async (config) => {
  // 1. Получаем текущий язык из i18n
  const currentLanguage = i18n.language || 'ru';

  // 2. Добавляем API Key и язык
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_KEY,
    // Преобразуем язык в формат TMDB (ru → ru-RU)
    language: getLanguageForTMDB(currentLanguage),
  };

  return config;
});

export default api;