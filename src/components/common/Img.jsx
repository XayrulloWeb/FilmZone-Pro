import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import clsx from 'clsx';

// Добавили prop "size", по умолчанию "w500"
const Img = ({ src, className, alt, size = 'w500', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Теперь размер динамический: w500, w1280 или original
  const fullSrc = src ? `${import.meta.env.VITE_TMDB_IMG}/${size}${src}` : null;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      className={clsx(
        "relative overflow-hidden bg-surface-hover", 
        className
      )}
    >
      {(isError || !fullSrc) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-hover text-text-muted/20">
          <ImageOff size={32} strokeWidth={1.5} />
        </div>
      )}

      {!isLoaded && !isError && fullSrc && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}

      {fullSrc && !isError && (
        <img
          src={fullSrc}
          alt={alt || "Image"}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={clsx(
            "w-full h-full object-cover transition-all duration-700 ease-in-out",
            isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg"
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default Img;