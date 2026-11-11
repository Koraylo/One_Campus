'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  CalendarCheck,
  ExternalLink,
  MessageSquare,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { StatCard } from '@/components/layout/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonutChart } from '@/components/charts/DonutChart';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@koraylo/shared';
import { api } from '@/lib/api';

interface TodayClass {
  id: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
  slot: string;
  room: string;
  facultyName: string;
  startTime: string;
  endTime: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  venue?: string;
  clubName: string;
  isRegistered?: boolean;
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  scope: string;
  authorName: string;
  createdAt: string;
}

interface ChannelItem {
  id: string;
  name: string;
  type: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderName: string;
  };
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [attendance, setAttendance] = useState<{
    percentage: number;
    present: number;
    absent: number;
    od: number;
    ml: number;
    total: number;
    margin: number;
  }>({
    percentage: 84,
    present: 21,
    absent: 3,
    od: 1,
    ml: 0,
    total: 25,
    margin: 2,
  });

  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [ttRes, attRes, evRes, annRes, chRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: TodayClass[] }>('/api/timetable/today'),
        api.get<{ success: boolean; data: any }>('/api/attendance/my'),
        api.get<{ success: boolean; data: EventItem[] }>('/api/events'),
        api.get<{ success: boolean; data: AnnouncementItem[] }>('/api/announcements'),
        api.get<{ success: boolean; data: ChannelItem[] }>('/api/channels/my'),
      ]);

      if (ttRes.status === 'fulfilled' && ttRes.value?.data) {
        setTodayClasses(ttRes.value.data);
      }
      if (attRes.status === 'fulfilled' && attRes.value?.data) {
        const ov = attRes.value.data.overall;
        const avgMargin =
          attRes.value.data.sections && attRes.value.data.sections.length > 0
            ? Math.round(
                attRes.value.data.sections.reduce((acc: number, s: any) => acc + s.margin, 0) /
                  attRes.value.data.sections.length
              )
            : 0;

        setAttendance({
          percentage: ov.percentage,
          present: ov.present,
          absent: ov.absent,
          od: ov.od,
          ml: ov.ml,
          total: ov.total,
          margin: avgMargin,
        });
      }
      if (evRes.status === 'fulfilled' && evRes.value?.data) {
        setEvents(evRes.value.data.slice(0, 3));
      }
      if (annRes.status === 'fulfilled' && annRes.value?.data) {
        setAnnouncements(annRes.value.data.slice(0, 4));
      }
      if (chRes.status === 'fulfilled' && chRes.value?.data) {
        setChannels(chRes.value.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const toggleRegister = async (id: string, currentlyRegistered: boolean) => {
    if (currentlyRegistered) return;
    try {
      setRegisteringId(id);
      await api.post(`/api/events/${id}/register`);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isRegistered: true } : e))
      );
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setRegisteringId(null);
    }
  };

  const attendanceData = [
    { name: 'Present', value: attendance.present, color: '#16a34a' },
    { name: 'Absent', value: attendance.absent, color: '#dc2626' },
    { name: 'OD / ML', value: attendance.od + attendance.ml, color: '#d97706' },
  ];

  const registeredCount = events.filter((e) => e.isRegistered).length;

  return (
    <div className="space-y-6">
      {/* Hero Greeting Banner */}
      <HeroBanner
        name={user?.name || 'Student'}
        role={Role.STUDENT}
        quote="An investment in knowledge pays the best interest."
      />

      {/* 4 Stat Cards (Aligned with PRD MARK-3: no fake CGPA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Classes"
          value={String(todayClasses.length)}
          subtext="Scheduled lectures"
          icon={BookOpen}
          color="green"
          href="/student/timetable"
        />
        <StatCard
          label="Upcoming Events"
          value={String(events.length)}
          subtext={`Registered: ${registeredCount}`}
          icon={Calendar}
          color="blue"
          href="/student/events"
        />
        <StatCard
          label="Attendance Margin"
          value={attendance.margin >= 0 ? `+${attendance.margin}` : `${attendance.margin}`}
          subtext={attendance.margin >= 0 ? 'Safe classes to miss' : 'Classes to recover'}
          icon={ShieldCheck}
          color="purple"
          href="/student/attendance"
        />
        <StatCard
          label="Overall Attendance"
          value={`${attendance.percentage}%`}
          subtext="University Target: ≥ 75%"
          icon={CalendarCheck}
          color="amber"
          href="/student/attendance"
        />
      </div>

      {/* Main Grid: Left 2 Cols (Classes & Events), Right 1 Col (Attendance, Quick Links, Channels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Today&apos;s Classes
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Scheduled lectures and lab sessions
                </p>
              </div>
              <Link href="/student/timetable">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  Full Timetable <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {todayClasses.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-gray-50 rounded-xl">
                  No lectures scheduled for today. Enjoy your day or study!
                </div>
              ) : (
                todayClasses.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900">
                          {item.courseCode} · {item.courseName}
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                          Slot {item.slot}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {item.startTime} – {item.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {item.room}
                        </span>
                        <span className="font-medium text-gray-600">
                          {item.facultyName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href="/student/gcr">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-8 gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open GCR</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Featured Campus Events
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Expand your skills and connect with clubs
                </p>
              </div>
              <Link href="/student/events">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  Browse All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {events.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-gray-50 rounded-xl">
                  No upcoming events scheduled right now.
                </div>
              ) : (
                events.map((evt) => {
                  const isRegistered = !!evt.isRegistered;
                  return (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {evt.title}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            <Calendar className="w-3.5 h-3.5 text-campus-green-600" />
                            {evt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {evt.venue || 'Campus Auditorium'}
                          </span>
                          <span className="text-campus-green-700 font-medium">
                            {evt.clubName}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isRegistered ? 'secondary' : 'default'}
                        onClick={() => toggleRegister(evt.id, isRegistered)}
                        disabled={registeringId === evt.id || isRegistered}
                        className={`text-xs h-8 shrink-0 ${
                          isRegistered
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-campus-green-950 hover:bg-campus-green-800 text-white'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Registered
                          </>
                        ) : registeringId === evt.id ? (
                          'Registering...'
                        ) : (
                          'Register Now'
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-campus-green-600" />
                <CardTitle className="text-base font-bold text-gray-900">
                  Campus Announcements
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {announcements.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground bg-gray-50 rounded-xl">
                  No announcements at this time.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-800">
                        {ann.title}
                      </p>
                      <p className="text-[11px] text-gray-600 line-clamp-2">
                        {ann.content}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Author: <span className="font-medium text-gray-700">{ann.authorName}</span> · {ann.scope} notice
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Attendance Overview Card */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Attendance Overview
              </CardTitle>
              <Link href="/student/attendance">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  Details
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart
                data={attendanceData}
                centerValue={`${attendance.percentage}%`}
                centerLabel="Overall"
                height={190}
                innerRadius={50}
                outerRadius={70}
              />
              <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span className="font-medium">Eligibility Threshold</span>
                <span className="font-bold">≥ 75% Required</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Link
                href="/student/attendance"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <span>Submit OD / ML Application</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student/timetable"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>View Full Schedule</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student/marks"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Exam Marks & Transcripts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student/gcr"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Google Classrooms (GCR)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Active Channels Widget (COMM-5) */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold text-gray-900">
                Active Channels
              </CardTitle>
              <Link href="/student/chats">
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
                    href="/student/chats"
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
