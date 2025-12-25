import PageHeader from '@/components/layout/PageHeader';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="FAQ (Вопросы и ответы)" />
      <div className="container mx-auto px-4 mt-8 max-w-3xl space-y-4">
        {[
          { q: "Это бесплатно?", a: "Да, FilmZone Pro полностью бесплатен. Мы используем открытые источники для предоставления контента." },
          { q: "Как включить русскую озвучку?", a: "В плеере (Kodik/VideoCDN) есть выпадающее меню 'Перевод'. Нажмите на него и выберите нужную студию (LostFilm, HDRezka и т.д.)." },
          { q: "Почему не работает плеер?", a: "Попробуйте переключить сервер в верхней части плеера (например, на VidSrc или SuperEmbed). Если у вас включен VPN, попробуйте выключить его." },
          { q: "Можно ли скачать фильм?", a: "К сожалению, мы предоставляем только онлайн-просмотр." }
        ].map((item, i) => (
          <div key={i} className="bg-surface border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
               <ChevronDown className="text-primary" /> {item.q}
            </h3>
            <p className="text-text-muted pl-8">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const About = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="О проекте" />
      <div className="container mx-auto px-4 mt-8 max-w-3xl text-text-muted text-lg leading-relaxed space-y-6">
        <p>
          <strong className="text-white">FilmZone Pro</strong> — это современный онлайн-кинотеатр, созданный с любовью к кинематографу и технологиям.
        </p>
        <p>
          Мы используем передовые технологии (React, Tailwind, TMDB API), чтобы предоставить вам лучший опыт просмотра фильмов на любом устройстве — от телефона до 4K телевизора.
        </p>
        <p>
          Вся информация о фильмах (постеры, описания, рейтинг) предоставлена сервисом TMDB. Видео-контент загружается из сторонних открытых источников.
        </p>
        <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl text-white">
           Связь с разработчиком: <a href="mailto:admin@filmzone.pro" className="underline font-bold">admin@filmzone.pro</a>
        </div>
      </div>
    </div>
  );
};