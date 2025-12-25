import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useDocumentTitle = (title) => {
  const { t } = useTranslation();

  useEffect(() => {
    const prevTitle = document.title;
    
    if (title) {
      document.title = `${title} | FilmZone Pro`;
    } else {
      document.title = 'FilmZone Pro - Смотри лучшее';
    }

    // Возвращаем старый заголовок при уходе со страницы (cleanup)
    return () => {
      document.title = 'FilmZone Pro';
    };
  }, [title, t]);
};

export default useDocumentTitle;