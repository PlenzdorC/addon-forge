'use client';

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddonRequest } from '@/types';
import AdminRoute from '@/components/AdminRoute';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<AddonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('create');

  useEffect(() => {
    const q = query(collection(db, 'requests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AddonRequest[];
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    total: requests.length,
    requested: requests.filter((r) => r.status === 'requested').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    analyzing: requests.filter((r) => r.status === 'analyzing').length,
    totalUpvotes: requests.reduce((sum, r) => sum + r.upvotes, 0),
    totalComments: requests.reduce((sum, r) => sum + (r.comments?.length || 0), 0),
  };

  const recentRequests = [...requests]
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    .slice(0, 5);

  const topRequests = [...requests]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  return (
    <AdminRoute>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-slate-100">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">
            Verwalte AddOn-Anfragen und überwache die Community-Aktivität
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="wow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-3xl font-bold text-slate-100">{stats.total}</span>
            </div>
            <p className="text-slate-400">Gesamt Anfragen</p>
          </div>

          <div className="wow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-yellow-400" />
              <span className="text-3xl font-bold text-slate-100">{stats.requested}</span>
            </div>
            <p className="text-slate-400">Warten auf Bearbeitung</p>
          </div>

          <div className="wow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <span className="text-3xl font-bold text-slate-100">{stats.completed}</span>
            </div>
            <p className="text-slate-400">Fertiggestellt</p>
          </div>

          <div className="wow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-amber-400" />
              <span className="text-3xl font-bold text-slate-100">{stats.totalUpvotes}</span>
            </div>
            <p className="text-slate-400">Gesamt Upvotes</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="wow-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Status Übersicht</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('status.requested')}</span>
                <span className="text-slate-200 font-semibold">{stats.requested}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('status.in-progress')}</span>
                <span className="text-amber-400 font-semibold">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('status.completed')}</span>
                <span className="text-green-400 font-semibold">{stats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('status.rejected')}</span>
                <span className="text-red-400 font-semibold">{stats.rejected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('status.analyzing')}</span>
                <span className="text-sky-400 font-semibold">{stats.analyzing}</span>
              </div>
            </div>
          </div>

          <div className="wow-card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Schnellzugriff</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/requests"
                className="wow-button-secondary text-center"
              >
                Alle Anfragen
              </Link>
              <Link
                href="/admin/requests?status=requested"
                className="wow-button-secondary text-center"
              >
                Neue Anfragen
              </Link>
              <Link
                href="/admin/requests?status=in-progress"
                className="wow-button-secondary text-center"
              >
                In Bearbeitung
              </Link>
              <Link
                href="/admin/requests?status=analyzing"
                className="wow-button-secondary text-center"
              >
                Wird analysiert
              </Link>
              <Link
                href="/"
                className="wow-button-secondary text-center"
              >
                Zur Hauptseite
              </Link>
            </div>
          </div>
        </div>

        {/* Recent & Top Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="wow-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Neueste Anfragen
            </h3>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/admin/requests/${request.id}`}
                  className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-200 line-clamp-1">
                      {request.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                      {request.upvotes} ↑
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {request.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Requests */}
          <div className="wow-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Beliebteste Anfragen
            </h3>
            <div className="space-y-3">
              {topRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/admin/requests/${request.id}`}
                  className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-200 line-clamp-1">
                      {request.title}
                    </h4>
                    <span className="text-amber-400 font-semibold whitespace-nowrap ml-2">
                      {request.upvotes} ↑
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {request.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}

