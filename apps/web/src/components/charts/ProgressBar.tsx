import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  label?: string;
  current: number;
  total: number;
  color?: string;
  className?: string;
  showNumbers?: boolean;
}

export function ProgressBar({
  label,
  current,
  total,
  color = 'bg-campus-green-600',
  className,
  showNumbers = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      <div className="flex justify-between items-center text-xs">
        {label && <span className="font-medium text-gray-700 truncate">{label}</span>}
        {showNumbers && (
          <span className="text-gray-500 font-medium shrink-0 ml-2">
            {current} / {total} ({percentage}%)
          </span>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={cn('h-2.5 rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
