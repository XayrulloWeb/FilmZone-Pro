import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { X, Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { useToastStore } from '@/components/common/Toast';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    let success = false;
    if (isLoginMode) {
      success = await login(email, password);
    } else {
      success = await register(email, password);
    }

    if (success) {
      addToast(isLoginMode ? 'С возвращением!' : 'Аккаунт создан!', 'success');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LogIn className="text-primary" /> 
                {isLoginMode ? t('nav.login') || 'Вход' : 'Регистрация'}
             </h2>
             <button onClick={onClose} className="text-text-muted hover:text-white transition">
                <X size={20} />
             </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
             {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                   {Array.isArray(error) ? error[0] : error}
                </div>
             )}

             <div className="space-y-1">
                <label className="text-sm font-bold text-text-muted ml-1">Email</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                   <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-primary outline-none transition-colors"
                      placeholder="name@example.com"
                   />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-sm font-bold text-text-muted ml-1">Пароль</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                   <input 
                      type="password" 
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-primary outline-none transition-colors"
                      placeholder="••••••••"
                   />
                </div>
             </div>

             <button 
                type="submit" 
                disabled={isLoading}
                className="mt-4 w-full bg-primary hover:bg-primary/80 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isLoading ? <Loader2 className="animate-spin" /> : (isLoginMode ? t('auth.login') : t('auth.register'))}
             </button>
          </form>

          {/* Footer */}
          <div className="p-4 bg-black/20 text-center border-t border-white/5">
             <p className="text-sm text-text-muted">
                {isLoginMode ? t('auth.noAccount') : t('auth.hasAccount')}
                <button 
                   onClick={() => { setIsLoginMode(!isLoginMode); clearError(); }}
                   className="ml-2 text-primary hover:underline font-bold"
                >
                   {isLoginMode ? t('auth.signUp') : t('auth.login')}
                </button>
             </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;