import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { tmdbService } from '@/services/tmdb.service';
import { useHistoryStore } from '@/store/historyStore'; // Импорт истории
import { Play, TrendingUp, Flame, Ticket, Clapperboard, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import HeroSlide from '@/components/movie/HeroSlide';
import MovieSlider from '@/components/movie/MovieSlider';
import MovieCard from '@/components/movie/MovieCard';
import Img from '@/components/common/Img';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { history } = useHistoryStore(); // Берем историю

  // Данные
  const [data, setData] = useState({
    trending: [],
    topRated: [],
    tvPopular: [],
    upcoming: [],
    top10: [] // Для топа с цифрами
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trend, top, tv, up] = await Promise.all([
           tmdbService.getTrending('movie', 'day'),
           tmdbService.getList('movie', 'top_rated'),
           tmdbService.getList('tv', 'popular'),
           tmdbService.getList('movie', 'upcoming'),
        ]);

        setData({
           trending: trend?.results || [],
           top10: (trend?.results || []).slice(0, 10), // Берем первые 10 трендов для топа
           topRated: top?.results || [],
           tvPopular: tv?.results || [],
           upcoming: up?.results || [],
        });
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
    };
    fetchAll();
  }, [i18n.language]);

  // Жанры для быстрой навигации
 const categories = [
    { 
      id: 28, 
      name: t('home.categories.action'), 
      icon: Flame, 
      // Цвет иконки и свечения при наведении
      style: 'text-red-500 group-hover:text-red-400', 
      border: 'group-hover:border-red-500/50',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    },
    { 
      id: 35, 
      name: t('home.categories.comedy'), 
      icon: Ticket, 
      style: 'text-yellow-400 group-hover:text-yellow-300', 
      border: 'group-hover:border-yellow-400/50',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]'
    },
    { 
      id: 27, 
      name: t('home.categories.horror'), 
      icon: Clapperboard, 
      style: 'text-cyan-400 group-hover:text-cyan-300', // Поменял на Cyan, чтобы было стильней на черном
      border: 'group-hover:border-cyan-400/50',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
    },
    { 
      id: 16, 
      name: t('home.categories.anime'), 
      icon: Play, 
      style: 'text-purple-500 group-hover:text-purple-400', 
      border: 'group-hover:border-purple-500/50',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      
      {/* 1. HERO BANNER */}
      <HeroSlide />

      <div className="-mt-10 md:-mt-24 relative z-20 space-y-12 md:space-y-16">
        
        {/* 2. БЫСТРЫЕ КАТЕГОРИИ (Pills) */}
        <div className="container mx-auto px-4 md:px-10">
           <Swiper
             slidesPerView="auto"
             spaceBetween={12}
             className="!overflow-visible py-4" // Добавил py-4, чтобы тени не обрезались
           >
              {categories.map((cat) => (
                 <SwiperSlide key={cat.id} className="!w-auto">
                    <Link 
                       to={`/movies?genre=${cat.id}`}
                       className={`
                         group relative flex items-center gap-3 px-6 py-3.5 rounded-full 
                         bg-white/5 backdrop-blur-md border border-white/10 
                         transition-all duration-300 ease-out
                         hover:bg-white/10 hover:scale-105 hover:-translate-y-1
                         ${cat.border} ${cat.shadow}
                       `}
                    >
                       {/* Иконка */}
                       <div className={`transition-colors duration-300 ${cat.style}`}>
                          <cat.icon size={18} />
                       </div>
                       
                       {/* Текст */}
                       <span className="font-medium text-white/90 group-hover:text-white transition-colors text-sm md:text-base whitespace-nowrap">
                          {cat.name}
                       </span>
                    </Link>
                 </SwiperSlide>
              ))}
              
              {/* Кнопка "Все жанры" */}
              <SwiperSlide className="!w-auto">
                 <Link to="/movies" className="group flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all">
                    <span className="text-white/70 group-hover:text-white font-medium text-sm">{t('home.allGenres')}</span>
                    <ChevronRight size={16} className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                 </Link>
              </SwiperSlide>
           </Swiper>
        </div>
        {/* 3. ПРОДОЛЖИТЬ ПРОСМОТР (Если есть история) */}
        {history.length > 0 && (
           <MovieSlider 
              title={t('home.continueWatching')} 
              movies={history} 
              loading={false}
              link="/profile" 
           />
        )}
         <div className="container mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {[
             { id: 'netflix', name: 'Netflix', color: 'from-black to-red-900', border: 'hover:border-red-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
             { id: 'marvel', name: 'Marvel', color: 'from-red-900 to-red-600', border: 'hover:border-red-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg' },
             { id: 'disney', name: 'Disney', color: 'from-blue-900 to-blue-600', border: 'hover:border-blue-400', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
             { id: 'pixar', name: 'Pixar', color: 'from-gray-800 to-gray-600', border: 'hover:border-gray-400', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Pixar_logo.svg' },
             { id: 'dc', name: 'DC', color: 'from-blue-950 to-blue-800', border: 'hover:border-blue-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/DC_Comics_2016.svg' },
             { id: 'hbo', name: 'HBO', color: 'from-black to-white/20', border: 'hover:border-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg' },
           ].map((studio) => (
              <Link 
                 key={studio.id}
                 to={`/movies?company=${studio.id}`}
                 className={`
                    relative h-24 md:h-32 rounded-xl overflow-hidden border border-white/10 shadow-lg 
                    transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] 
                    flex items-center justify-center group bg-gradient-to-br ${studio.color} ${studio.border}
                 `}
              >
                 {/* Градиентный шум/текстура (опционально) */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                 
                 {/* Логотип */}
                 <img 
                    src={studio.logo} 
                    alt={studio.name} 
                    className="h-8 md:h-12 w-auto object-contain relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-300 brightness-0 invert" // invert делает лого белым
                 />
                 
                 {/* Блик при наведении */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
           ))}
        </div>

        {/* 4. ТОП-10 С ЦИФРАМИ (Netflix Style) */}
        <div className="px-4 md:px-10 max-w-[1800px] mx-auto">
           <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
             <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
             {t('home.top10')}
           </h2>
           
           <Swiper
             slidesPerView={1.2}
             spaceBetween={20}
             breakpoints={{
                480: { slidesPerView: 2.2 },
                768: { slidesPerView: 2.5 }, // На планшете меньше, чтобы влезли цифры
                1024: { slidesPerView: 3.2 },
                1280: { slidesPerView: 4.2 },
             }}
             className="!pb-10 !px-2"
           >
              {data.top10.map((movie, index) => (
                 <SwiperSlide key={movie.id} className="group cursor-pointer">
                    <Link to={`/movie/${movie.id}`} className="flex items-end relative pl-6 md:pl-12">
                       {/* ОГРОМНАЯ ЦИФРА */}
                       <span 
                          className="absolute -left-2 bottom-0 text-[100px] md:text-[140px] font-black leading-[0.7] text-black stroke-text z-10 transition-transform group-hover:scale-110 group-hover:text-surface"
                          style={{ WebkitTextStroke: '2px #555', fontFamily: 'Impact, sans-serif' }}
                       >
                          {index + 1}
                       </span>
                       
                       {/* ПОСТЕР */}
                       <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 transform transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2 z-20 bg-surface">
                          <Img src={movie.poster_path} className="w-full h-full object-cover" />
                       </div>
                    </Link>
                 </SwiperSlide>
              ))}
           </Swiper>
        </div>

        {/* 5. ОБЫЧНЫЕ СЛАЙДЕРЫ */}
        <MovieSlider 
           title={t('pages.popular.title')} 
           movies={data.trending} 
           loading={loading} 
        />

        {/* 6. ПРОМО-БАННЕР (Реклама каталога) */}
        <div className="container mx-auto px-4 md:px-10">
           <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              {/* Фон (берем первый фильм из топа) */}
              <div className="absolute inset-0">
                 <Img 
                    src={data.topRated[0]?.backdrop_path} 
                    size="original"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                 />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
              
              {/* Контент */}
              <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-bold w-fit mb-4 border border-primary/20">
                    <TrendingUp size={16} /> {t('home.bestOfAllTime')}
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                    {t('home.bestOfAllTimeDesc')}
                 </h2>
                 <p className="text-text-muted text-lg mb-8 max-w-md">
                    {t('home.bestOfAllTimeSub')}
                 </p>
                 <Link 
                    to="/movies?sort=vote_average.desc"
                    className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all w-fit shadow-xl"
                 >
                    {t('home.goToCatalog')}
                 </Link>
              </div>
           </div>
        </div>

        <MovieSlider 
           title={t('nav.series')} 
           movies={data.tvPopular} 
           loading={loading}
           link="/series" 
        />

        <MovieSlider 
           title={t('pages.popular.upcoming')} 
           movies={data.upcoming} 
           loading={loading} 
        />
        
      </div>
    </div>
  );
};

export default Home;