import { useState, useEffect } from 'react';
import { X, Server, RotateCcw, MonitorPlay, Film, Tv, AlertTriangle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

// === СПИСОК СЕРВЕРОВ (БАЛАНСЕРОВ) ===
const SERVERS = [
  { 
    id: 'vidsrc',
    name: 'VidSrc', 
    desc: 'Работает везде (ENG/RU)',
    type: 'stable',
    // Самый надежный для localhost. Меню озвучки: Внутри плеера (настройки)
    getUrl: (id, type) => `https://vidsrc.xyz/embed/${type}/${id}` 
  },
  { 
    id: 'kodik',
    name: 'Kodik', 
    desc: 'ТОП-1: Озвучка + 4K',
    type: 'pro',
    // Лучший в СНГ. Меню озвучки: Выпадающий список внутри плеера.
    // ТРЕБУЕТ ОДОБРЕННЫЙ ДОМЕН!
    getUrl: (id, type) => {
        const kodikType = type === 'tv' ? 'serial' : 'film';
        return `//kodik.cc/find-player?tmdbID=${id}&types=${kodikType}&prioritize_translation_type=voice`;
    }
  },
  { 
    id: 'videocdn',
    name: 'VideoCDN', 
    desc: 'Много озвучек (RU)',
    type: 'pro',
    // Тоже требует домен. Отличная альтернатива Кодику.
    getUrl: (id, type) => `https://videocdn.tv/embed/movie?tmdb_id=${id}` 
  },
  {
    id: 'super',
    name: 'SuperEmbed',
    desc: 'Резерв (Multi)',
    type: 'backup',
    getUrl: (id, type) => `https://multiembed.mov/?video_id=${id}&tmdb=1`
  }
];

const PlayerModal = ({ active, onClose, tmdbId, title, type = 'movie' }) => {
  const [currentServer, setCurrentServer] = useState(0); 
  const [iframeKey, setIframeKey] = useState(0); // Ключ для жесткой перезагрузки iframe
  const [isLoading, setIsLoading] = useState(true);

  // Сброс состояния при открытии
  useEffect(() => {
    if (active) {
      setIframeKey(0);
      setIsLoading(true);
      // Если мы на localhost, лучше начинать с VidSrc (индекс 0), чтобы не пугать ошибками
      // Если сайт на продакшене - можно ставить Kodik (индекс 1)
      setCurrentServer(0); 
    }
  }, [active]);

  // Функция перезагрузки
  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  if (!active) return null;

  const server = SERVERS[currentServer];
  const src = server.getUrl(tmdbId, type);
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const showWarning = isLocalhost && (server.id === 'kodik' || server.id === 'videocdn');

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 md:p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[1400px] flex flex-col gap-4 h-full md:h-auto justify-center"
        onClick={e => e.stopPropagation()}
      >
        
        {/* === ПАНЕЛЬ УПРАВЛЕНИЯ (GLASSMORPHISM) === */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl relative z-20">
           
           {/* Инфо о фильме */}
           <div className="flex items-center gap-4 min-w-0 pr-10 md:pr-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                 {type === 'movie' ? <Film size={24} /> : <Tv size={24} />}
              </div>
              <div className="min-w-0">
                 <h2 className="text-white font-bold text-lg md:text-xl truncate leading-tight tracking-tight">
                    {title || "Смотреть онлайн"}
                 </h2>
                 <div className="flex items-center gap-3 text-xs font-medium mt-1">
                    <span className="text-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                        {server.name}
                    </span>
                    {server.type === 'pro' && (
                        <span className="flex items-center gap-1 text-green-400">
                            <ShieldCheck size={12} /> Pro Сервер
                        </span>
                    )}
                 </div>
              </div>
           </div>

           {/* Селектор серверов */}
           <div className="flex bg-black/40 p-1.5 rounded-xl overflow-x-auto no-scrollbar max-w-full w-full md:w-auto border border-white/5">
              {SERVERS.map((srv, idx) => (
                 <button
                   key={srv.id}
                   onClick={() => setCurrentServer(idx)}
                   className={clsx(
                     "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex flex-col items-center md:items-start min-w-[110px] relative overflow-hidden",
                     currentServer === idx 
                       ? "bg-surface shadow-lg text-white ring-1 ring-white/10" 
                       : "text-text-muted hover:text-white hover:bg-white/5"
                   )}
                 >
                    {/* Индикатор активности */}
                    {currentServer === idx && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    )}
                    
                    <span className="flex items-center gap-2 font-bold">
                       <Server size={14} className={currentServer === idx ? "text-primary" : "text-text-muted"} /> 
                       {srv.name}
                    </span>
                    <span className="text-[10px] opacity-60 hidden md:block">{srv.desc}</span>
                 </button>
              ))}
           </div>

           {/* Кнопки действий (Справа) */}
           <div className="flex gap-2 shrink-0 absolute top-4 right-4 md:static">
              <button 
                onClick={handleReload}
                className="group p-3 rounded-xl bg-surface border border-white/10 text-text-muted hover:text-white hover:border-primary transition relative"
                title="Перезагрузить плеер"
              >
                 <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
              </button>
              
              <button 
                onClick={onClose}
                className="p-3 rounded-xl bg-surface border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition"
              >
                 <X size={20} />
              </button>
           </div>
        </div>

        {/* === ПЛЕЕР (IFRAME) === */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
           
           {/* Лоадер */}
           {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface">
                 <div className="relative">
                    <div className="w-20 h-20 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <MonitorPlay size={28} className="text-white/20" />
                    </div>
                 </div>
                 <p className="mt-6 text-text-muted font-medium animate-pulse">
                    Подключение к {server.name}...
                 </p>
              </div>
           )}

           <iframe
             key={`${src}-${iframeKey}`}
             src={src}
             width="100%"
             height="100%"
             frameBorder="0"
             allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
             referrerPolicy="origin"
             onLoad={() => setIsLoading(false)}
             className={clsx(
                "w-full h-full bg-black transition-opacity duration-700",
                isLoading ? "opacity-0" : "opacity-100"
             )}
           ></iframe>
        </div>

        {/* === ПРЕДУПРЕЖДЕНИЕ ДЛЯ localhost === */}
        {showWarning && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-bottom-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg shrink-0 text-yellow-500">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h4 className="text-yellow-200 font-bold text-sm mb-1">Плеер заблокирован провайдером</h4>
                    <p className="text-yellow-200/70 text-sm leading-relaxed">
                        Серверы <strong>Kodik</strong> и <strong>VideoCDN</strong> не работают на локальном компьютере (<code className="bg-black/20 px-1 rounded">localhost</code>). 
                        Они заработают автоматически, когда вы выложите сайт в интернет и зарегистрируете домен. 
                        <br/>
                        👉 <strong>Пока используйте VidSrc</strong>.
                    </p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default PlayerModal;