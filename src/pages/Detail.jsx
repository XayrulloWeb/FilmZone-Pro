import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tmdbService } from "@/services/tmdb.service";
import { Play, PlayCircle, Star, Clock, Calendar, Share2 } from "lucide-react";

// Хуки и сторы
import { useHistoryStore } from "@/store/historyStore";
import { useToastStore } from "@/components/common/Toast"; // <--- Импорт тостов
import useDocumentTitle from "@/hooks/useDocumentTitle";
import CommentsSection from "@/components/movie/CommentsSection";
// Компоненты
import SeasonList from "@/components/movie/SeasonList";
import VideoModal from "@/components/common/VideoModal";
import PlayerModal from "@/components/common/PlayerModal"; // <--- Импорт плеера
import MovieSlider from "@/components/movie/MovieSlider";
import CastList from "@/components/movie/CastList";
import WatchlistBtn from "@/components/movie/WatchlistBtn";
import Img from "@/components/common/Img";

const Detail = ({ category = "movie" }) => {
  // ================== 1. ВСЕ ХУКИ (В САМОМ ВЕРХУ) ==================
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addToHistory } = useHistoryStore();
  const { addToast } = useToastStore(); // <--- 🔥 ВСТАВИЛИ СЮДА (ДО RETURN)

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false); // <--- Состояние плеера

  // SEO Заголовок
  const pageTitle = item
    ? `${item.title || item.name} (${
        (item.release_date || item.first_air_date)?.split("-")[0]
      })`
    : t("detail.loading");
  useDocumentTitle(pageTitle);

  // Загрузка данных
  useEffect(() => {
    const getDetail = async () => {
      setLoading(true);
      setItem(null);
      window.scrollTo(0, 0);
      try {
        const response = await tmdbService.getDetails(category, id);
        setItem(response);
      } catch {
        // Убрали (err)
        addToast(t("pages.detail.notFound"), "error");
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, [category, id, i18n.language, addToast, t]);

  // Сохранение в историю
  useEffect(() => {
    if (item) {
      addToHistory({
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        media_type: category,
        date: new Date().toISOString(),
      });
    }
  }, [item, category, addToHistory]);

  // ================== 2. УСЛОВНЫЕ RETURN (ПОСЛЕ ХУКОВ) ==================
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!item)
    return (
      <div className="text-center pt-40 text-white">
        {t("pages.detail.notFound")}
      </div>
    );

  // ================== 3. ЛОГИКА И РЕНДЕР ==================
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const runtime =
    item.runtime ||
    (item.episode_run_time?.length > 0 ? item.episode_run_time[0] : null);
  const trailer =
    item.videos?.results?.find(
      (vid) => vid.name.includes("Trailer") || vid.name.includes("Official")
    ) || item.videos?.results?.[0];

  // Функция "Поделиться"
  const handleShare = async () => {
    const shareData = {
      title: `${t("detail.watchOnline")} ${title}`,
      text: `${t("detail.watchOnline")} ${title} - FilmZone`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast(t("detail.linkSent"), "success");
      } catch {
        // Отмена шаринга
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast(t("detail.linkCopied"), "success");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <div className="absolute inset-0">
          <Img
            src={item.backdrop_path}
            size="original" // 4K качество
            className="w-full h-full object-cover"
            alt={title}
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t
                                  from-background via-background/60 to-transparent"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* 2. КОНТЕНТ */}
      <div className="container mx-auto px-4 md:px-10 relative -mt-60 md:-mt-80 z-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* ЛЕВО: Постер и Кнопки */}
          <div className="shrink-0 w-full max-w-[350px] mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 group relative aspect-[2/3]">
              <Img
                src={item.poster_path}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Кнопка Трейлер */}
            <button
              onClick={() => setTrailerOpen(true)}
              className="w-full mt-4 bg-white/10 backdrop-blur-md text-white border border-white/10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition"
            >
              <Play fill="currentColor" size={20} /> {t("detail.trailer")}
            </button>

            {/* 🔥 Кнопка СМОТРЕТЬ ФИЛЬМ */}
            <button
              onClick={() => setPlayerOpen(true)}
              className="w-full mt-3 bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg shadow-primary/20"
            >
              <PlayCircle fill="currentColor" size={24} />
              {t("detail.watchOnline")}
            </button>
          </div>

          {/* ПРАВО: Инфо */}
          <div className="flex-1 text-white pt-4 md:pt-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base font-medium text-text-muted">
              <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                <Star size={16} fill="currentColor" />{" "}
                {item.vote_average?.toFixed(1)}
              </span>
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {runtime} {t("pages.detail.minutes")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={16} /> {date?.split("-")[0]}
              </span>
              <span className="px-2 py-1 border border-white/20 rounded text-xs uppercase">
                {category === "tv" ? t("movieCard.tvShow") : t("movieCard.movieFull")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {item.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition cursor-default text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-bold mb-2 text-white">
              {t("detail.overview")}
            </h3>
            <p className="text-text-muted leading-relaxed text-lg mb-8 max-w-3xl">
              {item.overview}
            </p>

            {/* Кнопки действий: Watchlist + Share */}
            <div className="flex flex-wrap gap-4 mb-10">
              <WatchlistBtn movie={item} />

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-surface hover:bg-surface-hover text-white transition-all font-bold"
              >
                <Share2 size={20} />
                {t("detail.share")}
              </button>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                {t("detail.cast")}
              </h3>
              <CastList cast={item.credits?.cast} />
            </div>
          </div>
        </div>

        {/* 3. СЕЗОНЫ (Только для сериалов) */}
        {category === "tv" && item.seasons && (
          <SeasonList seasons={item.seasons} />
        )}

        {/* 4. ПОХОЖИЕ */}
        <div className="mt-16">
          <MovieSlider
            title={t("detail.similar")}
            movies={item.similar?.results}
          />
        </div>
        <CommentsSection movieId={item.id} />
      </div>

      {/* 5. МОДАЛКИ */}
      {/* Трейлер */}
      {trailer && (
        <VideoModal
          active={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          videoKey={trailer.key}
        />
      )}

      {/* 🔥 Плеер (Фильм) */}
      <PlayerModal
        active={playerOpen}
        onClose={() => setPlayerOpen(false)}
        tmdbId={item.id}
        title={title}
        type={category}
      />
    </div>
  );
};

export default Detail;
