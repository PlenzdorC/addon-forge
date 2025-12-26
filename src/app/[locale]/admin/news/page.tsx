'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { isUserAdmin } from '@/lib/admin';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { NewsArticle } from '@/types';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Newspaper } from 'lucide-react';
import AdminRoute from '@/components/AdminRoute';
import { formatDate } from '@/lib/utils';
import { useTranslations } from 'next-intl';

function AdminNewsContent() {
  const router = useRouter();
  const t = useTranslations('admin');
  const [user] = useAuthState(auth);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    published: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as NewsArticle[];
      setArticles(articlesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      coverImage: article.coverImage || '',
      tags: article.tags?.join(', ') || '',
      published: article.published,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      tags: '',
      published: false,
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingArticle(null);
    setIsCreating(false);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      tags: '',
      published: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const authorName = userDoc.exists()
        ? userDoc.data()?.displayName || user.displayName || 'Admin'
        : user.displayName || 'Admin';

      const articleData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage || null,
        author: authorName,
        authorId: user.uid,
        published: formData.published,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter((t) => t) : [],
        updatedAt: serverTimestamp(),
      };

      if (editingArticle) {
        await updateDoc(doc(db, 'news', editingArticle.id), articleData);
        alert(t('articleSaved'));
      } else {
        await addDoc(collection(db, 'news'), {
          ...articleData,
          createdAt: serverTimestamp(),
        });
        alert(t('articleSaved'));
      }

      handleCancel();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await deleteDoc(doc(db, 'news', id));
      alert(t('articleDeleted'));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  const togglePublished = async (article: NewsArticle) => {
    try {
      await updateDoc(doc(db, 'news', article.id), {
        published: !article.published,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-amber-500" />
            {t('newsTitle')}
          </h1>
          <p className="text-slate-400">Verwalte News-Artikel für die Community</p>
        </div>
        <button
          onClick={handleCreate}
          className="wow-button flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {t('createNews')}
        </button>
      </div>

      {/* Edit/Create Form */}
      {(isCreating || editingArticle) && (
        <div className="wow-card p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">
            {editingArticle ? t('editNews') : t('createNews')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('articleTitle')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="wow-input w-full"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('articleExcerpt')} *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="wow-input w-full min-h-[80px]"
                required
                maxLength={300}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('articleContent')} *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="wow-input w-full min-h-[300px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('coverImage')}
              </label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="wow-input w-full"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags (kommagetrennt)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="wow-input w-full"
                placeholder="update, release, community"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="published" className="text-sm text-slate-300">
                {t('published')}
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="wow-button flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  t('saveArticle')
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="wow-button-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length === 0 ? (
          <div className="wow-card p-12 text-center">
            <Newspaper className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              Noch keine News-Artikel vorhanden.
            </p>
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="wow-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-100">{article.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        article.published
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-slate-700 text-slate-400 border border-slate-600'
                      }`}
                    >
                      {article.published ? t('published') : t('draft')}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>von {article.author}</span>
                    <span>{formatDate(article.createdAt)}</span>
                    {article.tags && article.tags.length > 0 && (
                      <span>Tags: {article.tags.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(article)}
                    className="p-2 hover:bg-slate-800 rounded transition-colors"
                    title={article.published ? 'Verstecken' : 'Veröffentlichen'}
                  >
                    {article.published ? (
                      <Eye className="h-5 w-5 text-green-400" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="p-2 hover:bg-slate-800 rounded transition-colors"
                    title="Bearbeiten"
                  >
                    <Edit className="h-5 w-5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 hover:bg-slate-800 rounded transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminNewsPage() {
  return (
    <AdminRoute>
      <AdminNewsContent />
    </AdminRoute>
  );
}

