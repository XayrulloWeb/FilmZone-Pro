import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatchlistStore } from '@/store/watchlistStore';
import { useHistoryStore } from '@/store/historyStore';
import { Bookmark, Clock, Trash2, User } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';
import PageHeader from '@/components/layout/PageHeader';
import clsx from 'clsx';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Profile = () => {
  const { t } = useTranslation();
  useDocumentTitle('Мой профиль');
  
  const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist' | 'history'

  const { watchlist, removeFromWatchlist } = useWatchlistStore();
  const { history, clearHistory } = useHistoryStore();

  const items = activeTab === 'watchlist' ? watchlist : history;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={t('nav.home') === 'Home' ? 'My Profile' : 'Мой профиль'}>
         {/* Аватарка и имя (Заглушка) */}
         <div className="flex flex-col items-center mt-6">
            <div className="w-24 h-24 rounded-full bg-surface border-2 border-primary p-1">
               <div className="w-full h-full rounded-full bg-surface-hover flex items-center justify-center overflow-hidden">
                  <User size={40} className="text-text-muted" />
               </div>
            </div>
            <h2 className="text-white text-xl font-bold mt-4">Гость</h2>
            <p className="text-text-muted text-sm">Любитель кино</p>
         </div>
      </PageHeader>

      <div className="container mx-auto px-4 md:px-10 -mt-8 relative z-20">
        
        {/* === ТАБЫ (ВКЛАДКИ) === */}
        <div className="flex justify-center mb-10">
           <div className="bg-surface border border-white/10 p-1 rounded-2xl flex relative">
              {/* Фон активной вкладки (анимация через layoutId была бы круче, но сделаем просто) */}
              
              <button
                onClick={() => setActiveTab('watchlist')}
                className={clsx(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300",
                  activeTab === 'watchlist' ? "bg-primary text-white shadow-lg" : "text-text-muted hover:text-white"
                )}
              >
                 <Bookmark size={18} />
                 <span>Буду смотреть</span>
                 <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full ml-1">{watchlist.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={clsx(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300",
                  activeTab === 'history' ? "bg-primary text-white shadow-lg" : "text-text-muted hover:text-white"
                )}
              >
                 <Clock size={18} />
                 <span>История</span>
                 <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full ml-1">{history.length}</span>
              </button>
           </div>
        </div>

        {/* === УПРАВЛЕНИЕ (Кнопка очистки) === */}
        {activeTab === 'history' && history.length > 0 && (
           <div className="flex justify-end mb-4">
              <button 
                onClick={clearHistory}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-2 transition-colors"
              >
                 <Trash2 size={16} /> Очистить историю
              </button>
           </div>
        )}

        {/* === СЕТКА ФИЛЬМОВ === */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            {activeTab === 'watchlist' ? (
               <>
                  <Bookmark size={48} className="mb-4 text-text-muted" />
                  <h3 className="text-xl font-bold text-white">Список пуст</h3>
                  <p className="text-text-muted">Добавляйте фильмы, чтобы не потерять</p>
               </>
            ) : (
               <>
                  <Clock size={48} className="mb-4 text-text-muted" />
                  <h3 className="text-xl font-bold text-white">История пуста</h3>
                  <p className="text-text-muted">Вы еще ничего не смотрели</p>
               </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;