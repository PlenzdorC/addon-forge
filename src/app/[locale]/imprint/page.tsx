'use client';

import { Scale, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Imprint() {
  const params = useParams();
  const locale = (params.locale as string) || 'de';
  const t = useTranslations('imprint');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">{t('title')}</h1>
        <p className="text-slate-400">
          {t('subtitle')}
        </p>
      </div>

      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <Scale className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-4">{t('responsible')}</h2>
            
            <div className="space-y-3 text-slate-300">
              <p className="font-semibold text-lg">{t('name')}</p>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{t('address')}</p>
                  <p>{t('city')}</p>
                  <p>{t('country')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                <a 
                  href="mailto:christian.plenzdorf.business@gmail.com"
                  className="text-amber-400 hover:underline"
                >
                  christian.plenzdorf.business@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">{t('disclaimer')}</h2>
        
        <div className="space-y-6 text-slate-300">
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">{t('contentLiability')}</h3>
            <p className="text-sm leading-relaxed">
              {t('contentLiabilityText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">{t('linkLiability')}</h3>
            <p className="text-sm leading-relaxed">
              {t('linkLiabilityText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">{t('copyright')}</h3>
            <p className="text-sm leading-relaxed">
              {t('copyrightText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">{t('disclaimerTitle')}</h3>
            <p className="text-sm leading-relaxed">
              {t('disclaimerText')}
            </p>
          </div>
        </div>
      </div>

      <div className="wow-card p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">{t('moreInfo')}</h2>
        <div className="space-y-2">
          <Link 
            href={`/${locale}/privacy`}
            className="block text-amber-400 hover:underline"
          >
            {t('privacyLink')}
          </Link>
          <Link 
            href={`/${locale}`}
            className="block text-amber-400 hover:underline"
          >
            {t('homeLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}

