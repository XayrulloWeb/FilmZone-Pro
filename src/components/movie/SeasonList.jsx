import { useState } from 'react';
import { ChevronDown, Calendar, Star, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { tmdbService } from '@/services/tmdb.service';
import { useParams } from 'react-router-dom'; // Нам нужен ID сериала из URL
import Img from '@/components/common/Img';
import clsx from 'clsx';

const SeasonList = ({ seasons }) => {
  const { t } = useTranslation();
  const { id: tvId } = useParams(); // Берем ID сериала из URL
  
  // Фильтруем "Сезон 0" (спецвыпуски), обычно они не нужны
  const validSeasons = seasons?.filter(s => s.season_number > 0) || [];

  const [activeSeason, setActiveSeason] = useState(null);
  const [episodesData, setEpisodesData] = useState({}); // Кеш: { 1: [episodes...], 2: [...] }
  const [loading, setLoading] = useState(false);

  const toggleSeason = async (seasonNumber) => {
    // Если кликнули на уже открытый - закрываем
    if (activeSeason === seasonNumber) {
      setActiveSeason(null);
      return;
    }

    setActiveSeason(seasonNumber);

    // Если данных нет в кеше - грузим
    if (!episodesData[seasonNumber]) {
      setLoading(true);
      try {
        const data = await tmdbService.getSeason(tvId, seasonNumber);
        setEpisodesData(prev => ({ ...prev, [seasonNumber]: data.episodes }));
      } catch (error) {
        console.error("Failed to load episodes", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!validSeasons.length) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
         <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
         {t('seasons.title')}
         <span className="text-text-muted text-lg font-normal opacity-60">({validSeasons.length})</span>
      </h3>

      <div className="flex flex-col gap-4">
        {validSeasons.map((season) => {
           const isOpen = activeSeason === season.season_number;
           const episodes = episodesData[season.season_number] || [];

           return (
            <div 
              key={season.id} 
              className={clsx(
                "bg-surface border rounded-2xl overflow-hidden transition-all duration-300",
                isOpen ? "border-primary/30 shadow-[0_0_20px_rgba(0,0,0,0.3)]" : "border-white/5 hover:border-white/20"
              )}
            >
              {/* === ЗАГОЛОВОК СЕЗОНА (Кнопка) === */}
              <button 
                 onClick={() => toggleSeason(season.season_number)}
                 className="w-full flex items-center gap-4 p-4 md:p-5 text-left outline-none"
              >
                 {/* Постер сезона (маленький) */}
                 <div className="w-12 h-16 md:w-16 md:h-24 shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <Img 
                      src={season.poster_path} 
                      alt={season.name}
                      className="w-full h-full"
                    />
                 </div>

                 {/* Инфо */}
                 <div className="flex-1">
                    <h4 className={clsx("text-lg md:text-xl font-bold transition-colors", isOpen ? "text-primary" : "text-white")}>
                      {season.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                       <span className="flex items-center gap-1">
                          <Play size={14} /> {season.episode_count} {t('seasons.episodes')}
                       </span>
                       {season.air_date && (
                         <span className="flex items-center gap-1">
                            <Calendar size={14} /> {season.air_date.split('-')[0]}
                         </span>
                       )}
                    </div>
                 </div>

                 {/* Стрелка */}
                 <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-primary text-white rotate-180" : "bg-white/5 text-text-muted rotate-0"
                 )}>
                    <ChevronDown size={20} />
                 </div>
              </button>

              {/* === СПИСОК ЭПИЗОДОВ === */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6 pt-0 space-y-4 border-t border-white/5 mt-2">
                       
                       {/* Лоадер */}
                       {loading && episodes.length === 0 && (
                          <div className="py-10 flex justify-center">
                             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                       )}

                       {/* Список серий */}
                       {!loading && episodes.map((ep) => (
                          <div 
                            key={ep.id} 
                            className="group flex flex-col md:flex-row gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
                          >
                             {/* Превью серии */}
                             <div className="w-full md:w-64 aspect-video shrink-0 rounded-lg overflow-hidden relative border border-white/5 bg-black/40">
                                <Img 
                                  src={ep.still_path} 
                                  alt={ep.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-white">
                                   {t('seasons.ep')} {ep.episode_number}
                                </div>
                             </div>

                             {/* Инфо серии */}
                             <div className="flex-1 py-1">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                   <h5 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                      {ep.name}
                                   </h5>
                                   {ep.vote_average > 0 && (
                                     <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded shrink-0">
                                        <Star size={12} fill="currentColor" /> {ep.vote_average.toFixed(1)}
                                     </span>
                                   )}
                                </div>
                                
                                <p className="text-text-muted text-sm line-clamp-2 md:line-clamp-3 mb-2 font-light">
                                   {ep.overview || ""}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-text-muted/60">
                                   <span className="flex items-center gap-1">
                                      <Calendar size={12} /> {ep.air_date || t('movieCard.tba')}
                                   </span>
                                   <span>{ep.runtime ? `${ep.runtime} ${t('seasons.minutes')}` : ''}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default SeasonList;  