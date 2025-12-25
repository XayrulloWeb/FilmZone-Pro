import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tmdbService } from '@/services/tmdb.service';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { MapPin, Calendar, Star, User } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';
import Img from '@/components/common/Img'; // 🔥 Твой новый про-компонент

const Person = () => {
  const { id } = useParams();
  const { t } = useTranslation();
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
        console.error("Error loading person:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useDocumentTitle(person ? person.name : 'Персона');


  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-primary animate-pulse">
            Wait
          </div>
        </div>
      </div>
    );
  }

  if (!person) return null;

  // Логика сортировки: Сначала самые популярные проекты
  const allCredits = [
    ...(person.movie_credits?.cast || []).map(c => ({ ...c, media_type: 'movie' })),
    ...(person.tv_credits?.cast || []).map(c => ({ ...c, media_type: 'tv' }))
  ]
  .filter(c => c.poster_path)
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 24); // Показываем топ-24

  return (
    <div className="min-h-screen bg-background pb-20 pt-32 relative overflow-hidden">
      
      {/* 1. ФОНОВЫЕ ЭФФЕКТЫ (Ambient Light) */}
      <div className="fixed top-20 left-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
          
          {/* ================= ЛЕВАЯ КОЛОНКА (STICKY) ================= */}
          <div className="lg:w-[320px] shrink-0">
            <div className="sticky top-28 space-y-8">
              
              {/* Фото с эффектом глубины */}
              <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-surface aspect-[2/3] border border-white/10">
                 <Img 
                    src={person.profile_path} 
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 {/* Блик */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Блок информации */}
              <div className="bg-surface/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <User className="text-primary" size={20} />
                   {t('person.about') || "Информация"}
                </h3>

                <div className="space-y-5">
                   {/* День рождения */}
                   <div className="group">
                      <span className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1 block group-hover:text-primary transition-colors">
                        {t('person.birthday')}
                      </span>
                      <div className="text-white text-lg font-medium leading-none">
                         {person.birthday ? (
                            <span className="flex items-center gap-2">
                               {person.birthday} 
                               <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                 {new Date().getFullYear() - new Date(person.birthday).getFullYear()} лет
                               </span>
                            </span>
                         ) : '-'}
                      </div>
                   </div>

                   {/* Место рождения */}
                   <div className="group">
                      <span className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1 block group-hover:text-primary transition-colors">
                        {t('person.place')}
                      </span>
                      <div className="text-white font-medium leading-tight">
                         {person.place_of_birth || '-'}
                      </div>
                   </div>

                   {/* Департамент */}
                   <div className="group">
                      <span className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1 block group-hover:text-primary transition-colors">
                        {t('person.known')}
                      </span>
                      <div className="text-white font-medium">
                         {person.known_for_department}
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>

          {/* ================= ПРАВАЯ КОЛОНКА (SCROLLABLE) ================= */}
          <div className="flex-1 min-w-0"> {/* min-w-0 нужен для grid внутри flex */}
            
            {/* Заголовок */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              {person.name}
            </h1>

            {/* Биография */}
            {person.biography && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                   {t('person.biography')}
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-muted text-lg leading-relaxed whitespace-pre-line font-light">
                    {person.biography}
                  </p>
                </div>
              </div>
            )}

            {/* Сетка фильмов */}
            <div>
              <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                    {t('person.credits') || "Известные работы"}
                    <span className="text-text-muted text-lg font-normal ml-2 opacity-60">
                       ({allCredits.length})
                    </span>
                 </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                {allCredits.map((item) => (
                  <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
                ))}
              </div>
              
              {/* Если нет работ */}
              {allCredits.length === 0 && (
                 <div className="py-20 text-center text-text-muted bg-surface/30 rounded-2xl border border-white/5">
                    Нет информации о фильмах
                 </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Person;