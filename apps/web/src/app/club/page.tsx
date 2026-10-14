'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  ClipboardList,
  Award,
  PlusCircle,
  CalendarCheck,
  Mail,
  ExternalLink,
  BellRing,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { StatCard } from '@/components/layout/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonutChart } from '@/components/charts/DonutChart';
import { ProgressBar } from '@/components/charts/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@koraylo/shared';

export default function ClubDashboard() {
  const { user } = useAuth();

  const engagementData = [
    { name: 'Active', value: 148, color: '#16a34a' },
    { name: 'Moderate', value: 72, color: '#d97706' },
    { name: 'Inactive', value: 28, color: '#94a3b8' },
  ];

  const upcomingEvents = [
    {
      id: 'e1',
      title: 'Hackathon 2026: Code for Green',
      date: 'Oct 18, 2026 · 09:00 AM',
      venue: 'Main Auditorium',
      type: 'Flagship',
      registered: 184,
      capacity: 200,
      status: 'Confirmed',
    },
    {
      id: 'e2',
      title: 'Fullstack Next.js 14 Workshop',
      date: 'Oct 25, 2026 · 02:00 PM',
      venue: 'Seminar Hall 2',
      type: 'Workshop',
      registered: 65,
      capacity: 70,
      status: 'Confirmed',
    },
    {
      id: 'e3',
      title: 'Intro to Open Source & Git',
      date: 'Nov 02, 2026 · 03:30 PM',
      venue: 'Lab 4 (Computer Center)',
      type: 'Orientation',
      registered: 42,
      capacity: 60,
      status: 'Proposed',
    },
  ];

  const recentActivities = [
    {
      id: 'act-1',
      title: '148 Certificates issued for Cloud Computing Seminar',
      time: '2 hours ago',
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'act-2',
      title: 'New registration milestone: 180+ signups for Hackathon 2026',
      time: '4 hours ago',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'act-3',
      title: 'Faculty coordinator approved Budget Proposal for TechFest',
      time: 'Yesterday',
      icon: CheckCircle2,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  const channels = [
    {
      id: 'c1',
      name: '#core-committee-2026',
      lastMessage: 'Karthik: Logistics check for Friday auditorium setup complete.',
      time: '12m ago',
    },
    {
      id: 'c2',
      name: '#hackathon-mentors',
      lastMessage: 'Pooja: Evaluation rubric sheet updated in drive folder.',
      time: '1h ago',
    },
    {
      id: 'c3',
      name: '#cse-club-announcements',
      lastMessage: 'President: Weekly standup tomorrow at 5:00 PM.',
      time: '3h ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Greeting Banner */}
      <HeroBanner
        name={user?.name || 'CSE Technical Club'}
        role={Role.CLUB_LEAD}
        customGreeting="Good Afternoon, CSE Club Lead!"
        customSubtitle="Create. Collaborate. Inspire. 🌱"
        quote="Great things in clubs are accomplished through teamwork and continuous drive."
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Upcoming Events"
          value="3"
          subtext="Next: Hackathon '26"
          icon={Calendar}
          color="green"
          href="/club/events"
        />
        <StatCard
          label="Total Members"
          value="248"
          subtext="Core & General"
          icon={Users}
          color="blue"
          href="/club/my-club"
        />
        <StatCard
          label="Total Registrations"
          value="291"
          subtext="Active across events"
          icon={ClipboardList}
          color="amber"
          href="/club/registrations"
        />
        <StatCard
          label="Certificates Issued"
          value="412"
          subtext="This academic year"
          icon={Award}
          color="purple"
          href="/club/certificates"
        />
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Club Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <Link href="/club/events" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Create Event</span>
            </Button>
          </Link>
          <Link href="/club/registrations" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-blue-200 text-blue-800 hover:bg-blue-50"
            >
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>Registrations</span>
            </Button>
          </Link>
          <Link href="/club/attendance" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              <CalendarCheck className="w-4 h-4 text-amber-600" />
              <span>Mark Attendance</span>
            </Button>
          </Link>
          <Link href="/club/certificates" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-purple-200 text-purple-800 hover:bg-purple-50"
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span>Certificates</span>
            </Button>
          </Link>
          <Link href="/club/newsletters" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-gray-200 text-gray-800 hover:bg-gray-100"
            >
              <Mail className="w-4 h-4 text-gray-600" />
              <span>Newsletter</span>
            </Button>
          </Link>
          <Link href="/club/gcr" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-teal-200 text-teal-800 hover:bg-teal-50"
            >
              <ExternalLink className="w-4 h-4 text-teal-600" />
              <span>Club GCR</span>
            </Button>
          </Link>
          <Link href="/club/notices" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-rose-200 text-rose-800 hover:bg-rose-50"
            >
              <BellRing className="w-4 h-4 text-rose-600" />
              <span>Broadcast</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Upcoming Events & Activity), Right 1 Col (Registrations, Engagement, Chats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events Management */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Scheduled Club Events
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track sign-ups, venues, and live logistics
                </p>
              </div>
              <Link href="/club/events">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  Manage Events <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {evt.title}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        {evt.type}
                      </Badge>
                      <Badge
                        variant={evt.status === 'Confirmed' ? 'present' : 'od'}
                        className="text-[10px]"
                      >
                        {evt.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-campus-green-600" />
                        {evt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {evt.venue}
                      </span>
                    </div>

                    <div className="pt-1 max-w-xs">
                      <ProgressBar
                        label="Registrations"
                        current={evt.registered}
                        total={evt.capacity}
                        color="bg-campus-green-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/club/events?id=${evt.id}`}>
                      <Button size="sm" variant="campus" className="text-xs h-8">
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Club Activity Timeline */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-campus-green-600" />
                <CardTitle className="text-base font-bold text-gray-900">
                  Recent Club Operations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${act.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-gray-800">
                        {act.title}
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Member Engagement Donut */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Member Engagement
              </CardTitle>
              <Link href="/club/analytics">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  Analytics
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart
                data={engagementData}
                centerValue="248"
                centerLabel="Total Members"
                height={190}
                innerRadius={50}
                outerRadius={70}
              />
            </CardContent>
          </Card>

          {/* Event Capacity / Registration Bars */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900">
                Registration Caps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <ProgressBar
                label="Hackathon 2026"
                current={184}
                total={200}
                color="bg-emerald-600"
              />
              <ProgressBar
                label="Next.js 14 Workshop"
                current={65}
                total={70}
                color="bg-blue-600"
              />
              <ProgressBar
                label="Git & Open Source"
                current={42}
                total={60}
                color="bg-amber-500"
              />
            </CardContent>
          </Card>

          {/* Club Chats & Channels */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-campus-green-600" />
                <CardTitle className="text-base font-bold text-gray-900">
                  Club Channels
                </CardTitle>
              </div>
              <Link href="/club/chats">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  Open
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {channels.map((ch) => (
                <Link
                  key={ch.id}
                  href="/club/chats"
                  className="block p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-gray-800">
                      {ch.name}
                    </span>
                    <span className="text-[10px] text-gray-400">{ch.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 truncate">
                    {ch.lastMessage}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
