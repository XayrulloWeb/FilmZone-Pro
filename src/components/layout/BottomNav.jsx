import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, User, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import SearchModal from '@/components/search/SearchModal'; // Импорт поиска

const BottomNav = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: Compass, label: 'Каталог', path: '/movies' },
    { icon: Search, label: 'Поиск', action: () => setIsSearchOpen(true) }, // Особая кнопка
    { icon: Bookmark, label: 'Моё', path: '/profile' },
  ];

  return (
    <>
      {/* Сама панель */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-white/10 z-40 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            // Если это кнопка поиска (не ссылка)
            if (item.action) {
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="flex flex-col items-center gap-1 w-full text-text-muted hover:text-white transition-colors"
                >
                   <Icon size={24} />
                   <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            // Обычная ссылка
            return (
              <Link
                key={index}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center gap-1 w-full transition-colors",
                  isActive ? "text-primary" : "text-text-muted hover:text-white"
                )}
              >
                <Icon size={24} fill={isActive ? "currentColor" : "none"} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Отступ, чтобы контент не перекрывался менюшкой */}
      <div className="md:hidden h-16" />

      {/* Модалка поиска */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default BottomNav;