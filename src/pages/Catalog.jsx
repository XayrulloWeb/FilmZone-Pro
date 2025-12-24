import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { tmdbService } from '@/services/tmdb.service';
import { Search, Filter, ArrowDown } from 'lucide-react';

import MovieCard from '@/components/movie/MovieCard';
import PageHeader from '@/components/layout/PageHeader';
import MovieCardSkeleton from '@/components/skeletons/MovieCardSkeleton';

const Catalog = ({ type = 'movie' }) => {
  const { t, i18n } = useTranslation();

  // Состояние данных
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Фильтры
  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [sort, setSort] = useState('popularity.desc');

  // 1. Загружаем список жанров при старте
  useEffect(() => {
    const getGenres = async () => {
      try {
        const list = await tmdbService.getGenres(type);
        setGenres(list);
      } catch (e) {
        console.error("Error loading genres:", e);
      }
    };
    getGenres();

    // Сброс при смене типа (фильм -> сериал)
    setItems([]);
    setPage(1);
    setKeyword('');
    setSelectedGenre('');
    setSort('popularity.desc');
  }, [type, i18n.language]); // Обновляем жанры при смене языка

  // 2. Функция загрузки фильмов
  const loadData = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        query: keyword,
        with_genres: selectedGenre,
        sort_by: sort,
      };

      const response = await tmdbService.getMovies(type, params);

      if (pageNumber === 1) {
        setItems(response.results);
      } else {
        // Фильтруем дубликаты (чтобы не было ошибок ключей)
        setItems(prev => {
          const newItems = response.results.filter(
             newMovie => !prev.some(existing => existing.id === newMovie.id)
          );
          return [...prev, ...newItems];
        });
      }
      
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  }, [type, keyword, selectedGenre, sort, i18n.language]); // Добавили i18n.language

  // 3. Загружаем первую страницу при изменении фильтров или языка
  useEffect(() => {
    // Делаем дебаунс (задержку) для поиска, чтобы не спамить запросами
    const timer = setTimeout(() => {
        loadData(1);
        setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, selectedGenre, sort, type, loadData]);

  // 4. Загрузить еще
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* ШАПКА С ФИЛЬТРАМИ */}
      <PageHeader title={type === 'movie' ? t('nav.movies') : t('nav.series')}>
        
        {/* Панель управления */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mt-8 relative z-20">
          
          {/* Поиск */}
          <div className="relative flex-1 group">
             <input 
                type="text" 
                placeholder={t('nav.search') || "Найти..."}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-surface border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted"
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
          </div>

          <div className="flex gap-4">
            {/* Выбор жанра */}
            <div className="relative min-w-[140px] md:min-w-[180px]">
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full appearance-none bg-surface border border-white/10 text-white rounded-xl py-3 px-4 pr-10 focus:border-primary outline-none cursor-pointer"
              >
                <option value="">{t('catalog.filters.genres')}</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
            </div>

            {/* Сортировка (только если не поиск по слову) */}
            {!keyword && (
              <div className="relative min-w-[140px] md:min-w-[180px]">
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-surface border border-white/10 text-white rounded-xl py-3 px-4 pr-10 focus:border-primary outline-none cursor-pointer"
                >
                  <option value="popularity.desc">{t('catalog.filters.popular')}</option>
                  <option value="vote_average.desc">{t('catalog.filters.rating')}</option>
                  <option value="primary_release_date.desc">{t('catalog.filters.new')}</option>
                </select>
                <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
              </div>
            )}
          </div>

        </div>
      </PageHeader>

      {/* СЕТКА ФИЛЬМОВ */}
      <div className="container mx-auto px-4 md:px-10 mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          
          {items.map((item, i) => {
             // Явно указываем media_type, чтобы карточка знала, куда вести
             const itemWithType = { ...item, media_type: type };
             return <MovieCard key={`${item.id}-${i}`} movie={itemWithType} />;
          })}

          {/* Скелетоны при загрузке первой страницы */}
          {loading && page === 1 && Array(12).fill(0).map((_, i) => (
             <MovieCardSkeleton key={i} />
          ))}
        </div>

        {/* Пустое состояние */}
        {!loading && items.length === 0 && (
           <div className="text-center py-20">
             <h3 className="text-2xl text-white font-bold mb-2">{t('catalog.notFound')}</h3>
             <p className="text-text-muted">{t('catalog.notFoundDesc')}</p>
           </div>
        )}

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        {page < totalPages && items.length > 0 && (
          <div className="text-center mt-12">
             <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
             >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                   t('catalog.loadMore') || "Загрузить еще"
                )}
             </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Catalog;