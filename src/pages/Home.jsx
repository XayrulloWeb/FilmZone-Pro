import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tmdbService } from '@/services/tmdb.service';
import HeroSlide from '@/components/movie/HeroSlide';
import MovieSlider from '@/components/movie/MovieSlider';

const Home = () => {
  const { t, i18n } = useTranslation();

  // Состояния для каждого списка
  const [sections, setSections] = useState({
    trending: { data: [], loading: true },
    topRated: { data: [], loading: true },
    upcoming: { data: [], loading: true },
    action: { data: [], loading: true }, // Добавим жанр для примера
  });

  useEffect(() => {
    const fetchAll = async () => {
      // Функция-помощник для обновления состояния
      const updateSection = (key, data) => {
        setSections(prev => ({ ...prev, [key]: { data, loading: false } }));
      };

      // 1. Тренды
      tmdbService.getTrending('movie', 'week')
        .then(res => updateSection('trending', res.results));

      // 2. Топ рейтинг
      tmdbService.getList('movie', 'top_rated')
        .then(res => updateSection('topRated', res.results));

      // 3. Скоро
      tmdbService.getList('movie', 'upcoming')
        .then(res => updateSection('upcoming', res.results));

      // 4. Экшн фильмы (ID жанра = 28)
      tmdbService.discoverByGenre(28)
        .then(res => updateSection('action', res.results));
    };

    fetchAll();
  }, [i18n.language]); // Обновляем при смене языка

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      <HeroSlide />

      {/* Контейнер списков (поднимаем вверх на баннер) */}
      <div className="-mt-32 md:-mt-48 relative z-20 space-y-4 md:space-y-8">

        <MovieSlider
          title={t('pages.popular.title') || "В тренде"}
          movies={sections.trending.data}
          loading={sections.trending.loading}
        />

        <MovieSlider
          title={t('pages.popular.topRated')}
          movies={sections.topRated.data}
          loading={sections.topRated.loading}
          link="/movies?sort=top_rated"
        />

        <MovieSlider
          title={t('pages.popular.upcoming')}
          movies={sections.upcoming.data}
          loading={sections.upcoming.loading}
        />

        <MovieSlider
          title={t('pages.popular.action')}
          movies={sections.action.data}
          loading={sections.action.loading}
          link="/movies?genre=28"
        />

      </div>
    </div>
  );
};

export default Home;