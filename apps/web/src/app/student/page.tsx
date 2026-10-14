'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  CalendarCheck,
  Video,
  ExternalLink,
  MessageSquare,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { StatCard } from '@/components/layout/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonutChart } from '@/components/charts/DonutChart';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@koraylo/shared';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

  const toggleRegister = (id: string) => {
    setRegisteredEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const attendanceData = [
    { name: 'Present', value: 42, color: '#16a34a' },
    { name: 'Absent', value: 4, color: '#dc2626' },
    { name: 'OD / ML', value: 3, color: '#d97706' },
  ];

  const todayClasses = [
    {
      time: '09:00 - 10:00 AM',
      courseCode: 'CS301',
      courseName: 'Data Structures & Algorithms',
      faculty: 'Prof. R. Ramanujan',
      room: 'Room CS-102',
      gcrUrl: 'https://classroom.google.com',
      current: true,
    },
    {
      time: '10:15 - 11:15 AM',
      courseCode: 'CS303',
      courseName: 'Computer Networks',
      faculty: 'Dr. Anita Sharma',
      room: 'Room CS-204',
      gcrUrl: 'https://classroom.google.com',
      current: false,
    },
    {
      time: '11:30 - 12:30 PM',
      courseCode: 'MA201',
      courseName: 'Discrete Mathematics',
      faculty: 'Prof. K. Venkatesh',
      room: 'Lecture Hall 1',
      gcrUrl: 'https://classroom.google.com',
      current: false,
    },
    {
      time: '02:00 - 04:00 PM',
      courseCode: 'CS305P',
      courseName: 'Operating Systems Laboratory',
      faculty: 'Dr. P. Subramanian',
      room: 'Lab 3 (Systems)',
      gcrUrl: 'https://classroom.google.com',
      current: false,
    },
  ];

  const upcomingEvents = [
    {
      id: 'evt-1',
      title: 'Hackathon 2026: Code for Green',
      date: 'Oct 18, 2026',
      time: '09:00 AM',
      club: 'CSE Club',
      venue: 'Main Auditorium',
      type: 'Technical',
    },
    {
      id: 'evt-2',
      title: 'AI & Robotics Annual Symposium',
      date: 'Oct 22, 2026',
      time: '10:30 AM',
      club: 'Robotics Society',
      venue: 'Seminar Hall B',
      type: 'Workshop',
    },
    {
      id: 'evt-3',
      title: 'Campus Cultural Fest Orientation',
      date: 'Oct 28, 2026',
      time: '04:00 PM',
      club: 'Cultural Forum',
      venue: 'Open Air Amphitheatre',
      type: 'Cultural',
    },
  ];

  const announcements = [
    {
      id: 'ann-1',
      title: 'Mid-Semester Examination Schedule Released',
      department: 'Dean Academics',
      time: '2 hours ago',
      important: true,
    },
    {
      id: 'ann-2',
      title: 'Smart India Hackathon 2026 Internal Nominations Open',
      department: 'Innovation Cell',
      time: '5 hours ago',
      important: false,
    },
    {
      id: 'ann-3',
      title: 'Campus Wi-Fi Maintenance Window this Saturday midnight',
      department: 'IT Services',
      time: '1 day ago',
      important: false,
    },
  ];

  const channels = [
    {
      id: 'ch-1',
      name: '#cs301-data-structures',
      lastMessage: 'Dr. Ramanujan: Assignment 3 submission link is now live on GCR.',
      time: '15m ago',
      unread: 2,
    },
    {
      id: 'ch-2',
      name: '#cse-batch-2024',
      lastMessage: 'Aarav Patel: Does anyone have the class notes from Thursday?',
      time: '42m ago',
      unread: 0,
    },
    {
      id: 'ch-3',
      name: '#green-hackathon-2026',
      lastMessage: 'Coordinator: Team registrations will close at midnight.',
      time: '2h ago',
      unread: 4,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Greeting Banner */}
      <HeroBanner
        name={user?.name || 'Aarav Sharma'}
        role={Role.STUDENT}
        quote="An investment in knowledge pays the best interest."
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Ongoing Courses"
          value="6"
          subtext="Sem V"
          icon={BookOpen}
          color="green"
          href="/student/timetable"
        />
        <StatCard
          label="Upcoming Events"
          value="4"
          subtext="Registered: 2"
          icon={Calendar}
          color="blue"
          href="/student/events"
        />
        <StatCard
          label="Cumulative GPA"
          value="8.84"
          subtext="Top 10%"
          icon={GraduationCap}
          color="purple"
          href="/student/marks"
        />
        <StatCard
          label="Overall Attendance"
          value="87.5%"
          subtext="Target: 75%"
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
              {todayClasses.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.current
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">
                        {item.courseCode} · {item.courseName}
                      </span>
                      {item.current && (
                        <Badge variant="present" className="text-[10px] animate-pulse">
                          Now
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {item.room}
                      </span>
                      <span className="font-medium text-gray-600">
                        {item.faculty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={item.gcrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button
                        size="sm"
                        variant={item.current ? 'campus' : 'outline'}
                        className="text-xs h-8 gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open GCR</span>
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
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
              {upcomingEvents.map((evt) => {
                const isRegistered = registeredEvents[evt.id];
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
                        <Badge variant="outline" className="text-[10px]">
                          {evt.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-campus-green-600" />
                          {evt.date} · {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {evt.venue}
                        </span>
                        <span className="text-campus-green-700 font-medium">
                          Organized by {evt.club}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isRegistered ? 'secondary' : 'default'}
                      onClick={() => toggleRegister(evt.id)}
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
                      ) : (
                        'Register Now'
                      )}
                    </Button>
                  </div>
                );
              })}
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
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-800">
                      {ann.title}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      From: <span className="font-medium text-gray-700">{ann.department}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {ann.time}
                  </span>
                </div>
              ))}
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
                centerValue="87.5%"
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
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Link
                href="/student/timetable"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>View Time Table</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student/events"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Academic Calendar</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student/attendance"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Submit Leave / OD Request</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/student/gcr"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-purple-600" />
                  <span>Linked GCR Courses</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <a
                href="#support"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Campus Helpdesk: support@campus.edu | Helpline: +91 98765 43210');
                }}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-rose-600" />
                  <span>Student Support & Grievance</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </CardContent>
          </Card>

          {/* Recent Channel Messages */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-campus-green-600" />
                <CardTitle className="text-base font-bold text-gray-900">
                  Chats & Channels
                </CardTitle>
              </div>
              <Link href="/student/chats">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  Open
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {channels.map((ch) => (
                <Link
                  key={ch.id}
                  href="/student/chats"
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
                  {ch.unread > 0 && (
                    <div className="mt-1.5 flex justify-end">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                        {ch.unread} new
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
