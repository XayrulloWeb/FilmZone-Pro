import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-center px-4 relative overflow-hidden">
      {/* Пятно на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      
      <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent leading-none select-none opacity-20">
        404
      </h1>
      
      <div className="relative z-10 -mt-10 md:-mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Страница потерялась в космосе</h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Кажется, вы пытаетесь найти фильм, который еще не сняли. Или ссылка сломалась.
        </p>
        
        <Link 
          to="/" 
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all inline-block"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;