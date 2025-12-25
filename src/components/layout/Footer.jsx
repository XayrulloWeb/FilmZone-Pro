import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-surface/50 border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Декоративное пятно */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">

          {/* Лого и инфо */}
          <div className="max-w-xs">
            <Link to="/" className="text-3xl font-bold tracking-tighter mb-4 block">
              <span className="text-white">Film</span>
              <span className="text-primary">Zone</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Ссылки (Колонки) */}
          <div className="flex gap-12 md:gap-24">
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.nav')}</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link to="/" className="hover:text-primary transition">{t('nav.home')}</Link></li>
                <li><Link to="/movies" className="hover:text-primary transition">{t('nav.movies')}</Link></li>
                <li><Link to="/series" className="hover:text-primary transition">{t('nav.series')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.help')}</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link to="/about" className="hover:text-primary transition">{t('footer.about')}</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition">{t('footer.contact')}</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Соцсети */}
          <div>
            <h4 className="text-white font-bold mb-4">{t('footer.social')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface hover:bg-primary text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface hover:bg-primary text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface hover:bg-primary text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="https://github.com/xayrullo/filmzone" target="_blank" className="w-10 h-10 rounded-full bg-surface hover:bg-primary text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Github size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Копирайт */}
        <div className="border-t border-white/5 pt-8 text-center text-xs text-text-muted">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;