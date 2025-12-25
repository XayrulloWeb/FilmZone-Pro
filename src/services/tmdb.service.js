import api from './axios';

export const tmdbService = {
  // Получить список трендов
  getTrending: async (type = 'movie', time = 'week') => {
    const response = await api.get(`/trending/${type}/${time}`);
    return response.data;
  },

  // Получить списки (popular, top_rated, upcoming)
  getList: async (type, category, params = {}) => {
    const response = await api.get(`/${type}/${category}`, { params });
    return response.data;
  },

  // Поиск по жанрам (обычный)
  discoverByGenre: async (genreId, page = 1) => {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page
      }
    });
    return response.data;
  },

  // Получить данные сезона (для эпизодов)
  getSeason: async (tvId, seasonNumber) => {
    const response = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  },

  // Получить список жанров
  getGenres: async (type) => {
    const response = await api.get(`/genre/${type}/list`);
    return response.data.genres;
  },

  // 🔥 УМНЫЙ метод получения фильмов (Поиск + Фильтры + Студии + Жанры)
  getMovies: async (type, params = {}) => {
    // 1. Если это поиск по тексту (Query) - сразу возвращаем результат поиска
    if (params.query && params.query.length > 0) {
      const response = await api.get(`/search/${type}`, { params });
      return response.data;
    }

    // 2. Создаем копию параметров для модификации
    const smartParams = { ...params };

    // 3. ЛОГИКА СТУДИЙ (КОМПАНИЙ)
    if (smartParams.company) {
        const companies = {
            'marvel': '420',    // Marvel Studios
            'dc': '9993',       // DC Entertainment
            'disney': '2',      // Walt Disney Pictures
            'pixar': '3',       // Pixar
            'netflix': '213',   // Netflix
            'hbo': '3186',      // HBO
            'anime_studios': '2883,10342,4169' // Toei, MAPPA, Ghibli
        };
        
        // Если нашли студию в списке - ставим её ID
        if (companies[smartParams.company]) {
            smartParams.with_companies = companies[smartParams.company];
            delete smartParams.company; // Удаляем служебный ключ
        }
    }

    // 4. ЛОГИКА КАСТОМНЫХ ЖАНРОВ
    // Если выбрали АНИМЕ
    if (smartParams.with_genres === 'anime') {
        smartParams.with_genres = '16'; // Жанр: Мультфильм
        smartParams.with_original_language = 'ja'; // Язык: Японский
    }
    // Если выбрали ДОРАМЫ
    else if (smartParams.with_genres === 'dorama') {
        smartParams.with_genres = '18'; // Жанр: Драма
        smartParams.with_original_language = 'ko'; // Язык: Корейский
    }
    // Если выбрали МУЛЬТФИЛЬМЫ (Западные)
    else if (smartParams.with_genres === 'cartoon') {
        smartParams.with_genres = '16'; // Жанр: Мультфильм
        smartParams.without_original_language = 'ja'; // Исключить японский
    }
    // Если выбрали ИНДИЙСКОЕ
    else if (smartParams.with_genres === 'indian') {
        delete smartParams.with_genres; // Жанр любой
        smartParams.with_original_language = 'hi'; // Язык: Хинди
        smartParams.region = 'IN';
    }
    
    // 5. Обычный запрос Discover с обновленными параметрами
    const response = await api.get(`/discover/${type}`, { params: smartParams });
    return response.data;
  },

  // Получить персону
  getPerson: async (id) => {
    const response = await api.get(`/person/${id}`, {
      params: { append_to_response: 'movie_credits,tv_credits,images' }
    });
    return response.data;
  },

  // Получить детали фильма
  getDetails: async (type, id) => {
    const response = await api.get(`/${type}/${id}`, {
      params: { append_to_response: 'videos,credits,images,similar' }
    });
    return response.data;
  },

  // Глобальный поиск (для SearchModal)
  search: async (type = 'multi', params = {}) => {
    const response = await api.get(`/search/${type}`, { params });
    return response.data;
  }
};
export default tmdbService;