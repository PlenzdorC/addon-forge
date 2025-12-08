'use client';

import { RequestStatus } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

interface StatusSelectorProps {
  currentStatus: RequestStatus;
  onChange: (status: RequestStatus) => void;
  disabled?: boolean;
}

export default function StatusSelector({
  currentStatus,
  onChange,
  disabled = false,
}: StatusSelectorProps) {
  const statuses: RequestStatus[] = ['requested', 'in-progress', 'completed', 'rejected', 'analyzing'];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            currentStatus === status
              ? 'bg-amber-500 text-slate-900'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {getStatusLabel(status)}
        </button>
      ))}
    </div>
  );
}

