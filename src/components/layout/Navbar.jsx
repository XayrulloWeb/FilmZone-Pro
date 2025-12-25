import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Bell, User, Menu, X, Globe, Bookmark } from "lucide-react";
import clsx from "clsx";
import SearchModal from "../search/SearchModal";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.movies"), path: "/movies" },
    { name: t("nav.series"), path: "/series" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full z-50 px-4 md:px-10 py-4 transition-all duration-300",
        scrolled
          ? "bg-gradient-to-b from-background/90 to-background/60 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Логотип */}
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className={clsx(
              "text-3xl font-bold tracking-tighter hover:scale-105 transition-transform",
              scrolled && "scale-90"
            )}
          >
            <span className="text-white">Film</span>
            <span className="text-primary">Zone</span>
          </Link>

          {/* Десктоп меню */}
          <ul className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={clsx(
                    "text-sm font-medium relative group transition-all duration-300",
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-text-muted hover:text-white"
                  )}
                >
                  {link.name}
                  <span
                    className={clsx(
                      "absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full",
                      location.pathname === link.path ? "w-full" : ""
                    )}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Иконки */}
        <div className="hidden md:flex items-center gap-6">
          {/* Язык */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-text-muted hover:text-white transition uppercase text-sm font-bold px-3 py-2 rounded-lg hover:bg-white/5">
              <Globe size={18} />
              <span>{i18n.language}</span>
            </button>

            <div className="absolute right-0 top-full mt-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[140px] overflow-hidden">
              {["ru", "en", "uz"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={clsx(
                    "w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3",
                    i18n.language === lang
                      ? "bg-primary/10 text-primary"
                      : "text-white hover:bg-white/5"
                  )}
                >
                  <span className="text-xl">
                    {lang === "ru" ? "🇷🇺" : lang === "en" ? "🇬🇧" : "🇺🇿"}
                  </span>
                  <span>{t(`language.${lang}`)}</span>
                  {i18n.language === lang && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Поиск */}
          <Search
            onClick={() => setSearchOpen(true)}
            className="text-text-muted hover:text-primary transition-transform hover:-translate-y-1 cursor-pointer"
            size={22}
          />

          {/* Уведомления */}
          <Bell
            className="text-text-muted hover:text-primary transition-transform hover:-translate-y-1 cursor-pointer"
            size={22}
          />

          {/* Watchlist */}
          <Link to="/watchlist">
            <Bookmark
              className="text-text-muted hover:text-primary transition-transform hover:-translate-y-1 cursor-pointer"
              size={22}
            />
          </Link>

          {/* Профиль */}
          <Link to="/profile">
            <div className="w-9 h-9 rounded-full bg-surface-hover border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary transition overflow-hidden">
              <User size={18} className="text-text-muted" />
            </div>
          </Link>
        </div>

        {/* Мобильная кнопка */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Мобильное меню */}
      <div
        className={clsx(
          "md:hidden absolute top-full left-0 w-full bg-black/60 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ease-in-out overflow-hidden transform",
          mobileMenuOpen
            ? "translate-y-0 opacity-100 max-h-[600px]"
            : "-translate-y-full opacity-0 max-h-0"
        )}
      >
        <ul className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="block text-lg font-medium text-white hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="pt-4 border-t border-white/10">
            <div className="text-text-muted text-xs uppercase font-bold mb-3 flex items-center gap-2">
              <Globe size={16} /> {t(`language.${i18n.language}`)}
            </div>
            <div className="flex flex-col gap-2">
              {["ru", "en", "uz"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    i18n.changeLanguage(lang);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3",
                    i18n.language === lang
                      ? "bg-primary text-white"
                      : "bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  <span className="text-xl">
                    {lang === "ru" ? "🇷🇺" : lang === "en" ? "🇬🇧" : "🇺🇿"}
                  </span>
                  <span>{t(`language.${lang}`)}</span>
                  {i18n.language === lang && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          </li>
        </ul>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
