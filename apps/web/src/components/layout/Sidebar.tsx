'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  MessageSquare,
  CalendarCheck,
  Calendar,
  GraduationCap,
  ExternalLink,
  BookOpen,
  Users,
  Award,
  FileCheck2,
  BellRing,
  Sparkles,
  ClipboardList,
  BarChart3,
  Mail,
  Settings,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@koraylo/shared';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Profile', href: '/student/profile', icon: User },
  { label: 'Chats/Channels', href: '/student/chats', icon: MessageSquare },
  { label: 'Attendance', href: '/student/attendance', icon: CalendarCheck },
  { label: 'Events', href: '/student/events', icon: Calendar },
  { label: 'Marks', href: '/student/marks', icon: GraduationCap },
  { label: 'GCR', href: '/student/gcr', icon: ExternalLink },
];

const FACULTY_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
  { label: 'Profile', href: '/faculty/profile', icon: User },
  { label: 'Classes', href: '/faculty/classes', icon: BookOpen },
  { label: 'Students', href: '/faculty/students', icon: Users },
  { label: 'Attendance', href: '/faculty/attendance', icon: CalendarCheck },
  { label: 'Marks', href: '/faculty/marks', icon: GraduationCap },
  { label: 'Chats/Channels', href: '/faculty/chats', icon: MessageSquare },
  { label: 'OD/ML', href: '/faculty/od-ml', icon: FileCheck2 },
  { label: 'Certificate Approvals', href: '/faculty/certificates', icon: Award },
  { label: 'GCR', href: '/faculty/gcr', icon: ExternalLink },
  { label: 'Events', href: '/faculty/events', icon: Calendar },
  { label: 'Notices', href: '/faculty/notices', icon: BellRing },
];

const CLUB_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/club', icon: LayoutDashboard },
  { label: 'Profile', href: '/club/profile', icon: User },
  { label: 'Chats/Channels', href: '/club/chats', icon: MessageSquare },
  { label: 'My Club', href: '/club/my-club', icon: Sparkles },
  { label: 'Events', href: '/club/events', icon: Calendar },
  { label: 'Registrations', href: '/club/registrations', icon: ClipboardList },
  { label: 'Attendance', href: '/club/attendance', icon: CalendarCheck },
  { label: 'Certificates', href: '/club/certificates', icon: Award },
  { label: 'Newsletters', href: '/club/newsletters', icon: Mail },
  { label: 'Event Analytics', href: '/club/analytics', icon: BarChart3 },
  { label: 'GCR', href: '/club/gcr', icon: ExternalLink },
  { label: 'Notices', href: '/club/notices', icon: BellRing },
  { label: 'Settings', href: '/club/settings', icon: Settings },
];

const QUOTES: Record<Role, { quote: string; author: string }> = {
  [Role.STUDENT]: {
    quote: 'Knowledge is power. Information is liberating.',
    author: 'Kofi Annan',
  },
  [Role.FACULTY]: {
    quote: 'The art of teaching is the art of assisting discovery.',
    author: 'Mark Van Doren',
  },
  [Role.CLUB_LEAD]: {
    quote: 'Great things in business and clubs are done by a team of people.',
    author: 'Steve Jobs',
  },
  [Role.ADMIN]: {
    quote: 'Efficiency is doing better what is already being done.',
    author: 'Peter Drucker',
  },
};

interface SidebarProps {
  role?: Role;
}

export function Sidebar({ role = Role.STUDENT }: SidebarProps) {
  const pathname = usePathname();

  let navItems = STUDENT_NAV;
  if (role === Role.FACULTY) navItems = FACULTY_NAV;
  if (role === Role.CLUB_LEAD) navItems = CLUB_NAV;

  const quoteInfo = QUOTES[role] || QUOTES[Role.STUDENT];

  return (
    <aside className="w-64 shrink-0 bg-[#1B4332] text-white flex flex-col h-screen sticky top-0 border-r border-[#143527] select-none z-30 shadow-xl">
      {/* Brand Logo & Title */}
      <div className="p-5 border-b border-[#23533e] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-campus-green-500/20 border border-campus-green-400/40 flex items-center justify-center text-white shadow-inner">
          <GraduationCap className="w-6 h-6 text-emerald-300" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-white">
            Campus Portal
          </h1>
          <p className="text-[11px] text-emerald-200/80 font-medium tracking-wide">
            One Platform. Connected.
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-emerald-300/70 uppercase">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/student' &&
              item.href !== '/faculty' &&
              item.href !== '/club' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-[#2D6A4F] text-white shadow-sm font-semibold translate-x-0.5'
                  : 'text-emerald-100/80 hover:bg-[#23533e] hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                  isActive ? 'text-white' : 'text-emerald-300/80'
                )}
              />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Motivational Quote Box */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#143527]/70 border border-[#23533e]/60 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-300 mb-1">
          <Quote className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-[11px] tracking-wide uppercase">
            Daily Thought
          </span>
        </div>
        <p className="italic text-emerald-100/90 leading-relaxed text-[11px]">
          &ldquo;{quoteInfo.quote}&rdquo;
        </p>
        <p className="text-[10px] text-emerald-300/70 mt-1.5 font-medium text-right">
          — {quoteInfo.author}
        </p>
      </div>
    </aside>
  );
}
