import axios from 'axios';
import i18n from '@/i18n/config';

// 1. ОПРЕДЕЛЕНИЕ URL
// Мы берем URL из .env.
// Если его там нет (например, забыл создать файл), 
// то только тогда используем localhost как запасной вариант.
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 Environment:', import.meta.env.MODE);
console.log('🔗 Connecting to Backend:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});

// ... (Дальше твои интерцепторы без изменений) ...
// Интерцептор запроса
api.interceptors.request.use(async (config) => {
  let currentLanguage = 'ru';
  try {
    currentLanguage = i18n.language || localStorage.getItem('filmzone_language') || 'ru';
    if (currentLanguage.includes('-')) currentLanguage = currentLanguage.split('-')[0];
  } catch (e) { currentLanguage = 'ru'; }
  
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Маппинг языков
  const langMap = { 'ru': 'ru-RU', 'en': 'en-US', 'uz': 'uz-UZ' };
  config.params = {
    ...config.params,
    language: langMap[currentLanguage] || 'ru-RU',
  };
  return config;
});

// Интерцептор ответа
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    // Логика retry
    const originalRequest = error.config;
    originalRequest._retryCount = originalRequest._retryCount || 0;
    if ((!error.response || error.response.status >= 500) && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;
      await new Promise(r => setTimeout(r, 1000 * originalRequest._retryCount));
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;