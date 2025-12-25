import { Routes, Route } from "react-router-dom";

// Компоненты Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import ToastContainer from "@/components/common/Toast"; // Уведомления
import BottomNav from "@/components/layout/BottomNav";
import ErrorBoundary from "@/components/common/ErrorBoundary";
// Страницы
import { FAQ, About } from "@/pages/StaticPages";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Detail from "@/pages/Detail";
import Person from "@/pages/Person";
import Profile from "@/pages/Profile"; // Профиль
import NotFound from "@/pages/NotFound";
import WatchlistPage from "@/pages/Watchlist"; // Старая страница (можно оставить или убрать)

function App() {
  return (
    <ErrorBoundary>
      {/* Скролл вверх при переходе */}
      <ScrollToTop />

      {/* Навигация */}
      <Navbar />

      {/* Маршруты */}
      <Routes>
        {/* Главная */}
        <Route path="/" element={<Home />} />

        {/* Детальные страницы (Фильм / Сериал) */}
        <Route path="/movie/:id" element={<Detail category="movie" />} />
        <Route path="/tv/:id" element={<Detail category="tv" />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<About />} />
        {/* Профиль (История + Избранное) */}
        <Route path="/profile" element={<Profile />} />

        {/* Если кто-то по старой памяти зайдет на watchlist */}
        <Route path="/watchlist" element={<Profile />} />

        {/* Персона */}
        <Route path="/person/:id" element={<Person />} />

        {/* Каталоги */}
        <Route path="/movies" element={<Catalog type="movie" />} />
        <Route path="/series" element={<Catalog type="tv" />} />

        {/* Ошибка 404 (Все остальные пути) */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Подвал */}
      <Footer />
      <BottomNav />
      {/* Контейнер для всплывающих уведомлений */}
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
