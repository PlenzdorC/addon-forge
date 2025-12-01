'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
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
} from 'lucide-react';
import Link from 'next/link';

export default function RequestDetail() {
  const params = useParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [request, setRequest] = useState<AddonRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  const requestId = params.id as string;

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const docRef = doc(db, 'requests', requestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRequest({ id: docSnap.id, ...docSnap.data() } as AddonRequest);
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

      const newComment: Comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: userName,
        userAvatar: user.photoURL || undefined,
        text: commentText.trim(),
        createdAt: serverTimestamp() as any,
        isAdmin: isAdmin,
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
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Übersicht
      </Link>

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
              title={user ? (hasUpvoted ? 'Upvote entfernen' : 'Upvoten') : 'Anmelden zum Upvoten'}
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
                {getStatusLabel(request.status)}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className={`category-badge ${getCategoryColor(request.category)}`}>
                {getCategoryLabel(request.category)}
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
          Kommentare ({request.comments?.length || 0})
        </h2>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Schreibe einen Kommentar..."
              className="wow-input w-full min-h-[100px] resize-y mb-4"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">{commentText.length}/1000 Zeichen</p>
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="wow-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kommentar senden
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8 text-center">
            <p className="text-slate-400 mb-4">
              Du musst angemeldet sein, um Kommentare zu schreiben.
            </p>
            <Link href="/login" className="wow-button inline-block">
              Jetzt anmelden
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {request.comments && request.comments.length > 0 ? (
            request.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
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
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">
              Noch keine Kommentare. Sei der Erste!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

