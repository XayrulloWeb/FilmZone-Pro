import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import MovieCardSkeleton from '@/components/skeletons/MovieCardSkeleton';

import 'swiper/css';
import 'swiper/css/navigation';

const MovieSlider = ({ title, movies, loading, link }) => {
  return (
    <div className="mb-12 px-4 md:px-12 max-w-[1800px] mx-auto">
      {/* Заголовок с кнопкой "Смотреть всё" */}
      <div className="flex items-center justify-between mb-6 group">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full" /> {/* Полоска слева */}
          {title}
        </h2>
        
        {link && (
          <Link 
            to={link} 
            className="flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-primary transition-colors group-hover:translate-x-1 duration-300"
          >
            Все <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={'auto'}
        navigation
        className="!pb-10 !px-1 movie-swiper"
        breakpoints={{
          320: { slidesPerView: 2.2, spaceBetween: 12 }, // На мобилке видно кусочек следующего
          640: { slidesPerView: 3.2, spaceBetween: 16 },
          768: { slidesPerView: 4.2, spaceBetween: 20 },
          1024: { slidesPerView: 5.2, spaceBetween: 24 },
          1400: { slidesPerView: 6.2, spaceBetween: 24 },
        }}
      >
        {/* Если загрузка - показываем 10 скелетонов */}
        {loading 
          ? Array(10).fill(0).map((_, i) => (
              <SwiperSlide key={i} className="!w-[140px] md:!w-[180px] lg:!w-[220px]">
                <MovieCardSkeleton />
              </SwiperSlide>
            ))
          : movies.map((movie) => (
              <SwiperSlide key={movie.id} className="!w-[140px] md:!w-[180px] lg:!w-[220px]">
                <MovieCard movie={movie} />
              </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  );
};

export default MovieSlider;