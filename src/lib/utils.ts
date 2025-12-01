import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: any): string {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'gerade eben';
  if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Minuten`;
  if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Stunden`;
  if (diffInSeconds < 604800) return `vor ${Math.floor(diffInSeconds / 86400)} Tagen`;
  
  return date.toLocaleDateString('de-DE', {
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
  };
  return colors[status] || colors['requested'];
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'requested': 'Angefragt',
    'in-progress': 'In Bearbeitung',
    'completed': 'Fertiggestellt',
    'rejected': 'Abgelehnt',
  };
  return labels[status] || status;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'UI': 'Benutzeroberfläche',
    'Combat': 'Kampf',
    'Utility': 'Nützliches',
    'Social': 'Sozial',
    'Profession': 'Berufe',
    'Other': 'Sonstiges',
  };
  return labels[category] || category;
}

