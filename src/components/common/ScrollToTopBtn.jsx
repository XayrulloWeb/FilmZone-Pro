import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopBtn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopBtn;