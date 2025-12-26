'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddonRequest, NewsArticle } from '@/types';
import { formatDate, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { Sparkles, Calendar, User, Download, Github, Loader2, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function NewsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('news');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [completedRequests, setCompletedRequests] = useState<AddonRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query for published news articles
    const newsQuery = query(
      collection(db, 'news'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const newsUnsubscribe = onSnapshot(
      newsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NewsArticle[];
        
        setNewsArticles(articlesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    );

    // Query for completed requests with download URL or GitHub repo (for sidebar)
    const requestsQuery = query(
      collection(db, 'requests'),
      where('status', '==', 'completed'),
      orderBy('updatedAt', 'desc'),
      limit(5)
    );

    const requestsUnsubscribe = onSnapshot(
      requestsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const requestsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((request: any) => request.downloadUrl || request.githubRepo) as AddonRequest[];
        
        setCompletedRequests(requestsData);
      },
      (error) => {
        console.error('Error fetching completed requests:', error);
      }
    );

    return () => {
      newsUnsubscribe();
      requestsUnsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-3 text-slate-400">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Newspaper className="h-8 w-8 text-amber-400 mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-xl text-slate-300 mb-6">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Content + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - News Articles */}
        <div className="lg:col-span-2">
          {newsArticles.length === 0 ? (
            <div className="wow-card p-12 text-center">
              <Newspaper className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {t('noArticles')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {newsArticles.map((article) => (
                <article key={article.id} className="wow-card p-6 hover:border-amber-500/50 transition-all">
                  {/* Cover Image */}
                  {article.coverImage && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Article Header */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">
                      {article.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{t('by')} {article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More - could link to detail page in future */}
                  <div className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-sm font-semibold">
                    <span>{t('readMore')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Completed AddOns */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {t('sidebarTitle')}
            </h2>

            {completedRequests.length === 0 ? (
              <div className="wow-card p-6 text-center">
                <p className="text-slate-500 text-sm">
                  {t('noNews')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="wow-card p-4 hover:border-amber-500/50 transition-all group"
                  >
                    {/* Screenshot Preview */}
                    {request.screenshots && request.screenshots.length > 0 && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-slate-700">
                        <img
                          src={request.screenshots[0]}
                          alt={request.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <Link href={`/request/${request.id}`}>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-2 line-clamp-2">
                        {request.title}
                      </h3>
                    </Link>

                    {/* Category */}
                    <div className="mb-3">
                      <span className={`category-badge text-xs ${getCategoryColor(request.category)}`}>
                        {getCategoryLabel(request.category, locale)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {request.downloadUrl && (
                        <a
                          href={request.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded transition-all text-slate-900 font-semibold text-xs"
                          title={t('downloadNow')}
                        >
                          <Download className="h-3 w-3" />
                        </a>
                      )}
                      {request.githubRepo && (
                        <a
                          href={request.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded transition-colors text-xs"
                          title={t('checkGithub')}
                        >
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                      <Link
                        href={`/request/${request.id}`}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded transition-colors text-xs"
                        title={t('viewDetails')}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

