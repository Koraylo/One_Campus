'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  CalendarCheck,
  FileCheck2,
  Clock,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  Award,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  MapPin,
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
  startTime: string;
  endTime: string;
}

interface PendingODRequest {
  id: string;
  studentName: string;
  courseCode: string;
  sectionName: string;
  requestType: string;
  requestedDate: string;
  reason?: string;
  currentAttendance: number;
}

interface PendingCert {
  id: string;
  studentName: string;
  eventTitle: string;
  title: string;
  clubName: string;
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

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [pendingODs, setPendingODs] = useState<PendingODRequest[]>([]);
  const [pendingCerts, setPendingCerts] = useState<PendingCert[]>([]);
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [ttRes, odRes, certRes, chRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: TodayClass[] }>('/api/timetable/today'),
        api.get<{ success: boolean; data: PendingODRequest[] }>('/api/od/pending'),
        api.get<{ success: boolean; data: PendingCert[] }>('/api/certificates/pending'),
        api.get<{ success: boolean; data: ChannelItem[] }>('/api/channels/my'),
      ]);

      if (ttRes.status === 'fulfilled' && ttRes.value?.data) {
        setTodayClasses(ttRes.value.data);
      }
      if (odRes.status === 'fulfilled' && odRes.value?.data) {
        setPendingODs(odRes.value.data);
      }
      if (certRes.status === 'fulfilled' && certRes.value?.data) {
        setPendingCerts(certRes.value.data);
      }
      if (chRes.status === 'fulfilled' && chRes.value?.data) {
        setChannels(chRes.value.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load faculty dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleApproveOD = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await api.patch(`/api/od/${id}/approve`);
      setPendingODs((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRejectOD = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await api.patch(`/api/od/${id}/reject`);
      setPendingODs((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleApproveCert = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await api.patch(`/api/certificates/${id}/approve`);
      setPendingCerts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Certificate approval failed:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const totalPending = pendingODs.length + pendingCerts.length;

  return (
    <div className="space-y-6">
      {/* Hero Greeting Banner */}
      <HeroBanner
        name={user?.name || 'Faculty Member'}
        role={Role.FACULTY}
        quote="The art of teaching is the art of assisting discovery."
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Lectures"
          value={String(todayClasses.length)}
          subtext="Assigned slots"
          icon={BookOpen}
          color="green"
          href="/faculty/classes"
        />
        <StatCard
          label="Pending Approvals"
          value={String(totalPending)}
          subtext="OD, ML & Certificates"
          icon={FileCheck2}
          color="amber"
          href="/faculty/od-ml"
        />
        <StatCard
          label="Mark Attendance"
          value="Ready"
          subtext="Slot-level marking"
          icon={CalendarCheck}
          color="blue"
          href="/faculty/attendance"
        />
        <StatCard
          label="Assessment Marks"
          value="CLA & Finals"
          subtext="Upload gradebook"
          icon={Award}
          color="purple"
          href="/faculty/marks"
        />
      </div>

      {/* Main Grid: Left 2 Cols (Classes & Approvals), Right 1 Col (Actions & Channels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Today&apos;s Teaching Schedule
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Class sections assigned for instruction today
                </p>
              </div>
              <Link href="/faculty/classes">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  All Sections <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {todayClasses.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-gray-50 rounded-xl">
                  No classes scheduled on your timetable for today.
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
                          Room {item.room}
                        </span>
                        <span className="font-medium text-gray-600">
                          Section {item.sectionName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href="/faculty/attendance">
                        <Button
                          size="sm"
                          className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Mark Attendance</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Pending OD & ML Approvals */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Pending OD & Medical Leave Requests ({pendingODs.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Authorized sign-offs credit student attendance records
                </p>
              </div>
              <Link href="/faculty/od-ml">
                <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {pendingODs.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-gray-50 rounded-xl">
                  No pending student OD or Medical Leave requests.
                </div>
              ) : (
                pendingODs.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{item.studentName}</span>
                        <Badge
                          variant="outline"
                          className={
                            item.requestType === 'OD'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]'
                              : 'bg-blue-50 text-blue-800 border-blue-200 text-[10px]'
                          }
                        >
                          {item.requestType}
                        </Badge>
                        <Badge variant={item.currentAttendance >= 75 ? 'present' : 'absent'} className="text-[10px]">
                          Att: {item.currentAttendance}%
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        {item.courseCode} ({item.sectionName}) · Date: {item.requestedDate}
                      </p>
                      {item.reason && <p className="italic text-gray-500">&ldquo;{item.reason}&rdquo;</p>}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading[item.id]}
                        onClick={() => handleRejectOD(item.id)}
                        className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 h-8 gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        size="sm"
                        disabled={actionLoading[item.id]}
                        onClick={() => handleApproveOD(item.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8 gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Pending Certificate Sign-offs */}
          {pendingCerts.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-bold text-gray-900">
                  Pending Club Certificate Approvals ({pendingCerts.length})
                </CardTitle>
                <Link href="/faculty/certificates">
                  <Button variant="ghost" size="sm" className="text-xs text-campus-green-600 hover:text-campus-green-700">
                    Review All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {pendingCerts.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 block">{c.title}</span>
                      <span className="text-gray-500">
                        Recipient: {c.studentName} · Event: {c.eventTitle} ({c.clubName})
                      </span>
                    </div>
                    <Button
                      size="sm"
                      disabled={actionLoading[c.id]}
                      onClick={() => handleApproveCert(c.id)}
                      className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-7 gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
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
                href="/faculty/attendance"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mark Class Attendance</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/faculty/marks"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Upload & Publish Marks</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/faculty/od-ml"
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  <span>Review OD / ML Requests</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/faculty/gcr"
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

          {/* Active Channels */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold text-gray-900">
                Department Channels
              </CardTitle>
              <Link href="/faculty/chats">
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
                    href="/faculty/chats"
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
