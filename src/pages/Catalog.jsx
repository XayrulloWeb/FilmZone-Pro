import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { tmdbService } from '@/services/tmdb.service';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  ChevronDown,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import MovieCard from '@/components/movie/MovieCard';
import PageHeader from '@/components/layout/PageHeader';
import MovieCardSkeleton from '@/components/skeletons/MovieCardSkeleton';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Catalog = ({ type = 'movie' }) => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  useDocumentTitle(type === 'movie' ? t('nav.movies') : t('nav.series'));

  // ================= STATE =================
  const [items, setItems] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Инициализация фильтров из URL
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    with_genres: searchParams.get('genre') || '',
    company: searchParams.get('company') || '', // Студия (Marvel, Netflix...)
    sort_by: searchParams.get('sort') || 'popularity.desc',
    primary_release_year: searchParams.get('year') || '',
    'vote_average.gte': Number(searchParams.get('rating')) || 5,
  });

  // ================= 1. ЗАГРУЗКА ЖАНРОВ =================
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const apiGenres = await tmdbService.getGenres(type);

        // Добавляем наши кастомные жанры
        const customGenres = [
          { id: 'anime', name: '🇯🇵 Аниме' },
          { id: 'dorama', name: '🇰🇷 Дорамы' },
          { id: 'cartoon', name: '🇺🇸 Мультфильмы' },
          { id: 'indian', name: '🇮🇳 Индийское' },
        ];

        setGenresList([...customGenres, ...apiGenres]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchGenres();
  }, [type, i18n.language]);

  // ================= 2. СИНХРОНИЗАЦИЯ С URL =================
  useEffect(() => {
    const params = {};
    if (filters.query) params.q = filters.query;
    if (filters.with_genres) params.genre = filters.with_genres;
    if (filters.company) params.company = filters.company;
    if (filters.sort_by !== 'popularity.desc') params.sort = filters.sort_by;
    if (filters.primary_release_year) params.year = filters.primary_release_year;
    if (filters['vote_average.gte'] !== 5) params.rating = filters['vote_average.gte'];

    setSearchParams(params, { replace: true });
  }, [filters]);

  // Следим за изменениями URL извне (например, клик "Назад" в браузере)
  useEffect(() => {
     const genreParam = searchParams.get('genre');
     const companyParam = searchParams.get('company');
     
     // Если пришли с главной по ссылке - открываем фильтры или просто обновляем стейт
     if (genreParam && genreParam !== filters.with_genres) {
         setFilters(prev => ({ ...prev, with_genres: genreParam }));
     }
     if (companyParam && companyParam !== filters.company) {
         setFilters(prev => ({ ...prev, company: companyParam }));
     }
  }, [searchParams]);


  // ================= 3. ПОИСК (DEBOUNCE) =================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.query) {
         setFilters(prev => ({ ...prev, query: searchInput }));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ================= 4. ЗАГРУЗКА ФИЛЬМОВ =================
  const fetchMovies = useCallback(
    async (loadMore = false) => {
      setLoading(true);

      try {
        const params = {
          page: loadMore ? page + 1 : 1,
          query: filters.query,
          with_genres: filters.with_genres,
          company: filters.company, // Передаем студию
          sort_by: filters.sort_by,
          primary_release_year: filters.primary_release_year,
          'vote_average.gte': filters.query ? null : filters['vote_average.gte'],
        };

        const data = await tmdbService.getMovies(type, params);

        if (!data || !data.results) {
          console.error('Invalid data received from API');
          return;
        }

        if (loadMore) {
            // Фильтруем дубликаты при подгрузке
            setItems(prev => {
                const newItems = data.results.filter(n => !prev.some(p => p.id === n.id));
                return [...prev, ...newItems];
            });
            setPage(prev => prev + 1);
        } else {
            setItems(data.results || []);
            setPage(1);
        }
        
        setTotalPages(data.total_pages || 1);
      } catch (e) {
        console.error('Catalog error:', e);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, type]
  );

  // Триггер загрузки при смене фильтров
  useEffect(() => {
    fetchMovies(false);
  }, [fetchMovies]);

  // ================= 5. INFINITE SCROLL =================
  const observerRef = useRef();
  const lastElementRef = useCallback(
    node => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && page < totalPages) {
          fetchMovies(true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, page, totalPages, fetchMovies]
  );

  // ================= ХЕЛПЕРЫ =================
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setSearchInput('');
    setFilters({
      query: '',
      with_genres: '',
      company: '',
      sort_by: 'popularity.desc',
      primary_release_year: '',
      'vote_average.gte': 5,
    });
  };

  const years = Array.from({ length: 65 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={type === 'movie' ? t('nav.movies') : t('nav.series')}>
        
        {/* === ВЕРХНЯЯ ПАНЕЛЬ === */}
        <div className="max-w-[1400px] mx-auto mt-8 flex flex-col md:flex-row gap-4 relative z-20">
          
          {/* Поиск */}
          <div className="relative flex-1 group">
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={t('nav.search')}
              className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                 <X size={18} />
              </button>
            )}
          </div>

          {/* Кнопка фильтров */}
          <button
            onClick={() => setIsFilterOpen(v => !v)}
            className={clsx(
              'px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all',
              isFilterOpen
                ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]'
                : 'bg-surface border-white/10 text-text-muted hover:text-white hover:bg-surface-hover'
            )}
          >
            <SlidersHorizontal size={18} />
            <span className="hidden md:inline">{t('catalog.filtersBtn')}</span>
          </button>
        </div>

        {/* === ВЫПАДАЮЩАЯ ПАНЕЛЬ ФИЛЬТРОВ === */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="max-w-[1400px] mx-auto mt-4 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shadow-2xl">
                
                {/* Сортировка */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-muted uppercase">{t('catalog.sort')}</label>
                   <div className="relative">
                      <select
                        value={filters.sort_by}
                        onChange={e => updateFilter('sort_by', e.target.value)}
                        className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg py-3 px-4 pr-10 text-white focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="popularity.desc">🔥 {t('catalog.popular')}</option>
                        <option value="vote_average.desc">⭐ {t('catalog.topRated')}</option>
                        <option value="primary_release_date.desc">📅 {t('catalog.newReleases')}</option>
                        <option value="primary_release_date.asc">📅 {t('catalog.classics')}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                   </div>
                </div>

                {/* Жанр */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-muted uppercase">{t('catalog.genre')}</label>
                   <div className="relative">
                      <select
                        value={filters.with_genres}
                        onChange={e => updateFilter('with_genres', e.target.value)}
                        className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg py-3 px-4 pr-10 text-white focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="">{t('catalog.allGenres')}</option>
                        {genresList.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                      <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                   </div>
                </div>

                {/* Год */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-muted uppercase">{t('catalog.year')}</label>
                   <div className="relative">
                      <select
                        value={filters.primary_release_year}
                        onChange={e => updateFilter('primary_release_year', e.target.value)}
                        className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg py-3 px-4 pr-10 text-white focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="">{t('catalog.anyYear')}</option>
                        {years.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                   </div>
                </div>

                {/* Рейтинг */}
                <div className="space-y-3">
                   <div className="flex justify-between">
                      <label className="text-xs font-bold text-text-muted uppercase">{t('catalog.rating')}</label>
                      <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 rounded">
                          &gt; {filters['vote_average.gte']}
                      </span>
                   </div>
                   <input
                    type="range"
                    min="0"
                    max="9"
                    step="1"
                    value={filters['vote_average.gte']}
                    onChange={e => updateFilter('vote_average.gte', e.target.value)}
                    className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-primary"
                   />
                   <div className="flex justify-between text-[10px] text-text-muted px-1">
                      <span>0</span>
                      <span>5</span>
                      <span>9</span>
                   </div>
                </div>

                {/* Кнопка сброса */}
                <div className="md:col-span-2 lg:col-span-4 border-t border-white/5 pt-4 flex justify-end">
                  <button
                    onClick={resetAll}
                    className="text-sm text-text-muted hover:text-white transition-colors underline decoration-dotted"
                  >
                    {t('catalog.resetFilters')}
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageHeader>

      {/* === СЕТКА ФИЛЬМОВ === */}
      <div className="container mx-auto px-4 md:px-10 mt-8">
        
        {/* АКТИВНЫЕ ФИЛЬТРЫ (Бейджи) */}
        {(filters.query || filters.with_genres || filters.company || filters.primary_release_year) && (
            <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-top-2">
                {filters.query && (
                    <div className="badge bg-primary/20 text-primary border border-primary/50 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                        {t('catalog.searchLabel')} {filters.query}
                        <X size={14} className="cursor-pointer hover:scale-125 transition-transform" onClick={() => setSearchInput('')} />
                    </div>
                )}
                {filters.company && (
                    <div className="badge bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                        {t('catalog.studioLabel')} {filters.company}
                        <X size={14} className="cursor-pointer hover:scale-125 transition-transform" onClick={() => updateFilter('company', '')} />
                    </div>
                )}
                {filters.with_genres && (
                    <div className="badge bg-surface text-text-muted border border-white/10 px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                        {t('catalog.genreLabel')} {genresList.find(g => String(g.id) === String(filters.with_genres))?.name || filters.with_genres}
                        <X size={14} className="cursor-pointer hover:text-white" onClick={() => updateFilter('with_genres', '')} />
                    </div>
                )}
                {filters.primary_release_year && (
                    <div className="badge bg-surface text-text-muted border border-white/10 px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                        {t('catalog.yearLabel')} {filters.primary_release_year}
                        <X size={14} className="cursor-pointer hover:text-white" onClick={() => updateFilter('primary_release_year', '')} />
                    </div>
                )}
            </div>
        )}

        {/* ITEMS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <div ref={isLast ? lastElementRef : null} key={`${item.id}-${i}`}>
                <MovieCard movie={{ ...item, media_type: type }} />
              </div>
            );
          })}

          {/* SKELETONS */}
          {loading && Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
          ))}
        </div>
        
        {/* EMPTY STATE */}
        {!loading && items.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
              <Search size={48} className="mb-4 text-text-muted" />
              <h3 className="text-xl font-bold text-white">{t('catalog.emptyState')}</h3>
              <p className="text-text-muted">{t('catalog.emptyStateDesc')}</p>
              <button onClick={resetAll} className="mt-4 text-primary font-bold hover:underline">{t('catalog.clearAll')}</button>
           </div>
        )}

      </div>
    </div>
  );
};

export default Catalog;