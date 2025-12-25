import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useCommentStore } from '@/store/commentStore';
import { Send, Trash2, User, MessageSquare } from 'lucide-react';
import { useToastStore } from '@/components/common/Toast';

const CommentsSection = ({ movieId }) => {
  const { t } = useTranslation();
  const { comments, fetchComments, addComment, deleteComment, isLoading } = useCommentStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments(movieId);
    // Добавили fetchComments в зависимости, чтобы линтер был счастлив
  }, [movieId, fetchComments]); 

  // ... остальной код компонента без изменений ...
  // Скопируй внутренности из предыдущего шага, удалив импорт clsx сверху
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    const success = await addComment(movieId, content);
    setSubmitting(false);

    if (success) {
      setContent('');
      addToast(t('comments.added'), 'success');
    } else {
      addToast(t('comments.error'), 'error');
    }
  };

  const handleDelete = async (id) => {
      if(window.confirm(t('comments.deleteConfirm'))) {
          await deleteComment(id);
          addToast(t('comments.deleted'), 'info');
      }
  }

  return (
    <div className="mt-16 max-w-4xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
         <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
         {t('comments.title')} <span className="text-text-muted opacity-60 text-lg">({comments.length})</span>
      </h3>

      <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8">
         {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0 font-bold text-white">
                  {user?.email?.[0].toUpperCase()}
               </div>
               <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t('comments.placeholder')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all min-h-[100px] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                     <button 
                        disabled={submitting || !content.trim()}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Send size={16} /> {t('comments.send')}
                     </button>
                  </div>
               </div>
            </form>
         ) : (
            <div className="text-center py-6">
               <MessageSquare size={40} className="mx-auto text-text-muted mb-3" />
               <p className="text-white font-medium mb-2">{t('comments.loginRequired')}</p>
               <p className="text-sm text-text-muted">{t('comments.loginDesc')}</p>
            </div>
         )}
      </div>

      <div className="space-y-4">
         {isLoading && <div className="text-center text-text-muted">{t('comments.loading')}</div>}
         
         {!isLoading && comments.length === 0 && (
             <div className="text-center py-10 opacity-50 text-text-muted">
                 {t('comments.empty')}
             </div>
         )}

         {comments.map((comment) => (
            <div key={comment.id} className="bg-surface/50 border border-white/5 p-4 rounded-xl flex gap-4 animate-in fade-in slide-in-from-bottom-2">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <User size={20} className="text-text-muted" />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-white font-bold text-sm">
                            {comment.user?.email || t('comments.user')}
                        </h4>
                        <span className="text-xs text-text-muted">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                     {user && user.id === comment.userId && (
                         <button 
                            onClick={() => handleDelete(comment.id)}
                            className="text-text-muted hover:text-red-500 transition p-1"
                         >
                            <Trash2 size={16} />
                         </button>
                     )}
                  </div>
                  <p className="text-gray-300 mt-2 text-sm leading-relaxed whitespace-pre-line">
                      {comment.content}
                  </p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default CommentsSection;