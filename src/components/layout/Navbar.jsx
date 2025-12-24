import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Bell, User, Menu, X, Globe ,Bookmark} from 'lucide-react';
import clsx from 'clsx'; // Помогает условно добавлять классы
import WatchlistPage from '../../pages/Watchlist';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Ссылки меню
    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.movies'), path: '/movies' },
        { name: t('nav.series'), path: '/series' },
    ];

    // Эффект скролла
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Переключение языка
    const toggleLanguage = () => {
        const langs = ['ru', 'en', 'uz'];
        const current = langs.indexOf(i18n.language);
        const next = langs[(current + 1) % langs.length];
        i18n.changeLanguage(next);
    };

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-10 py-4',
                scrolled
                    ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-white/5'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                {/* 1. Логотип */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-3xl font-bold tracking-tighter hover:scale-105 transition-transform">
                        <span className="text-white">Film</span>
                        <span className="text-primary">Zone</span>
                    </Link>

                    {/* Десктоп Меню */}
                    <ul className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={clsx(
                                        'text-sm font-medium transition-colors hover:text-primary relative group',
                                        location.pathname === link.path ? 'text-primary' : 'text-text-muted'
                                    )}
                                >
                                    {link.name}
                                    {/* Анимированная линия снизу */}
                                    <span className={clsx(
                                        "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                                        location.pathname === link.path ? "w-full" : ""
                                    )}></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 2. Правая часть (Иконки) */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Язык */}
                    <button onClick={toggleLanguage} className="flex items-center gap-1 text-text-muted hover:text-white transition uppercase text-xs font-bold">
                        <Globe size={16} />
                        {i18n.language}
                    </button>

                    {/* Поиск */}
                    <div className="relative group">
                        <Search className="text-text-muted hover:text-primary transition cursor-pointer" size={22} />
                    </div>

                    {/* Уведомления */}
                    <Bell className="text-text-muted hover:text-primary transition cursor-pointer" size={22} />
                    <Link to="/watchlist">
                        <div className="relative group">
                            <Bookmark className="..." />
                        </div>
                    </Link>
                    {/* Профиль (Аватар) */}
                    <div className="w-9 h-9 rounded-full bg-surface-hover border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary transition overflow-hidden">
                        <User size={18} className="text-text-muted" />
                        {/* <img src="..." /> если есть аватар */}
                    </div>
                </div>

                {/* 3. Мобильная кнопка */}
                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* 4. Мобильное меню (Выезжает) */}
            <div className={clsx(
                "md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden",
                mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                <ul className="flex flex-col p-6 gap-4">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className="block text-lg font-medium text-white hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <button onClick={toggleLanguage} className="text-white uppercase font-bold flex gap-2">
                            <Globe size={20} /> {i18n.language}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;