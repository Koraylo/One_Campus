import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  href?: string;
  subtext?: string;
  color?: 'green' | 'blue' | 'amber' | 'purple' | 'red';
  className?: string;
}

const COLOR_MAP = {
  green: {
    border: 'border-l-campus-green-600',
    iconBg: 'bg-emerald-50 text-emerald-700',
    hover: 'group-hover:text-emerald-700',
  },
  blue: {
    border: 'border-l-blue-600',
    iconBg: 'bg-blue-50 text-blue-700',
    hover: 'group-hover:text-blue-700',
  },
  amber: {
    border: 'border-l-amber-500',
    iconBg: 'bg-amber-50 text-amber-700',
    hover: 'group-hover:text-amber-700',
  },
  purple: {
    border: 'border-l-purple-600',
    iconBg: 'bg-purple-50 text-purple-700',
    hover: 'group-hover:text-purple-700',
  },
  red: {
    border: 'border-l-red-600',
    iconBg: 'bg-red-50 text-red-700',
    hover: 'group-hover:text-red-700',
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  subtext,
  color = 'green',
  className,
}: StatCardProps) {
  const scheme = COLOR_MAP[color] || COLOR_MAP.green;

  const content = (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-l-4 bg-white',
        scheme.border,
        className
      )}
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {value}
            </span>
            {subtext && (
              <span className="text-xs text-muted-foreground font-medium">
                {subtext}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
              scheme.iconBg
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          {href && (
            <ChevronRight
              className={cn(
                'w-4 h-4 text-gray-300 transition-all duration-200 group-hover:translate-x-1',
                scheme.hover
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
