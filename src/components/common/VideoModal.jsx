import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ active, onClose, videoKey }) => {
  const contentRef = useRef(null);

  // Закрываем при клике вне видео
  const onCloseModal = () => {
    onClose();
  };

  // Закрытие по ESC
  useEffect(() => {
    if (!active) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [active, onClose]);

  if (!active || !videoKey) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${active ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={onCloseModal}
    >
      <div 
        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl scale-100 transition-transform"
        onClick={e => e.stopPropagation()} // Чтобы клик по видео не закрывал модалку
      >
        {/* Кнопка закрыть */}
        <div 
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-primary transition-colors"
            onClick={onClose}
        >
            <X className="text-white" size={24} />
        </div>

        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          width="100%"
          height="100%"
          title="video"
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoModal;