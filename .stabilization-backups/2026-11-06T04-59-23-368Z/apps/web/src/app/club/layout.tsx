'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/hooks/useAuth';
import { Role, ROLE_PORTAL_MAP } from '@koraylo/shared';

export default function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // router.push('/login');
      } else if (user.role !== Role.CLUB_LEAD && user.role !== Role.ADMIN) {
        const target = ROLE_PORTAL_MAP[user.role] || '/login';
        router.push(target);
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar role={Role.CLUB_LEAD} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar user={user} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
