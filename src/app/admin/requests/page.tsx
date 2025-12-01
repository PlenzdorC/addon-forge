'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddonRequest, RequestStatus } from '@/types';
import AdminRoute from '@/components/AdminRoute';
import { formatDate, getCategoryColor, getStatusColor, getStatusLabel, getCategoryLabel } from '@/lib/utils';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AdminRequests() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') as RequestStatus | null;

  const [requests, setRequests] = useState<AddonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'all'>(
    statusFilter || 'all'
  );
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');

  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
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

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      if (sortBy === 'oldest') return a.createdAt.seconds - b.createdAt.seconds;
      return b.createdAt.seconds - a.createdAt.seconds;
    });

  const statuses: (RequestStatus | 'all')[] = ['all', 'requested', 'in-progress', 'completed', 'rejected'];

  return (
    <AdminRoute>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Anfragen verwalten</h1>
          <p className="text-slate-400">
            Alle AddOn-Anfragen bearbeiten und Status ändern
          </p>
        </div>

        {/* Filters */}
        <div className="wow-card p-6 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Anfragen durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wow-input w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedStatus === status
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {status === 'all' ? 'Alle' : getStatusLabel(status)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="wow-input"
            >
              <option value="recent">Neueste zuerst</option>
              <option value="popular">Beliebteste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-slate-400">
            {filteredRequests.length} {filteredRequests.length === 1 ? 'Anfrage' : 'Anfragen'} gefunden
          </p>
        </div>

        {/* Requests Table */}
        <div className="wow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Titel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Upvotes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Erstellt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-semibold text-slate-200 truncate">
                          {request.title}
                        </p>
                        <p className="text-sm text-slate-400 truncate">
                          {request.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`category-badge ${getCategoryColor(request.category)}`}>
                        {getCategoryLabel(request.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-semibold">
                        {request.upvotes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="text-amber-400 hover:text-amber-300 font-semibold text-sm"
                      >
                        Bearbeiten →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-400">Keine Anfragen gefunden.</p>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}

