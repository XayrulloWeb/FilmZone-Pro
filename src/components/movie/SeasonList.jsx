import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SeasonList = ({ seasons }) => {
  // Фильтруем "Сезон 0" (спецвыпуски), если они не нужны, или оставляем
  const validSeasons = seasons.filter(s => s.season_number > 0);
  
  // Состояние: какой сезон раскрыт? (по умолчанию никакой)
  const [openSeasonId, setOpenSeasonId] = useState(null);

  const toggleSeason = (id) => {
    setOpenSeasonId(openSeasonId === id ? null : id);
  };

  if (!validSeasons.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
         <div className="w-1.5 h-8 bg-primary rounded-full"></div>
         Сезоны ({validSeasons.length})
      </h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        {validSeasons.map((season) => (
          <div key={season.id} className="bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            
            {/* Заголовок сезона (кликабельный) */}
            <div 
               onClick={() => toggleSeason(season.id)}
               className="flex gap-4 p-4 cursor-pointer items-center"
            >
               {/* Постер сезона */}
               <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-black/50">
                  {season.poster_path ? (
                    <img 
                      src={`${import.meta.env.VITE_TMDB_IMG}/w200${season.poster_path}`} 
                      alt={season.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Img</div>
                  )}
               </div>

               {/* Инфо */}
               <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{season.name}</h4>
                  <p className="text-sm text-text-muted mt-1">
                     {season.episode_count} Эпизодов • {season.air_date?.split('-')[0] || 'TBA'}
                  </p>
                  {season.overview && (
                     <p className="text-xs text-text-muted/60 mt-2 line-clamp-1">{season.overview}</p>
                  )}
               </div>

               {/* Стрелочка */}
               <ChevronDown 
                  className={`text-text-muted transition-transform duration-300 ${openSeasonId === season.id ? 'rotate-180' : ''}`} 
               />
            </div>

            {/* ТУТ БУДЕТ СПИСОК ЭПИЗОДОВ (Пока просто заглушка, так как API эпизодов требует отдельного запроса) */}
            <AnimatePresence>
              {openSeasonId === season.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/20"
                >
                  <div className="p-4 text-sm text-center text-text-muted">
                     Чтобы увидеть список эпизодов, нужно делать отдельный запрос к API для каждого сезона. 
                     <br/>
                     (Функционал в разработке 🛠)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonList;