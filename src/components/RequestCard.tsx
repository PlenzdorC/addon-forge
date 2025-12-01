'use client';

import { AddonRequest } from '@/types';
import { formatDate, getCategoryColor, getStatusColor, getStatusLabel, getCategoryLabel } from '@/lib/utils';
import { ArrowBigUp, MessageCircle, User, Calendar, Github, Download } from 'lucide-react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useState } from 'react';

interface RequestCardProps {
  request: AddonRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  const [user] = useAuthState(auth);
  const [upvotes, setUpvotes] = useState(request.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(
    user ? request.upvotedBy?.includes(user.uid) : false
  );
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || isUpvoting) return;

    setIsUpvoting(true);
    const requestRef = doc(db, 'requests', request.id);

    try {
      if (hasUpvoted) {
        await updateDoc(requestRef, {
          upvotes: upvotes - 1,
          upvotedBy: arrayRemove(user.uid),
        });
        setUpvotes(upvotes - 1);
        setHasUpvoted(false);
      } else {
        await updateDoc(requestRef, {
          upvotes: upvotes + 1,
          upvotedBy: arrayUnion(user.uid),
        });
        setUpvotes(upvotes + 1);
        setHasUpvoted(true);
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <Link href={`/request/${request.id}`}>
      <div className="wow-card p-6 hover:border-amber-500/50 transition-all duration-200 cursor-pointer group animate-fade-in">
        <div className="flex gap-4">
          {/* Upvote Section */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleUpvote}
              disabled={!user || isUpvoting}
              className={`p-2 rounded-lg transition-all ${
                hasUpvoted
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={user ? (hasUpvoted ? 'Upvote entfernen' : 'Upvoten') : 'Anmelden zum Upvoten'}
            >
              <ArrowBigUp className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-300">{upvotes}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                {request.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`status-badge ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 mb-4 line-clamp-2">
              {request.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
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

              {request.comments && request.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{request.comments.length}</span>
                </div>
              )}

              {request.githubRepo && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </div>
              )}

              {request.downloadUrl && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {request.tags && request.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
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
          </div>
        </div>
      </div>
    </Link>
  );
}

