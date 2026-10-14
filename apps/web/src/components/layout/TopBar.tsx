'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile, Role, ROLE_DISPLAY_MAP } from '@koraylo/shared';
import { useAuth } from '@/hooks/useAuth';

interface TopBarProps {
  user?: UserProfile | null;
}

export function TopBar({ user: propUser }: TopBarProps) {
  const { user: hookUser, logout } = useAuth();
  const user = propUser || hookUser;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CP';

  const roleLabel = user?.role ? ROLE_DISPLAY_MAP[user.role] : 'User';

  const profileHref =
    user?.role === Role.FACULTY
      ? '/faculty/profile'
      : user?.role === Role.CLUB_LEAD
      ? '/club/profile'
      : '/student/profile';

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Global Search */}
      <div className="flex w-full max-w-md items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search classes, events, notices, students..."
            className="w-full bg-gray-50/80 pl-9 pr-4 text-sm focus-visible:bg-white"
          />
        </div>
      </div>

      {/* Right controls: Notifications & User profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-campus-green-600"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-full p-1 pl-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-campus-green-600">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 leading-none">
                {user?.name || 'Campus Member'}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {roleLabel}
              </p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-campus-green-600">
              <AvatarFallback className="bg-campus-green-950 text-white font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-gray-900">
                  {user?.name || 'Campus Member'}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.email || 'user@campus.edu'}
                </p>
                <div className="pt-1.5">
                  <Badge variant="campus" className="text-[10px]">
                    {roleLabel}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={profileHref} className="cursor-pointer flex items-center">
                <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>

            {user?.role === Role.STUDENT && (
              <DropdownMenuItem asChild>
                <Link href="/student/attendance" className="cursor-pointer flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-gray-500" />
                  <span>My Attendance</span>
                </Link>
              </DropdownMenuItem>
            )}

            {user?.role === Role.FACULTY && (
              <DropdownMenuItem asChild>
                <Link href="/faculty/classes" className="cursor-pointer flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Assigned Classes</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
