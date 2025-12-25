import PageHeader from '@/components/layout/PageHeader';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FAQ = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={t('static.faq.title')} />
      <div className="container mx-auto px-4 mt-8 max-w-3xl space-y-4">
        {[
          { q: t('static.faq.q1'), a: t('static.faq.a1') },
          { q: t('static.faq.q2'), a: t('static.faq.a2') },
          { q: t('static.faq.q3'), a: t('static.faq.a3') },
          { q: t('static.faq.q4'), a: t('static.faq.a4') }
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
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={t('static.about.title')} />
      <div className="container mx-auto px-4 mt-8 max-w-3xl text-text-muted text-lg leading-relaxed space-y-6">
        <p dangerouslySetInnerHTML={{ __html: t('static.about.desc1') }} />
        <p dangerouslySetInnerHTML={{ __html: t('static.about.desc2') }} />
        <p dangerouslySetInnerHTML={{ __html: t('static.about.desc3') }} />
        <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl text-white">
           {t('static.about.contact')} <a href="mailto:admin@filmzone.pro" className="underline font-bold">admin@filmzone.pro</a>
        </div>
      </div>
    </div>
  );
};