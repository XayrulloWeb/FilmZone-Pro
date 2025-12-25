import { Link } from 'react-router-dom';
import { Star, PlayCircle, Calendar, Tv } from 'lucide-react';
import Img from '@/components/common/Img';
import clsx from 'clsx';

const MovieCard = ({ movie }) => {
  const isTv = movie.media_type === 'tv' || (!movie.title && movie.name);
  const link = isTv ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date ? date.split('-')[0] : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <Link to={link} className="block h-full">
      <div className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface border border-white/5 transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:border-primary/50 hover:-translate-y-2">
        
        {/* 1. ПОСТЕР (ZOOM эффект) */}
        <div className="absolute inset-0 w-full h-full">
           <Img 
             src={movie.poster_path} 
             alt={title}
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
           />
        </div>

        {/* 2. ГРАДИЕНТ (Для читаемости текста) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* 3. БЕЙДЖИ (Рейтинг и Тип) - Сверху */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end opacity-100 group-hover:opacity-0 transition-opacity duration-300">
           {rating && (
             <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-white/10">
                <Star size={10} fill="currentColor" /> {rating}
             </div>
           )}
           {isTv && (
             <div className="bg-primary/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                TV
             </div>
           )}
        </div>

        {/* 4. КНОПКА PLAY (По центру при наведении) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 scale-50 group-hover:scale-100">
           <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.6)] backdrop-blur-sm">
              <PlayCircle size={32} fill="currentColor" className="text-white" />
           </div>
        </div>

        {/* 5. ИНФОРМАЦИЯ (Снизу) */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
           
           {/* Мета-инфо (появляется при ховере) */}
           <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 transform translate-y-2 group-hover:translate-y-0">
              <span>{year}</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span>{isTv ? 'Сериал' : 'Фильм'}</span>
              {rating && (
                <>
                   <span className="w-1 h-1 rounded-full bg-white/50" />
                   <span className="text-yellow-400 flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {rating}
                   </span>
                </>
              )}
           </div>

           {/* Заголовок */}
           <h3 className={clsx(
              "text-white font-bold leading-tight transition-all duration-300 line-clamp-2",
              "group-hover:text-white group-hover:line-clamp-3" // При наведении показываем больше текста
           )}>
              {title}
           </h3>
           
           {/* Жанры (опционально, если хочешь) */}
           {/* <p className="text-[10px] text-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">Action, Drama</p> */}
        </div>

      </div>
    </Link>
  );
};

export default MovieCard;