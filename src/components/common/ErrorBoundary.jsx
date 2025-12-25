import { Component } from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={40} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Что-то пошло не так</h1>
            <p className="text-text-muted mb-6">
              Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте обновить страницу.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:brightness-110 transition"
              >
                Обновить страницу
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-surface border border-white/10 text-white rounded-xl font-bold hover:bg-surface-hover transition flex items-center gap-2"
              >
                <Home size={18} />
                На главную
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

