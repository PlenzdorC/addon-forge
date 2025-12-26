'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddonRequest, AddonCategory, RequestStatus } from '@/types';
import RequestCard from '@/components/RequestCard';
import FilterBar from '@/components/FilterBar';
import { Loader2, Sparkles } from 'lucide-react';
import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const [requests, setRequests] = useState<AddonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AddonCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');

  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const requestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AddonRequest[];
        setRequests(requestsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter and sort requests
  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.upvotes - a.upvotes;
      } else if (sortBy === 'oldest') {
        return a.createdAt.seconds - b.createdAt.seconds;
      }
      return b.createdAt.seconds - a.createdAt.seconds;
    });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-amber-400 mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-xl text-slate-300 mb-6">
          {t('subtitle')}
        </p>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          {t('description')}
        </p>
        <Link href="/create" className="wow-button inline-block">
          {t('createButton')}
        </Link>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-slate-400">
          {t('requestsFound', {count: filteredRequests.length})}
        </p>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="wow-card p-12 text-center">
          <p className="text-slate-400 text-lg mb-4">
            {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? t('noRequestsFiltered')
              : t('noRequests')}
          </p>
          <Link href="/create" className="wow-button inline-block">
            {t('createFirst')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
