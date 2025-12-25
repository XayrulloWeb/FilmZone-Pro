import { useWatchlistStore } from '@/store/watchlistStore';
import MovieCard from '@/components/movie/MovieCard';
import PageHeader from '@/components/layout/PageHeader';
import { useTranslation } from 'react-i18next';

const WatchlistPage = () => {
  const { t } = useTranslation();
  const { watchlist } = useWatchlistStore();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={`${t('watchlist.title')} (${watchlist.length})`} />

      <div className="container mx-auto px-4 md:px-10 mt-10">
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <h3 className="text-2xl font-bold mb-2">{t('watchlist.empty')}</h3>
            <p>{t('watchlist.emptyDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;