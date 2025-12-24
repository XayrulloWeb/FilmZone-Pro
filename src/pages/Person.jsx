import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbService } from '@/services/tmdb.service';
import { MapPin, Calendar, Star } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';

const Person = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const data = await tmdbService.getPerson(id);
        setPerson(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!person) return null;

  // Объединяем фильмы и сериалы, сортируем по популярности
  const allCredits = [
    ...(person.movie_credits?.cast || []).map(c => ({ ...c, media_type: 'movie' })),
    ...(person.tv_credits?.cast || []).map(c => ({ ...c, media_type: 'tv' }))
  ]
  .filter(c => c.poster_path) // Убираем без постеров
  .sort((a, b) => b.popularity - a.popularity) // Самые популярные сверху
  .slice(0, 20); // Берем топ-20

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <div className="container mx-auto px-4 md:px-10">
        
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* ЛЕВАЯ КОЛОНКА (Фото и Инфо) */}
          <div className="shrink-0 w-full md:w-[300px]">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-6 relative group">
              <img 
                src={person.profile_path ? `${import.meta.env.VITE_TMDB_IMG}/w500${person.profile_path}` : 'https://via.placeholder.com/300x450'} 
                alt={person.name}
                className="w-full h-auto object-cover"
              />
               {/* Эффект свечения при наведении */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
            </div>

            {/* Персональные данные */}
            <div className="space-y-4 text-white">
              <h3 className="text-xl font-bold border-l-4 border-primary pl-3">О персоне</h3>
              
              <div>
                <span className="text-text-muted text-sm block">Дата рождения</span>
                <div className="flex items-center gap-2 font-medium">
                   <Calendar size={16} className="text-primary" />
                   {person.birthday || '-'}
                </div>
              </div>

              <div>
                <span className="text-text-muted text-sm block">Место рождения</span>
                <div className="flex items-center gap-2 font-medium">
                   <MapPin size={16} className="text-primary" />
                   {person.place_of_birth || '-'}
                </div>
              </div>

              <div>
                <span className="text-text-muted text-sm block">Известность за</span>
                <div className="flex items-center gap-2 font-medium">
                   <Star size={16} className="text-primary" />
                   {person.known_for_department}
                </div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Контент) */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
              {person.name}
            </h1>

            {/* Биография */}
            {person.biography && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-3">Биография</h3>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">
                  {person.biography}
                </p>
              </div>
            )}

            {/* Фильмография (Сетка) */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <div className="w-1.5 h-8 bg-primary rounded-full" />
                 Известен по работам
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {allCredits.map((item) => (
                  <MovieCard key={item.id + item.media_type} movie={item} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Person;