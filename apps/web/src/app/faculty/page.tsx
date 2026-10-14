'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  CalendarCheck,
  FileCheck2,
  Clock,
  ArrowRight,
  Upload,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  Award,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { StatCard } from '@/components/layout/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { DonutChart } from '@/components/charts/DonutChart';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@koraylo/shared';

export default function FacultyDashboard() {
  const { user } = useAuth();

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'od-1',
      type: 'OD',
      student: 'Rohit Verma',
      rollNo: '22CS084',
      event: 'Smart India Hackathon',
      date: 'Oct 19, 2026',
      status: 'Pending',
    },
    {
      id: 'ml-1',
      type: 'ML',
      student: 'Priya Sundaram',
      rollNo: '22CS112',
      event: 'Medical Leave (Fever)',
      date: 'Oct 14, 2026',
      status: 'Pending',
    },
    {
      id: 'cert-1',
      type: 'Certificate',
      student: 'Aditya Rao',
      rollNo: '22CS015',
      event: 'WebDev Bootcamp Merit',
      date: 'Oct 12, 2026',
      status: 'Pending',
    },
  ]);

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  const attendanceData = [
    { name: 'Present', value: 168, color: '#16a34a' },
    { name: 'Absent', value: 18, color: '#dc2626' },
    { name: 'OD / ML', value: 14, color: '#d97706' },
  ];

  const myClasses = [
    {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      semester: 'Sem 5 · Section A',
      students: 64,
      avgAttendance: '88%',
    },
    {
      code: 'CS301-B',
      name: 'Data Structures & Algorithms',
      semester: 'Sem 5 · Section B',
      students: 62,
      avgAttendance: '84%',
    },
    {
      code: 'CS402',
      name: 'Advanced Algorithms Lab',
      semester: 'Sem 7 · Section A',
      students: 38,
      avgAttendance: '91%',
    },
  ];

  const todayTimeline = [
    {
      time: '09:00 - 10:00 AM',
      course: 'CS301 · Data Structures & Algorithms',
      room: 'Room CS-102',
      status: 'completed',
    },
    {
      time: '11:30 - 12:30 PM',
      course: 'CS301-B · Data Structures & Algorithms',
      room: 'Room CS-104',
      status: 'ongoing',
    },
    {
      time: '02:00 - 04:00 PM',
      course: 'CS402 · Advanced Algorithms Lab',
      room: 'Lab 2 (Computing)',
      status: 'upcoming',
    },
  ];

  const messages = [
    {
      id: 'm1',
      channel: '#cs301-sec-a',
      sender: 'HOD CSE',
      text: 'Reminder: Submit mid-term marks by Friday 5 PM.',
      time: '10:15 AM',
    },
    {
      id: 'm2',
      channel: '#faculty-general',
      sender: 'Dean Academics',
      text: 'Departmental faculty meeting scheduled tomorrow at 3 PM.',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Greeting Banner */}
      <HeroBanner
        name={user?.name || 'Dr. Anita Sharma'}
        role={Role.FACULTY}
        quote="Teaching is the greatest act of optimism."
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Classes Assigned"
          value="3"
          subtext="164 Students"
          icon={BookOpen}
          color="green"
          href="/faculty/classes"
        />
        <StatCard
          label="Total Students"
          value="164"
          subtext="Across 3 Sections"
          icon={Users}
          color="blue"
          href="/faculty/students"
        />
        <StatCard
          label="Average Attendance"
          value="87.6%"
          subtext="+2.4% this month"
          icon={CalendarCheck}
          color="purple"
          href="/faculty/attendance"
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals.length.toString()}
          subtext="OD, ML & Certs"
          icon={FileCheck2}
          color="amber"
          href="/faculty/od-ml"
        />
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Quick Faculty Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Link href="/faculty/attendance" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark Attendance</span>
            </Button>
          </Link>
          <Link href="/faculty/marks" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-blue-200 text-blue-800 hover:bg-blue-50"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Upload Marks</span>
            </Button>
          </Link>
          <Link href="/faculty/od-ml" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Approve OD/ML</span>
            </Button>
          </Link>
          <Link href="/faculty/certificates" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-purple-200 text-purple-800 hover:bg-purple-50"
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span>Certificates</span>
            </Button>
          </Link>
          <Link href="/faculty/gcr" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-gray-200 text-gray-800 hover:bg-gray-100"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
              <span>Open GCR</span>
            </Button>
          </Link>
          <Link href="/faculty/notices" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs font-semibold justify-start gap-2 border-rose-200 text-rose-800 hover:bg-rose-50"
            >
              <Megaphone className="w-4 h-4 text-rose-600" />
              <span>Post Notice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Classes & Approvals), Right 1 Col (Schedule, Attendance Donut, Messages) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classes Table */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Assigned Classes & Sections
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Academic Year 2026-27 · Odd Semester
                </p>
              </div>
              <Link href="/faculty/classes">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  All Classes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Avg Attn</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myClasses.map((cls) => (
                    <TableRow key={cls.code}>
                      <TableCell className="font-semibold text-gray-900">
                        {cls.code}
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium">
                        {cls.name}
                      </TableCell>
                      <TableCell className="text-gray-600 text-xs">
                        {cls.semester}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {cls.students}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="present" className="text-[10px]">
                          {cls.avgAttendance}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/faculty/attendance?course=${cls.code}`}>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Take Attn
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Approvals (OD, ML, Certificates) */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Pending Student Approvals</span>
                  {pendingApprovals.length > 0 && (
                    <Badge variant="od" className="text-[10px]">
                      {pendingApprovals.length} Action Needed
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review on-duty, medical leaves, and club participation certificates
                </p>
              </div>
              <Link href="/faculty/od-ml">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  Review All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 bg-gray-50 rounded-xl">
                  No pending requests requiring your review.
                </div>
              ) : (
                pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.type === 'OD'
                              ? 'od'
                              : item.type === 'ML'
                              ? 'ml'
                              : 'campus'
                          }
                          className="text-[10px]"
                        >
                          {item.type}
                        </Badge>
                        <span className="font-semibold text-sm text-gray-900">
                          {item.student} ({item.rollNo})
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Purpose: <span className="font-medium text-gray-800">{item.event}</span> · Date: {item.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(item.id, 'Reject')}
                        className="text-xs h-8 text-rose-600 hover:bg-rose-50 border-rose-200"
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(item.id, 'Approve')}
                        className="text-xs h-8 bg-campus-green-950 hover:bg-campus-green-800 text-white"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Today's Schedule Timeline */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-campus-green-600" />
                <span>Today&apos;s Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="relative border-l-2 border-emerald-200 ml-3 pl-4 space-y-5">
                {todayTimeline.map((slot, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot */}
                    <span
                      className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        slot.status === 'completed'
                          ? 'bg-emerald-600'
                          : slot.status === 'ongoing'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-gray-500 font-mono">
                        {slot.time}
                      </span>
                      <h4 className="text-xs font-semibold text-gray-900 leading-snug">
                        {slot.course}
                      </h4>
                      <p className="text-[11px] text-gray-500">{slot.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Attendance Overview Donut */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Attendance Distribution
              </CardTitle>
              <Link href="/faculty/attendance">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  Analytics
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart
                data={attendanceData}
                centerValue="84%"
                centerLabel="Aggregate"
                height={190}
                innerRadius={50}
                outerRadius={70}
              />
            </CardContent>
          </Card>

          {/* Recent Department Messages */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-campus-green-600" />
                <CardTitle className="text-base font-bold text-gray-900">
                  Recent Messages
                </CardTitle>
              </div>
              <Link href="/faculty/chats">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700 p-0 h-auto">
                  View
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-0.5">
                    <span>{m.channel}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{m.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 truncate">
                    <span className="font-medium text-gray-700">{m.sender}:</span> {m.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
