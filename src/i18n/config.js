import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импортируем JSON файлы напрямую (для старта так проще)
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

i18n
  .use(LanguageDetector) // Авто-определение языка браузера
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz }
    },
    fallbackLng: 'ru', // Если язык не найден, будет русский
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;