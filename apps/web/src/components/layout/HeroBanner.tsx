'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { Role, PORTAL_SUBTITLE_MAP } from '@koraylo/shared';

interface HeroBannerProps {
  name?: string;
  role?: Role;
  customGreeting?: string;
  customSubtitle?: string;
  quote?: string;
}

export function HeroBanner({
  name = 'Student',
  role = Role.STUDENT,
  customGreeting,
  customSubtitle,
  quote,
}: HeroBannerProps) {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDateTime(new Date());
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    if (customGreeting) return customGreeting;
    const hour = (currentDateTime || new Date()).getHours();
    if (hour < 12) return `Good Morning, ${name}!`;
    if (hour < 17) return `Good Afternoon, ${name}!`;
    return `Good Evening, ${name}!`;
  };

  const subtitle =
    customSubtitle ||
    (role && PORTAL_SUBTITLE_MAP[role]) ||
    'Welcome back to your campus workspace.';

  const formattedDate = currentDateTime
    ? currentDateTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Today';

  const formattedTime = currentDateTime
    ? currentDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#143527] p-6 sm:p-8 text-white shadow-lg border border-[#40916c]/30 mb-6">
      {/* Background visual flourishes */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left greeting and motivation */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Academic Session 2026-27</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {getGreeting()}
          </h1>

          <p className="text-emerald-100/90 text-sm font-medium">
            {subtitle}
          </p>

          {quote && (
            <p className="text-xs text-emerald-200/70 italic pt-1 border-t border-emerald-500/20 max-w-lg">
              &ldquo;{quote}&rdquo;
            </p>
          )}
        </div>

        {/* Right date & live clock card */}
        <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 bg-black/20 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/10 text-right">
          <div className="flex items-center gap-2 text-xs text-emerald-200 font-medium">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-lg font-bold tracking-wider text-white">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formattedTime || '--:--:--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
