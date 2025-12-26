'use client';

import { Shield, Database, Cookie, Eye, Lock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Privacy() {
  const params = useParams();
  const locale = (params.locale as string) || 'de';
  const t = useTranslations('privacy');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">{t('title')}</h1>
        <p className="text-slate-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Übersicht */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">{t('overview')}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('overviewText')}
            </p>
          </div>
        </div>
      </div>

      {/* Verantwortlicher */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">{t('responsible')}</h2>
        <div className="text-slate-300 space-y-1">
          <p className="font-semibold">Christian Plenzdorf</p>
          <p>Paul-Ritter-Straße 25</p>
          <p>{locale === 'de' ? '90431 Nürnberg' : '90431 Nuremberg'}</p>
          <p>{locale === 'de' ? 'Deutschland' : 'Germany'}</p>
          <p className="mt-3">
            E-Mail:{' '}
            <a 
              href="mailto:christian.plenzdorf.business@gmail.com"
              className="text-amber-400 hover:underline"
            >
              christian.plenzdorf.business@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Datenerfassung */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Database className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">{t('dataCollection')}</h2>
        </div>

        <div className="space-y-6 text-slate-300">
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">1. {t('googleAuth')}</h3>
            <p className="text-sm leading-relaxed mb-2">
              {t('googleAuthText')}
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>{t('googleAuthItems.userId')}</li>
              <li>{t('googleAuthItems.email')}</li>
              <li>{t('googleAuthItems.name')}</li>
              <li>{t('googleAuthItems.photo')}</li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              {t('googleAuthNote')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">2. {t('userProfile')}</h3>
            <p className="text-sm leading-relaxed mb-2">
              {t('userProfileText')}
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>{t('userProfileItems.userId')}</li>
              <li>{t('userProfileItems.email')}</li>
              <li>{t('userProfileItems.username')}</li>
              <li>{t('userProfileItems.photo')}</li>
              <li>{t('userProfileItems.admin')}</li>
              <li>{t('userProfileItems.created')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">3. {t('requests')}</h3>
            <p className="text-sm leading-relaxed mb-2">
              {t('requestsText')}
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>{t('requestsItems.title')}</li>
              <li>{t('requestsItems.category')}</li>
              <li>{t('requestsItems.user')}</li>
              <li>{t('requestsItems.dates')}</li>
              <li>{t('requestsItems.engagement')}</li>
              <li>{t('requestsItems.optional')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">4. {t('comments')}</h3>
            <p className="text-sm leading-relaxed mb-2">
              {t('commentsText')}
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>{t('commentsItems.text')}</li>
              <li>{t('commentsItems.user')}</li>
              <li>{t('commentsItems.date')}</li>
              <li>{t('commentsItems.admin')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zweck der Datenverarbeitung */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Eye className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">{t('purpose')}</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('authentication')}</h3>
            <p className="leading-relaxed">
              {t('authenticationText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('community')}</h3>
            <p className="leading-relaxed">
              {t('communityText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('management')}</h3>
            <p className="leading-relaxed">
              {t('managementText')}
            </p>
          </div>
        </div>
      </div>

      {/* Cookies */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Cookie className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">{t('cookies')}</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('firebaseAuth')}</h3>
            <p className="leading-relaxed">
              {t('firebaseAuthText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('cookiePrefs')}</h3>
            <p className="leading-relaxed">
              {t('cookiePrefsText')}
            </p>
          </div>
        </div>
      </div>

      {/* Datensicherheit */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Lock className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">{t('security')}</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <p className="leading-relaxed">
            {t('securityText')}
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>{t('securityItems.https')}</li>
            <li>{t('securityItems.encryption')}</li>
            <li>{t('securityItems.rules')}</li>
            <li>{t('securityItems.updates')}</li>
          </ul>
        </div>
      </div>

      {/* Deine Rechte */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">{t('rights')}</h2>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('rightAccess')}</h3>
            <p className="leading-relaxed">
              {t('rightAccessText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('rightCorrection')}</h3>
            <p className="leading-relaxed">
              {t('rightCorrectionText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('rightDeletion')}</h3>
            <p className="leading-relaxed">
              {t('rightDeletionText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('rightObjection')}</h3>
            <p className="leading-relaxed">
              {t('rightObjectionText')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('rightPortability')}</h3>
            <p className="leading-relaxed">
              {t('rightPortabilityText')}
            </p>
          </div>
        </div>
      </div>

      {/* Drittanbieter */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">{t('thirdParty')}</h2>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('firebase')}</h3>
            <p className="leading-relaxed mb-2">
              {t('firebaseText')}
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>{t('firebaseItems.auth')}</li>
              <li>{t('firebaseItems.database')}</li>
              <li>{t('firebaseItems.hosting')}</li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              {locale === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">firebase.google.com/support/privacy</a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">{t('googleSignIn')}</h3>
            <p className="leading-relaxed">
              {t('googleSignInText')}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {locale === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">policies.google.com/privacy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="wow-card p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">{t('contact')}</h2>
        <p className="text-slate-300 text-sm mb-4">
          {t('contactText')}
        </p>
        <p className="text-slate-300">
          <a 
            href="mailto:christian.plenzdorf.business@gmail.com"
            className="text-amber-400 hover:underline"
          >
            christian.plenzdorf.business@gmail.com
          </a>
        </p>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            {t('updated')} | <Link href={`/${locale}/imprint`} className="text-amber-400 hover:underline">{locale === 'de' ? 'Impressum' : 'Imprint'}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

