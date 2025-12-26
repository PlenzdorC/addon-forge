'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { AddonCategory, Priority, AddonRequest } from '@/types';
import { Loader2, Save, AlertCircle, Upload, X } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function EditRequest() {
  const t = useTranslations('edit');
  const tCreate = useTranslations('create');
  const tCategories = useTranslations('categories');
  const tPriority = useTranslations('priority');
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const [user, loading] = useAuthState(auth);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchingRequest, setFetchingRequest] = useState(true);
  const [request, setRequest] = useState<AddonRequest | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'UI' as AddonCategory,
    priority: 'medium' as Priority,
    tags: '',
  });

  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
  const [screenshotsToDelete, setScreenshotsToDelete] = useState<string[]>([]);
  const [newScreenshots, setNewScreenshots] = useState<File[]>([]);
  const [newScreenshotPreviews, setNewScreenshotPreviews] = useState<string[]>([]);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;

      try {
        const docRef = doc(db, 'requests', requestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const requestData = { id: docSnap.id, ...docSnap.data() } as AddonRequest;
          setRequest(requestData);

          // Check if user is the owner
          if (user && requestData.userId !== user.uid) {
            setError(t('errors.notOwner'));
            return;
          }

          // Set form data
          setFormData({
            title: requestData.title,
            description: requestData.description,
            category: requestData.category,
            priority: requestData.priority,
            tags: requestData.tags?.join(', ') || '',
          });

          setExistingScreenshots(requestData.screenshots || []);
        } else {
          setError(t('errors.notFound'));
        }
      } catch (err) {
        console.error('Error fetching request:', err);
        setError(t('errors.notFound'));
      } finally {
        setFetchingRequest(false);
      }
    };

    if (!loading && user) {
      fetchRequest();
    }
  }, [requestId, user, loading, t]);

  const handleNewScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const totalScreenshots = existingScreenshots.length - screenshotsToDelete.length + newScreenshots.length + files.length;
    
    if (totalScreenshots > 5) {
      setError(tCreate('errors.maxScreenshots'));
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnder5MB = file.size <= 5 * 1024 * 1024;
      
      if (!isImage) {
        setError(tCreate('errors.notImage', {name: file.name}));
        return false;
      }
      if (!isUnder5MB) {
        setError(tCreate('errors.fileTooLarge', {name: file.name}));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setNewScreenshots([...newScreenshots, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewScreenshotPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removeNewScreenshot = (index: number) => {
    setNewScreenshots(newScreenshots.filter((_, i) => i !== index));
    setNewScreenshotPreviews(newScreenshotPreviews.filter((_, i) => i !== index));
  };

  const markExistingScreenshotForDeletion = (url: string) => {
    setScreenshotsToDelete([...screenshotsToDelete, url]);
  };

  const unmarkExistingScreenshotForDeletion = (url: string) => {
    setScreenshotsToDelete(screenshotsToDelete.filter(u => u !== url));
  };

  const uploadNewScreenshots = async (): Promise<string[]> => {
    if (newScreenshots.length === 0) return [];

    const uploadPromises = newScreenshots.map(async (file, index) => {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${requestId}_${Date.now()}_${index}.${fileExtension}`;
      const storageRef = ref(storage, `screenshots/${requestId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });

    return await Promise.all(uploadPromises);
  };

  const deleteScreenshotsFromStorage = async () => {
    if (screenshotsToDelete.length === 0) return;

    const deletePromises = screenshotsToDelete.map(async (url) => {
      try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      } catch (err) {
        console.error('Error deleting screenshot:', err);
        // Continue even if delete fails
      }
    });

    await Promise.all(deletePromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user || !request) {
      setError(tCreate('errors.loginRequired'));
      return;
    }

    if (request.userId !== user.uid) {
      setError(t('errors.notOwner'));
      return;
    }

    if (formData.title.trim().length < 5) {
      setError(tCreate('errors.titleTooShort'));
      return;
    }

    if (formData.description.trim().length < 20) {
      setError(tCreate('errors.descriptionTooShort'));
      return;
    }

    setSubmitting(true);
    setUploadingScreenshots(newScreenshots.length > 0 || screenshotsToDelete.length > 0);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Upload new screenshots
      let newScreenshotURLs: string[] = [];
      if (newScreenshots.length > 0) {
        newScreenshotURLs = await uploadNewScreenshots();
      }

      // Delete marked screenshots
      if (screenshotsToDelete.length > 0) {
        await deleteScreenshotsFromStorage();
      }

      // Calculate final screenshot list
      const finalScreenshots = [
        ...existingScreenshots.filter(url => !screenshotsToDelete.includes(url)),
        ...newScreenshotURLs,
      ];

      const updateData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        updatedAt: serverTimestamp(),
        screenshots: finalScreenshots,
      };

      if (tagsArray.length > 0) {
        updateData.tags = tagsArray;
      } else {
        updateData.tags = [];
      }

      const docRef = doc(db, 'requests', requestId);
      await updateDoc(docRef, updateData);

      // Redirect to the request detail page
      router.push(`/request/${requestId}`);
    } catch (err) {
      console.error('Error updating request:', err);
      setError(t('errors.updateError'));
      setSubmitting(false);
      setUploadingScreenshots(false);
    }
  };

  if (loading || fetchingRequest) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="wow-card p-12 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">{tCreate('loginRequired')}</h2>
          <p className="text-slate-400 mb-6">
            {tCreate('loginRequiredText')}
          </p>
          <Link href="/login" className="wow-button inline-block">
            {tCreate('loginNow')}
          </Link>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="wow-card p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">{t('errors.notFound')}</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link href="/" className="wow-button inline-block">
            {tCreate('cancel')}
          </Link>
        </div>
      </div>
    );
  }

  const categories: AddonCategory[] = ['UI', 'Combat', 'Utility', 'Social', 'Profession', 'Other'];
  const priorities: Priority[] = ['low', 'medium', 'high'];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">{t('title')}</h1>
        <p className="text-slate-400">
          {t('subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="wow-card p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            {tCreate('titleLabel')} <span className="text-red-400">{tCreate('required')}</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={tCreate('titlePlaceholder')}
            className="wow-input w-full"
            required
            maxLength={100}
          />
          <p className="text-xs text-slate-500 mt-1">{tCreate('titleChars', {count: formData.title.length})}</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            {tCreate('descriptionLabel')} <span className="text-red-400">{tCreate('required')}</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={tCreate('descriptionPlaceholder')}
            className="wow-input w-full min-h-[200px] resize-y"
            required
            maxLength={2000}
          />
          <p className="text-xs text-slate-500 mt-1">{tCreate('descriptionChars', {count: formData.description.length})}</p>
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
              {tCreate('categoryLabel')} <span className="text-red-400">{tCreate('required')}</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as AddonCategory })}
              className="wow-input w-full"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {tCategories(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2">
              {tCreate('priorityLabel')}
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="wow-input w-full"
            >
              <option value="low">{tPriority('low')}</option>
              <option value="medium">{tPriority('medium')}</option>
              <option value="high">{tPriority('high')}</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-2">
            {tCreate('tagsLabel')}
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder={tCreate('tagsPlaceholder')}
            className="wow-input w-full"
          />
          <p className="text-xs text-slate-500 mt-1">
            {tCreate('tagsHint')}
          </p>
        </div>

        {/* Screenshots */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {tCreate('screenshotsLabel')}
          </label>
          <div className="space-y-4">
            {/* Existing Screenshots */}
            {existingScreenshots.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3">{t('existingScreenshots')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingScreenshots.map((url, index) => {
                    const isMarkedForDeletion = screenshotsToDelete.includes(url);
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Screenshot ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-lg border border-slate-700 ${
                            isMarkedForDeletion ? 'opacity-40 grayscale' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => 
                            isMarkedForDeletion 
                              ? unmarkExistingScreenshotForDeletion(url)
                              : markExistingScreenshotForDeletion(url)
                          }
                          className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                            isMarkedForDeletion 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                          disabled={submitting}
                          title={isMarkedForDeletion ? 'Behalten' : t('deleteScreenshot')}
                        >
                          {isMarkedForDeletion ? (
                            <span className="text-white text-xs px-2">↶</span>
                          ) : (
                            <X className="h-4 w-4 text-white" />
                          )}
                        </button>
                        {isMarkedForDeletion && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded">
                              {t('deleteScreenshot')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload new screenshots */}
            {(existingScreenshots.length - screenshotsToDelete.length + newScreenshots.length) < 5 && (
              <div>
                <label
                  htmlFor="screenshot-upload"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-600 hover:border-amber-500"
                >
                  <Upload className="h-5 w-5" />
                  <span>{tCreate('screenshotsUpload')}</span>
                </label>
                <input
                  type="file"
                  id="screenshot-upload"
                  accept="image/*"
                  multiple
                  onChange={handleNewScreenshotChange}
                  className="hidden"
                  disabled={submitting}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {tCreate('screenshotsHint')}
                </p>
              </div>
            )}

            {/* New Screenshot Previews */}
            {newScreenshotPreviews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3">Neue Screenshots</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newScreenshotPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewScreenshot(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={submitting}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 rounded text-xs text-slate-300">
                        {newScreenshots[index].name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadingScreenshots && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{tCreate('screenshotsUploading')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="wow-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {t('submit')}
              </>
            )}
          </button>
          <Link href={`/request/${requestId}`} className="wow-button-secondary">
            {tCreate('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}

