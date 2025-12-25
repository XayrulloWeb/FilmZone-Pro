import { create } from 'zustand';
import api from '@/services/axios';

export const useCommentStore = create((set, get) => ({
  comments: [],
  isLoading: false,

  // Загрузить комментарии для фильма
  fetchComments: async (movieId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/comments/${movieId}`);
      set({ comments: response.data, isLoading: false });
    } catch (error) {
      console.error('Ошибка загрузки комментариев', error);
      set({ isLoading: false });
    }
  },

  // Добавить комментарий
  addComment: async (movieId, content) => {
    try {
      await api.post('/comments', { movieId, content });
      // После добавления обновляем список
      get().fetchComments(movieId);
      return true;
    } catch (error) {
      console.error('Ошибка добавления комментария', error);
      return false;
    }
  },

  // Удалить комментарий
  deleteComment: async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      // Обновляем список (убираем удаленный)
      set(state => ({
          comments: state.comments.filter(c => c.id !== commentId)
      }));
    } catch (error) {
      console.error('Ошибка удаления', error);
    }
  }
}));