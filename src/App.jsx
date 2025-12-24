import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import Detail from '@/pages/Detail';
import Person from '@/pages/Person';
import NotFound from '@/pages/NotFound';
import Footer from '@/components/layout/Footer';
import WatchlistPage from './pages/Watchlist';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 🔥 ВАЖНО: Разделяем маршруты */}
        <Route path="/movie/:id" element={<Detail category="movie" />} />
        <Route path="/tv/:id" element={<Detail category="tv" />} />
        <Route path="/watchlist" element={<WatchlistPage  />} />
        <Route path="/person/:id" element={<Person />} />
        <Route path="/movies" element={<Catalog type="movie" />} />
        <Route path="/series" element={<Catalog type="tv" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;