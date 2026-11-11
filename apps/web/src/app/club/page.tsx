'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  ClipboardList,
  Award,
  PlusCircle,
  CalendarCheck,
  ExternalLink,
  BellRing,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { StatCard } from '@/components/layout/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@koraylo/shared';
import { api } from '@/lib/api';

interface ClubDetail {
  id: string;
  name: string;
  description?: string;
  facultyCoordinatorName?: string;
}

interface ClubEventItem {
  id: string;
  title: string;
  date: string;
  venue?: string;
  status: string;
  registrationCount: number;
}

interface ChannelItem {
  id: string;
  name: string;
  type: string;
  lastMessage?: {
    content: string;
    senderName: string;
  };
}

export default function ClubDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [events, setEvents] = useState<ClubEventItem[]>([]);
  const [channels, setChannels] = useState<ChannelItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const clubRes = await api.get<{ success: boolean; data: ClubDetail }>('/api/clubs/my');
      if (clubRes.data) {
        setClub(clubRes.data);
        const [evRes, chRes] = await Promise.allSettled([
          api.get<{ success: boolean; data: ClubEventItem[] }>(`/api/events?clubId=${clubRes.data.id}`),
          api.get<{ success: boolean; data: ChannelItem[] }>('/api/channels/my'),
        ]);

        if (evRes.status === 'fulfilled' && evRes.value?.data) {
          setEvents(evRes.value.data);
        }
        if (chRes.status === 'fulfilled' && chRes.value?.data) {
          setChannels(chRes.value.data.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to load club dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalRegistrations = events.reduce((acc, ev) => acc + (ev.registrationCount || 0), 0);
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming' || e.status === 'Pending Approval');

  return (
    <div className="space-y-6">
      {/* Hero Greeting Banner */}
      <HeroBanner
        name={user?.name || 'Club Lead'}
        role={Role.CLUB_LEAD}
        quote={club ? `Leading ${club.name} · Innovation, collaboration & leadership.` : 'Great things in business and clubs are done by a team of people.'}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My Club"
          value={club?.name ? club.name.replace(' Club', '') : 'CSE Club'}
          subtext="Active Charter"
          icon={Sparkles}
          color="green"
          href="/club/my-club"
        />
        <StatCard
          label="Hosted Events"
          value={String(events.length)}
          subtext={`Upcoming: ${upcomingEvents.length}`}
          icon={Calendar}
          color="blue"
          href="/club/events"
        />
        <StatCard
          label="Total Registrations"
          value={String(totalRegistrations)}
          subtext="Student participants"
          icon={Users}
          color="purple"
          href="/club/attendance"
        />
        <StatCard
          label="Certificates"
          value="Pipeline"
          subtext="Propose & Distribute"
          icon={Award}
          color="amber"
          href="/club/certificates"
        />
      </div>

      {/* Main Grid: Left 2 Cols (Events & Registrations), Right 1 Col (Actions & Channels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Club Event Schedule
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upcoming workshops, hackathons, and symposiums
                </p>
              </div>
              <Link href="/club/events">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  All Events <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {events.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-gray-50 rounded-xl">
                  No events organized yet. Use &quot;Create Event&quot; to propose a workshop or hackathon.
                </div>
              ) : (
                events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{evt.title}</span>
                        <Badge
                          variant="outline"
                          className={
                            evt.status === 'Upcoming'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]'
                              : evt.status === 'Completed'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 text-[10px]'
                              : 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]'
                          }
                        >
                          {evt.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-campus-green-600" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {evt.venue || 'Campus Auditorium'}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {evt.registrationCount} registered
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href="/club/attendance">
                        <Button
                          size="sm"
                          className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Attendance</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Link
                href="/club/events"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Propose New Event</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/club/attendance"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  <span>Take Event Attendance</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/club/certificates"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Propose & Distribute Certificates</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Switch to Student Portal</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Club Channels Widget */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold text-gray-900">
                Club Channels
              </CardTitle>
              <Link href="/club/chats">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  All Chats
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {channels.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No active channels joined.
                </div>
              ) : (
                channels.map((ch) => (
                  <Link
                    key={ch.id}
                    href="/club/chats"
                    className="p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-gray-900">
                        #{ch.name}
                      </span>
                      <Badge variant="outline" className="text-[9px] text-gray-500">
                        {ch.type}
                      </Badge>
                    </div>
                    {ch.lastMessage && (
                      <p className="text-[11px] text-gray-500 truncate mt-1">
                        <span className="font-medium text-gray-700">{ch.lastMessage.senderName}: </span>
                        {ch.lastMessage.content}
                      </p>
                    )}
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
