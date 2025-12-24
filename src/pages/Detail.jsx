import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbService } from '@/services/tmdb.service';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import SeasonList from '@/components/movie/SeasonList'; 
import VideoModal from '@/components/common/VideoModal';
import MovieSlider from '@/components/movie/MovieSlider';
import CastList from '@/components/movie/CastList';
import WatchlistBtn from '@/components/movie/WatchlistBtn';
import { useTranslation } from 'react-i18next';

const Detail = ({ category = 'movie' }) => { // Дефолтное значение для страховки
  const { id } = useParams();
  const { t } = useTranslation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const getDetail = async () => {
      setLoading(true);
      setItem(null); // Сброс
      window.scrollTo(0, 0); 
      try {
        // 🔥 ВАЖНО: Используем category из пропсов
        const response = await tmdbService.getDetails(category, id);
        setItem(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, [category, id]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!item) return <div className="text-center pt-40 text-white">Ничего не найдено</div>;

  // 🔥 Универсальные поля
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  // Длительность: у фильма runtime, у сериала episode_run_time (массив)
  const runtime = item.runtime || (item.episode_run_time?.length > 0 ? item.episode_run_time[0] : null);

  // Трейлер
  const trailer = item.videos?.results?.find(vid => vid.name.includes('Trailer') || vid.name.includes('Official')) || item.videos?.results?.[0];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* 1. HERO BANNER */}
      <div 
        className="relative w-full h-[60vh] md:h-[80vh] bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${import.meta.env.VITE_TMDB_IMG}/original${item.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* 2. КОНТЕНТ */}
      <div className="container mx-auto px-4 md:px-10 relative -mt-60 md:-mt-80 z-10">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* ЛЕВО: Постер */}
          <div className="shrink-0 w-full max-w-[350px] mx-auto md:mx-0">
             <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 group relative">
                <img 
                   src={`${import.meta.env.VITE_TMDB_IMG}/w500${item.poster_path}`} 
                   alt={title}
                   className="w-full h-auto object-cover" 
                />
             </div>
             
             <button 
                onClick={() => setTrailerOpen(true)}
                className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg shadow-primary/20"
             >
                <Play fill="currentColor" size={20} /> {t('detail.trailer')}
             </button>
          </div>

          {/* ПРАВО: Инфо */}
          <div className="flex-1 text-white pt-4 md:pt-10">
             <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg">
                {title}
             </h1>
             
             <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base font-medium text-text-muted">
                <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                   <Star size={16} fill="currentColor" /> {item.vote_average?.toFixed(1)}
                </span>
                {runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> {runtime} мин
                  </span>
                )}
                <span className="flex items-center gap-1">
                   <Calendar size={16} /> {date?.split('-')[0]}
                </span>
                <span className="px-2 py-1 border border-white/20 rounded text-xs uppercase">
                   {category === 'tv' ? 'TV Show' : 'Movie'}
                </span>
             </div>

             <div className="flex flex-wrap gap-2 mb-8">
                {item.genres?.map(g => (
                   <span key={g.id} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition cursor-default text-sm">
                      {g.name}
                   </span>
                ))}
             </div>

             <h3 className="text-lg font-bold mb-2 text-white">{t('detail.overview')}</h3>
             <p className="text-text-muted leading-relaxed text-lg mb-8 max-w-3xl">
                {item.overview}
             </p>

             <div className="flex gap-4 mb-10">
                <WatchlistBtn movie={item} />
             </div>

             <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <div className="w-1 h-6 bg-primary rounded-full"></div> 
                   {t('detail.cast')}
                </h3>
                <CastList cast={item.credits?.cast} />
             </div>

          </div>
        </div>

        {/* 3. СЕЗОНЫ (Только для сериалов) */}
        {category === 'tv' && item.seasons && (
           <SeasonList seasons={item.seasons} />
        )}

        {/* 4. ПОХОЖИЕ */}
        <div className="mt-16">
           <MovieSlider title={t('detail.similar')} movies={item.similar?.results} />
        </div>
      </div>

      {/* 5. МОДАЛКА */}
      {trailer && (
         <VideoModal 
            active={trailerOpen} 
            onClose={() => setTrailerOpen(false)} 
            videoKey={trailer.key} 
         />
      )}

    </div>
  );
};

export default Detail;