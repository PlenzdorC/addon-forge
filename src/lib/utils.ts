import { type ClassValue, clsx } from "clsx";
import { log } from "console";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: any, locale: string = 'de'): string {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return locale === 'de' ? 'gerade eben' : 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return locale === 'de' ? `vor ${minutes} Minuten` : `${minutes} minutes ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return locale === 'de' ? `vor ${hours} Stunden` : `${hours} hours ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return locale === 'de' ? `vor ${days} Tagen` : `${days} days ago`;
  }
  
  return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'UI': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Combat': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Utility': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Social': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Profession': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[category] || colors['Other'];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'requested': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    'in-progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'rejected': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'analyzing': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  };
  return colors[status] || colors['requested'];
}

// These functions are kept for backwards compatibility
// New code should use useTranslations('status') and useTranslations('categories')
export function getStatusLabel(status: string, locale: string ='de'): string {
  console.log(locale);
  const labelsDE: Record<string, string> = {
    'requested': 'Angefragt',
    'in-progress': 'In Bearbeitung',
    'completed': 'Fertiggestellt',
    'rejected': 'Abgelehnt',
    'analyzing': 'In Analyse',
  };
  const labelsEN: Record<string, string> = {
    'requested': 'Requested',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'rejected': 'Rejected',
    'analyzing': 'Analyzing',
  };
  const labels = locale === 'de' ? labelsDE : labelsEN;
  return labels[status] || status;
}

export function getCategoryLabel(category: string, locale: string = 'de'): string {
  const labelsDE: Record<string, string> = {
    'UI': 'Benutzeroberfläche',
    'Combat': 'Kampf',
    'Utility': 'Nützliches',
    'Social': 'Sozial',
    'Profession': 'Berufe',
    'Other': 'Sonstiges',
  };
  const labelsEN: Record<string, string> = {
    'UI': 'User Interface',
    'Combat': 'Combat',
    'Utility': 'Utility',
    'Social': 'Social',
    'Profession': 'Professions',
    'Other': 'Other',
  };
  const labels = locale === 'de' ? labelsDE : labelsEN;
  return labels[category] || category;
}

