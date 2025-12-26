'use client';

import { Github, Heart } from 'lucide-react';
import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              {t('about')}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('aboutText')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              {t('links')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {t('allRequests')}
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {t('createRequest')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {t('aboutProject')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              {t('legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/imprint"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {t('imprint')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              {t('support')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/support"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {t('supportUs')}
                </Link>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/nmxsz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  {t('buyMeACoffee')} ☕
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              {t('copyright', {year: currentYear})}
            </p>
            
            <div className="flex items-center gap-4">
              <a
                href="https://buymeacoffee.com/nmxsz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-semibold rounded-lg transition-all text-sm"
              >
                ☕ {t('buyMeACoffee')}
              </a>
              
              <p className="text-sm text-slate-400 flex items-center">
                {t.rich('madeWith', {
                  heart: () => <Heart className="h-4 w-4 mx-1 text-red-500" />
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

