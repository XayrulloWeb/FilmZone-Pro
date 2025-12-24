import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
  // 🔥 ЛОГИКА ОПРЕДЕЛЕНИЯ: Фильм или Сериал?
  // 1. Если явно указан media_type (приходит из поиска/трендов) - верим ему.
  // 2. Если есть title - это фильм. Если name - это сериал.
  const isTv = movie.media_type === 'tv' || (!movie.title && movie.name);
  const link = isTv ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  
  // Название (у фильмов title, у сериалов name)
  const title = movie.title || movie.name;
  
  // Дата (у фильмов release_date, у сериалов first_air_date)
  const date = movie.release_date || movie.first_air_date;

  const posterUrl = movie.poster_path 
    ? import.meta.env.VITE_TMDB_IMG + '/w500' + movie.poster_path 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={link}>
      <motion.div 
        whileHover={{ scale: 1.05, y: -5 }} 
        className="relative rounded-xl overflow-hidden cursor-pointer group bg-surface shadow-lg border border-white/5"
      >
        <div className="aspect-[2/3] w-full relative overflow-hidden">
          <img 
            src={posterUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy" 
          />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-primary rounded-full p-3 shadow-[0_0_20px_rgba(var(--primary),0.6)] transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
              <Play fill="white" className="text-white ml-1" size={24} />
            </div>
          </div>

          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-yellow-400">
            <Star size={12} fill="currentColor" />
            {movie.vote_average?.toFixed(1)}
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-white font-semibold truncate text-sm md:text-base group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-text-muted text-xs mt-1 flex justify-between">
            <span>{date ? date.split('-')[0] : 'N/A'}</span>
            <span className="uppercase border border-white/10 px-1 rounded text-[10px]">
                {isTv ? 'TV' : 'Movie'}
            </span>
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;