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

  // Поиск по жанрам
  discoverByGenre: async (genreId, page = 1) => {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page
      }
    });
    return response.data;
  },
  // Получить список жанров (Action, Comedy...)
  getGenres: async (type) => {
    const response = await api.get(`/genre/${type}/list`);
    return response.data.genres;
  },

  // УМНЫЙ метод получения фильмов (Поиск или Фильтр)
  getMovies: async (type, params = {}) => {
    // Если есть query - это поиск по тексту
    if (params.query && params.query.length > 0) {
      const response = await api.get(`/search/${type}`, { params });
      return response.data;
    }

    // Иначе - это Discover (фильтры)
    const response = await api.get(`/discover/${type}`, { params });
    return response.data;
  },
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

  // Поиск
  search: async (type = 'multi', params = {}) => {
    const response = await api.get(`/search/${type}`, { params });
    return response.data;
  }
};
