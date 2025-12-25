import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импортируем JSON файлы напрямую
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

i18n
  .use(LanguageDetector) // Авто-определение языка браузера + localStorage
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz }
    },
    fallbackLng: 'ru', // Если язык не найден, будет русский

    // Настройка детектора языка
    detection: {
      // Порядок поиска: localStorage → браузер → fallback
      order: ['localStorage', 'navigator'],
      // Ключ для localStorage
      lookupLocalStorage: 'filmzone_language',
      // Кэшировать выбранный язык
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false // React уже защищает от XSS
    },

    // Поддерживаемые языки
    supportedLngs: ['ru', 'en', 'uz'],

    // Не добавлять код страны, если его нет
    load: 'languageOnly',
  });

export default i18n;