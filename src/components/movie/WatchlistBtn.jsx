import { useWatchlistStore } from '@/store/watchlistStore';
import { Plus, Check } from 'lucide-react';
import clsx from 'clsx';

const WatchlistBtn = ({ movie, className }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  
  const isAdded = isInWatchlist(movie.id);

  const toggle = (e) => {
    e.preventDefault(); // Чтобы не переходило по ссылке, если кнопка внутри Link
    e.stopPropagation();
    
    if (isAdded) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <button 
       onClick={toggle}
       className={clsx(
         "flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 font-bold",
         isAdded 
           ? "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500 hover:text-white" 
           : "bg-surface hover:bg-surface-hover border-white/10 text-white",
         className
       )}
    >
       {isAdded ? <Check size={20} /> : <Plus size={20} />}
       {isAdded ? "В списке" : "Буду смотреть"}
    </button>
  );
};

export default WatchlistBtn;