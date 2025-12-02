'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { AddonRequest, RequestStatus, Priority } from '@/types';
import AdminRoute from '@/components/AdminRoute';
import StatusSelector from '@/components/admin/StatusSelector';
import {
  formatDate,
  getCategoryColor,
  getCategoryLabel,
} from '@/lib/utils';
import {
  Save,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Github,
  Download,
  ExternalLink,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function EditRequest() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<AddonRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    status: 'requested' as RequestStatus,
    priority: 'medium' as Priority,
    githubRepo: '',
    downloadUrl: '',
  });

  const [deletingScreenshot, setDeletingScreenshot] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const docRef = doc(db, 'requests', requestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as AddonRequest;
          setRequest(data);
          setFormData({
            status: data.status,
            priority: data.priority,
            githubRepo: data.githubRepo || '',
            downloadUrl: data.downloadUrl || '',
          });
        } else {
          setError('Anfrage nicht gefunden');
        }
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('Fehler beim Laden der Anfrage');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: formData.status,
        priority: formData.priority,
        githubRepo: formData.githubRepo || null,
        downloadUrl: formData.downloadUrl || null,
        updatedAt: serverTimestamp(),
      });

      setSuccess('Änderungen erfolgreich gespeichert!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Fehler beim Speichern der Änderungen');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteScreenshot = async (screenshotUrl: string, index: number) => {
    if (!confirm('Möchtest du diesen Screenshot wirklich löschen?')) {
      return;
    }

    setDeletingScreenshot(index);
    setError('');

    try {
      // Extract file path from URL
      const url = new URL(screenshotUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const fileRef = ref(storage, filePath);
        
        // Delete from Storage
        await deleteObject(fileRef);
      }

      // Update Firestore - remove screenshot URL
      const updatedScreenshots = request!.screenshots!.filter((_, i) => i !== index);
      const requestRef = doc(db, 'requests', requestId);
      
      await updateDoc(requestRef, {
        screenshots: updatedScreenshots.length > 0 ? updatedScreenshots : null,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setRequest({
        ...request!,
        screenshots: updatedScreenshots.length > 0 ? updatedScreenshots : undefined,
      });

      setSuccess('Screenshot erfolgreich gelöscht!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting screenshot:', err);
      setError('Fehler beim Löschen des Screenshots');
    } finally {
      setDeletingScreenshot(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Möchtest du diese Anfrage wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      // Delete all screenshots from Storage first
      if (request?.screenshots && request.screenshots.length > 0) {
        const deletePromises = request.screenshots.map(async (screenshotUrl) => {
          try {
            const url = new URL(screenshotUrl);
            const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
            
            if (pathMatch) {
              const filePath = decodeURIComponent(pathMatch[1]);
              const fileRef = ref(storage, filePath);
              await deleteObject(fileRef);
            }
          } catch (err) {
            console.error('Error deleting screenshot:', err);
            // Continue anyway
          }
        });

        await Promise.all(deletePromises);
      }

      // Delete Firestore document
      await deleteDoc(doc(db, 'requests', requestId));
      router.push('/admin/requests');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Fehler beim Löschen der Anfrage');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      </AdminRoute>
    );
  }

  if (!request) {
    return (
      <AdminRoute>
        <div className="max-w-2xl mx-auto">
          <div className="wow-card p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-4">
              Anfrage nicht gefunden
            </h2>
            <Link href="/admin/requests" className="wow-button inline-block">
              Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Übersicht
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Anfrage bearbeiten</h1>
          <p className="text-slate-400">
            Ändere den Status und füge Links hinzu
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Request Info */}
        <div className="wow-card p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">{request.title}</h2>
          <p className="text-slate-300 mb-4 whitespace-pre-wrap">{request.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span className={`category-badge ${getCategoryColor(request.category)}`}>
              {getCategoryLabel(request.category)}
            </span>
            <span>Von: {request.userName}</span>
            <span>Erstellt: {formatDate(request.createdAt)}</span>
            <span className="text-amber-400 font-semibold">{request.upvotes} Upvotes</span>
            <span>{request.comments?.length || 0} Kommentare</span>
          </div>

          {request.tags && request.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {request.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700">
            <Link
              href={`/request/${request.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300"
            >
              <ExternalLink className="h-4 w-4" />
              Öffentliche Ansicht
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <div className="wow-card p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-100 mb-6">Anfrage bearbeiten</h3>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Status
            </label>
            <StatusSelector
              currentStatus={formData.status}
              onChange={(status) => setFormData({ ...formData, status })}
              disabled={saving}
            />
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2">
              Priorität
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as Priority })
              }
              className="wow-input w-full"
              disabled={saving}
            >
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>

          {/* GitHub Repo */}
          <div className="mb-6">
            <label htmlFor="githubRepo" className="block text-sm font-medium text-slate-300 mb-2">
              <Github className="inline h-4 w-4 mr-1" />
              GitHub Repository URL (optional)
            </label>
            <input
              type="url"
              id="githubRepo"
              value={formData.githubRepo}
              onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="wow-input w-full"
              disabled={saving}
            />
          </div>

          {/* Download URL */}
          <div className="mb-6">
            <label htmlFor="downloadUrl" className="block text-sm font-medium text-slate-300 mb-2">
              <Download className="inline h-4 w-4 mr-1" />
              Download URL (optional)
            </label>
            <input
              type="url"
              id="downloadUrl"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              placeholder="https://example.com/addon.zip"
              className="wow-input w-full"
              disabled={saving}
            />
            <p className="text-xs text-slate-500 mt-1">
              Link zum fertigen AddOn (z.B. CurseForge, GitHub Release)
            </p>
          </div>

          {/* Screenshots Management */}
          {request.screenshots && request.screenshots.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <ImageIcon className="inline h-4 w-4 mr-1" />
                Screenshots ({request.screenshots.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {request.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteScreenshot(screenshot, index)}
                      disabled={deletingScreenshot === index}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Screenshot löschen"
                    >
                      {deletingScreenshot === index ? (
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      ) : (
                        <X className="h-4 w-4 text-white" />
                      )}
                    </button>
                    <a
                      href={screenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 rounded text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      Vergrößern
                    </a>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Klicke auf das X um einen Screenshot zu löschen
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="wow-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Änderungen speichern
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting || saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Wird gelöscht...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  Anfrage löschen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}

