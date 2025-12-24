import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom'; // <--- Импорт Link
import 'swiper/css';

const CastList = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="cast-slider">
      <Swiper
        grabCursor={true}
        spaceBetween={15}
        slidesPerView={'auto'}
      >
        {cast.slice(0, 15).map((item, i) => (
          <SwiperSlide key={i} className="!w-[100px] md:!w-[120px]">
            {/* Оборачиваем в Link */}
            <Link to={`/person/${item.id}`} className="block group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all mb-3 shadow-lg">
                  <img 
                    src={item.profile_path ? `${import.meta.env.VITE_TMDB_IMG}/w200${item.profile_path}` : 'https://via.placeholder.com/200x200?text=No+Img'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-sm font-semibold text-white leading-tight group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-text-muted mt-1 truncate w-full">
                  {item.character}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CastList;