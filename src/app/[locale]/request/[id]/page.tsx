'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AddonRequest, Comment } from '@/types';
import {
  formatDate,
  getCategoryColor,
  getStatusColor,
  getStatusLabel,
  getCategoryLabel,
} from '@/lib/utils';
import {
  ArrowBigUp,
  Calendar,
  User,
  MessageCircle,
  Github,
  Download,
  Loader2,
  Send,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Reply,
  CornerDownRight,
} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';

export default function RequestDetail() {
  const t = useTranslations('request');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [request, setRequest] = useState<AddonRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);

  const requestId = params.id as string;

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const docRef = doc(db, 'requests', requestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const requestData = { id: docSnap.id, ...docSnap.data() } as AddonRequest;
          setRequest(requestData);
          
          // Update document title and meta tags dynamically
          if (typeof window !== 'undefined') {
            document.title = `${requestData.title} | AddOnForge`;
            
            // Update meta description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
              metaDescription = document.createElement('meta');
              metaDescription.setAttribute('name', 'description');
              document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', requestData.description.substring(0, 160));
            
            // Update Open Graph tags
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
              ogTitle = document.createElement('meta');
              ogTitle.setAttribute('property', 'og:title');
              document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute('content', requestData.title);
            
            let ogDescription = document.querySelector('meta[property="og:description"]');
            if (!ogDescription) {
              ogDescription = document.createElement('meta');
              ogDescription.setAttribute('property', 'og:description');
              document.head.appendChild(ogDescription);
            }
            ogDescription.setAttribute('content', requestData.description.substring(0, 160));
            
            if (requestData.screenshots && requestData.screenshots[0]) {
              let ogImage = document.querySelector('meta[property="og:image"]');
              if (!ogImage) {
                ogImage = document.createElement('meta');
                ogImage.setAttribute('property', 'og:image');
                document.head.appendChild(ogImage);
              }
              ogImage.setAttribute('content', requestData.screenshots[0]);
            }
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, router]);

  const handleUpvote = async () => {
    if (!user || !request || upvoting) return;

    setUpvoting(true);
    const requestRef = doc(db, 'requests', request.id);
    const hasUpvoted = request.upvotedBy?.includes(user.uid);

    try {
      if (hasUpvoted) {
        await updateDoc(requestRef, {
          upvotes: request.upvotes - 1,
          upvotedBy: arrayRemove(user.uid),
        });
        setRequest({
          ...request,
          upvotes: request.upvotes - 1,
          upvotedBy: request.upvotedBy.filter((id) => id !== user.uid),
        });
      } else {
        await updateDoc(requestRef, {
          upvotes: request.upvotes + 1,
          upvotedBy: arrayUnion(user.uid),
        });
        setRequest({
          ...request,
          upvotes: request.upvotes + 1,
          upvotedBy: [...(request.upvotedBy || []), user.uid],
        });
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setUpvoting(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !request || !commentText.trim() || submittingComment) return;

    setSubmittingComment(true);

    try {
      // Get user's display name and admin status from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userName = userDocSnap.exists() 
        ? userDocSnap.data()?.displayName || user.displayName || 'Anonymous'
        : user.displayName || 'Anonymous';
      const isAdmin = userDocSnap.exists() ? userDocSnap.data()?.isAdmin === true : false;

      const now = Timestamp.now();
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: userName,
        ...(user.photoURL && { userAvatar: user.photoURL }),
        text: commentText.trim(),
        createdAt: now,
        isAdmin: isAdmin,
        ...(replyingTo && { 
          replyTo: replyingTo.id,
          replyToUserName: replyingTo.userName
        }),
      };

      const requestRef = doc(db, 'requests', request.id);
      await updateDoc(requestRef, {
        comments: arrayUnion(newComment),
        updatedAt: serverTimestamp(),
      });

      setRequest({
        ...request,
        comments: [...(request.comments || []), newComment],
      });
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && request?.screenshots) {
      setLightboxIndex((lightboxIndex + 1) % request.screenshots.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && request?.screenshots) {
      setLightboxIndex(
        (lightboxIndex - 1 + request.screenshots.length) % request.screenshots.length
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, request?.screenshots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!request) {
    return null;
  }

  const hasUpvoted = user ? request.upvotedBy?.includes(user.uid) : false;
  const isOwner = user ? request.userId === user.uid : false;

  // Structured Data for SEO
  const structuredData = request ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": request.title,
    "description": request.description,
    "applicationCategory": "Game Addon",
    "operatingSystem": "Windows, macOS",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": request.upvotes,
      "reviewCount": request.comments?.length || 0
    },
    "datePublished": new Date(request.createdAt.seconds * 1000).toISOString(),
    ...(request.updatedAt && {
      "dateModified": new Date(request.updatedAt.seconds * 1000).toISOString()
    }),
    ...(request.githubRepo && {
      "codeRepository": request.githubRepo
    }),
    ...(request.downloadUrl && {
      "downloadUrl": request.downloadUrl
    }),
    ...(request.screenshots && request.screenshots.length > 0 && {
      "screenshot": request.screenshots[0]
    })
  } : null;

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && request?.screenshots && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors z-10"
            >
              <X className="h-6 w-6 text-white" />
            </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 px-4 py-2 bg-slate-800/80 rounded-lg text-white font-semibold z-10">
            {lightboxIndex + 1} / {request.screenshots.length}
          </div>

          {/* Previous button */}
          {request.screenshots.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors z-10"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] mx-auto px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={request.screenshots[lightboxIndex]}
              alt={`Screenshot ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Next button */}
          {request.screenshots.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors z-10"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>
          )}

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-800/80 rounded-lg text-slate-300 text-sm">
            <span className="hidden md:inline">
              {locale === 'de' ? 'Nutze ← → für Navigation | ESC zum Schließen' : 'Use ← → for navigation | ESC to close'}
            </span>
            <span className="md:hidden">{locale === 'de' ? 'Tippe zum Schließen' : 'Tap to close'}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
      {/* Back Button and Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>
        {isOwner && (
          <Link
            href={`/edit/${requestId}`}
            className="wow-button-secondary flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {t('edit')}
          </Link>
        )}
      </div>

      {/* Main Card */}
      <div className="wow-card p-8 mb-6">
        <div className="flex gap-6">
          {/* Upvote Section */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleUpvote}
              disabled={!user || upvoting}
              className={`p-3 rounded-lg transition-all ${
                hasUpvoted
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={user ? (hasUpvoted ? t('upvoted') : t('upvote')) : t('loginToUpvote')}
            >
              <ArrowBigUp className="h-6 w-6" />
            </button>
            <span className="text-lg font-bold text-slate-300">{request.upvotes}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-slate-100">{request.title}</h1>
              <span className={`status-badge ${getStatusColor(request.status)}`}>
                {getStatusLabel(request.status, locale)}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className={`category-badge ${getCategoryColor(request.category)}`}>
                {getCategoryLabel(request.category, locale)}
              </span>

              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{request.userName}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(request.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-slate-300 whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Tags */}
            {request.tags && request.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {request.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-slate-800 text-slate-400 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Screenshots */}
            {request.screenshots && request.screenshots.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">{t('screenshots')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {request.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => openLightbox(index)}
                      className="group relative overflow-hidden rounded-lg border border-slate-700 hover:border-amber-500 transition-colors cursor-pointer"
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                          {locale === 'de' ? 'Vergrößern' : 'Enlarge'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(request.githubRepo || request.downloadUrl) && (
              <div className="flex gap-4 pt-6 border-t border-slate-700">
                {request.githubRepo && (
                  <a
                    href={request.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub Repository</span>
                  </a>
                )}
                {request.downloadUrl && (
                  <a
                    href={request.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download AddOn</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="wow-card p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-amber-500" />
          {t('comments')} ({request.comments?.length || 0})
        </h2>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            {replyingTo && (
              <div className="flex items-center gap-2 mb-3 text-sm text-slate-400 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <CornerDownRight className="h-4 w-4 text-amber-500" />
                <span>
                  {t('replyTo', { name: replyingTo.userName })}
                </span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyingTo ? t('replyTo', { name: replyingTo.userName }) : t('addComment')}
              className="wow-input w-full min-h-[100px] resize-y mb-4"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">{commentText.length}/1000 {locale === 'de' ? 'Zeichen' : 'characters'}</p>
              <div className="flex gap-2">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setCommentText('');
                    }}
                    className="wow-button-secondary flex items-center gap-2"
                  >
                    {t('cancelReply')}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="wow-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('posting')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('postComment')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8 text-center">
            <p className="text-slate-400 mb-4">
              {t('loginToComment')}
            </p>
            <Link href="/login" className="wow-button inline-block">
              {locale === 'de' ? 'Jetzt anmelden' : 'Login Now'}
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {request.comments && request.comments.length > 0 ? (
            (() => {
              // Separate comments into top-level and replies
              const topLevelComments = request.comments.filter(c => !c.replyTo);
              const replies = request.comments.filter(c => c.replyTo);
              
              return topLevelComments.map((comment) => {
                // Find all replies to this comment
                const commentReplies = replies.filter(r => r.replyTo === comment.id);
                
                return (
                  <div key={comment.id} className="space-y-4">
                    {/* Main Comment */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {comment.userAvatar ? (
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-200">{comment.userName}</span>
                          {comment.isAdmin && (
                            <span className="px-2 py-0.5 text-xs bg-amber-500 text-slate-900 rounded-full font-semibold">
                              Admin
                            </span>
                          )}
                          <span className="text-sm text-slate-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                        {user && (
                          <button
                            onClick={() => {
                              setReplyingTo({ id: comment.id, userName: comment.userName });
                              // Scroll to comment form
                              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="mt-2 text-sm text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                          >
                            <Reply className="h-3 w-3" />
                            {t('reply')}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Replies to this comment */}
                    {commentReplies.length > 0 && (
                      <div className="ml-14 space-y-4 border-l-2 border-slate-700 pl-4">
                        {commentReplies.map((reply) => (
                          <div key={reply.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              {reply.userAvatar ? (
                                <img
                                  src={reply.userAvatar}
                                  alt={reply.userName}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                                  <User className="h-4 w-4 text-slate-900" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-200">{reply.userName}</span>
                                {reply.isAdmin && (
                                  <span className="px-2 py-0.5 text-xs bg-amber-500 text-slate-900 rounded-full font-semibold">
                                    Admin
                                  </span>
                                )}
                                <CornerDownRight className="h-3 w-3 text-slate-600" />
                                <span className="text-xs text-slate-500">{reply.replyToUserName}</span>
                                <span className="text-sm text-slate-500">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-slate-300 whitespace-pre-wrap">{reply.text}</p>
                              {user && (
                                <button
                                  onClick={() => {
                                    setReplyingTo({ id: reply.id, userName: reply.userName });
                                    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }}
                                  className="mt-2 text-sm text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                                >
                                  <Reply className="h-3 w-3" />
                                  {t('reply')}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              });
            })()
          ) : (
            <p className="text-slate-500 text-center py-8">
              {t('noComments')}
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

