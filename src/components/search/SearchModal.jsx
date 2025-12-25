import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, Film, Tv, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbService } from '@/services/tmdb.service';

const SearchModal = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, movie, tv
    const inputRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Search with debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const response = await tmdbService.search('multi', {
                    query,
                    language: i18n.language,
                });

                // Filter by active tab
                let filtered = response.results || [];
                if (activeTab !== 'all') {
                    filtered = filtered.filter(item => item.media_type === activeTab);
                }

                setResults(filtered.slice(0, 8)); // Limit to 8 results
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, activeTab, i18n.language]);

    // Handle click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Navigate to item
    const handleItemClick = (item) => {
        const type = item.media_type === 'tv' ? 'tv' : 'movie';
        navigate(`/${type}/${item.id}`);
        onClose();
    };

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-start justify-center pt-20 px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-3xl bg-surface/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Header */}
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                            <Search className="text-primary" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('nav.search') || 'Search movies, TV shows...'}
                                className="flex-1 bg-transparent text-white text-xl outline-none placeholder:text-text-muted"
                            />
                            {loading && <Loader2 className="text-primary animate-spin" size={20} />}
                            <button
                                onClick={onClose}
                                className="text-text-muted hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 px-6 py-3 border-b border-white/10 bg-background/50">
                            {[
                                { id: 'all', label: t('catalog.all') || 'All', icon: TrendingUp },
                                { id: 'movie', label: t('nav.movies') || 'Movies', icon: Film },
                                { id: 'tv', label: t('nav.series') || 'TV Shows', icon: Tv },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'text-text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Results */}
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="p-3">
                                    {results.map((item) => {
                                        const title = item.title || item.name;
                                        const year = (item.release_date || item.first_air_date)?.split('-')[0];
                                        const posterUrl = item.poster_path
                                            ? `${import.meta.env.VITE_TMDB_IMG}/w200${item.poster_path}`
                                            : null;

                                        return (
                                            <motion.div
                                                key={`${item.id}-${item.media_type}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                onClick={() => handleItemClick(item)}
                                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition group"
                                            >
                                                {posterUrl ? (
                                                    <img
                                                        src={posterUrl}
                                                        alt={title}
                                                        className="w-14 h-20 rounded-lg object-cover border border-white/10 group-hover:border-primary/50 transition"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-20 rounded-lg bg-surface-hover border border-white/10 flex items-center justify-center">
                                                        {item.media_type === 'tv' ? <Tv size={20} className="text-text-muted" /> : <Film size={20} className="text-text-muted" />}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold truncate group-hover:text-primary transition">
                                                        {title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-text-muted text-sm">{year || t('movieCard.na')}</span>
                                                        <span className="text-text-muted">•</span>
                                                        <span className="text-xs uppercase text-text-muted border border-white/10 px-2 py-0.5 rounded">
                                                            {item.media_type === 'tv' ? t('movieCard.tvShow') : t('movieCard.movieFull')}
                                                        </span>
                                                        {item.vote_average > 0 && (
                                                            <>
                                                                <span className="text-text-muted">•</span>
                                                                <span className="text-yellow-400 text-sm">★ {item.vote_average.toFixed(1)}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : query.trim() && !loading ? (
                                <div className="text-center py-20 px-4">
                                    <Search className="mx-auto text-text-muted mb-4" size={48} />
                                    <h3 className="text-white text-lg font-semibold mb-2">{t('catalog.notFound')}</h3>
                                    <p className="text-text-muted">{t('catalog.notFoundDesc')}</p>
                                </div>
                            ) : !query.trim() ? (
                                <div className="text-center py-20 px-4">
                                    <TrendingUp className="mx-auto text-primary mb-4" size={48} />
                                    <h3 className="text-white text-lg font-semibold mb-2">{t('search.startSearching')}</h3>
                                    <p className="text-text-muted">{t('search.typeToSearch')}</p>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
