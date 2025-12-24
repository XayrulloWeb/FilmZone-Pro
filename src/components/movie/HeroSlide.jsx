import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbService } from '@/services/tmdb.service';
import { getGenresList } from '@/utils/genres';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';

const HeroSlide = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await tmdbService.getTrending('movie', 'day');
        setMovies(data.results.slice(0, 5)); 
        setLoading(false);
      } catch (error) {
        console.error("Error loading hero movies:", error);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div className="h-screen w-full bg-background animate-pulse"></div>;
  if (!movies.length) return null;

  const movie = movies[activeIndex];
  const bgImage = import.meta.env.VITE_TMDB_IMG + '/original' + movie.backdrop_path;

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">
      
      {/* 1. ФОН (Картинка + Градиенты) */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Изображение */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          
          {/* Градиенты для читаемости текста */}
          {/* Снизу вверх (чтобы скрыть переход в контент) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          {/* Слева направо (для текста) */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          
          {/* Декоративное пятно (Glow Effect) */}
          <div className="absolute -left-[10%] -bottom-[10%] w-[60vw] h-[60vh] bg-primary/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* 2. КОНТЕНТ (Слева) */}
      <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20 max-w-[1800px] mx-auto pt-10 z-10">
        <div className="w-full md:w-[65%] lg:w-[55%] space-y-8">
          
          {/* Заголовок */}
          <motion.h1 
            key={movie.title}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-white drop-shadow-2xl tracking-tighter"
          >
            {movie.title}
          </motion.h1>

          {/* Мета-информация */}
          <motion.div 
             key={`meta-${movie.id}`}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap items-center gap-4 md:gap-6 text-base md:text-lg font-medium text-white/90"
          >
            {/* Рейтинг */}
            <span className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 backdrop-blur-sm">
              <Star size={18} fill="currentColor" /> 
              {movie.vote_average.toFixed(1)}
            </span>

            {/* Год */}
            <span className="flex items-center gap-2 text-white/80">
              <Calendar size={18} className="text-primary" /> 
              {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
            </span>

            {/* Точка разделитель */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />

            {/* Жанры */}
            <span className="text-white/60 text-sm md:text-base hidden md:block">
               {getGenresList(movie.genre_ids)}
            </span>
          </motion.div>

          {/* Описание */}
          <motion.p 
            key={movie.overview}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 line-clamp-3 md:text-xl max-w-2xl font-light leading-relaxed"
          >
            {movie.overview}
          </motion.p>

          {/* Кнопки */}
          <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="flex flex-wrap gap-4 pt-4"
          >
            {/* Кнопка Смотреть */}
            <button 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="group bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--primary),0.4)] active:scale-95"
            >
              <div className="bg-white text-primary rounded-full p-1 group-hover:rotate-12 transition-transform">
                <Play fill="currentColor" size={16} />
              </div>
        {t('hero.watch')}
            </button>
            
            {/* Кнопка Подробнее */}
            <button 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 hover:border-white/30"
            >
              <Info size={24} className="text-white/80" />
            {t('hero.more')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* 3. СПИСОК СПРАВА (Навигация по трендам) */}
      <div className="hidden xl:flex flex-col gap-5 absolute right-10 top-1/2 -translate-y-1/2 z-20 w-80 pl-10">
          <h3 className="text-white/40 font-bold mb-2 uppercase tracking-[0.2em] text-xs">{t('hero.trending')}</h3>
          
          {movies.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                "relative w-full aspect-[16/9] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 group",
                index === activeIndex 
                  ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] scale-105 z-10 opacity-100' 
                  : 'opacity-40 hover:opacity-100 hover:scale-105 grayscale hover:grayscale-0'
              )}
            >
               <img 
                 src={import.meta.env.VITE_TMDB_IMG + '/w500' + item.backdrop_path} 
                 className="w-full h-full object-cover" 
                 alt={item.title} 
               />
               
               {/* Название на карточке (только если не активна, чтобы не дублировать) */}
               {index !== activeIndex && (
                 <div className="absolute inset-0 bg-black/40 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white truncate w-full">{item.title}</span>
                 </div>
               )}
            </div>
          ))}
      </div>

      {/* Декоративная полоса снизу для плавного перехода в контент */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
};

export default HeroSlide;