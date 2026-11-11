'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DonutChart } from '@/components/charts/DonutChart';
import { api } from '@/lib/api';

interface SectionAttendanceSummary {
  sectionId: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
  facultyName: string;
  slot: string;
  total: number;
  present: number;
  absent: number;
  od: number;
  ml: number;
  percentage: number;
  margin: number;
}

interface StudentAttendanceOverview {
  overall: {
    total: number;
    present: number;
    absent: number;
    od: number;
    ml: number;
    percentage: number;
  };
  sections: SectionAttendanceSummary[];
}

interface StudentODRequest {
  id: string;
  sectionId: string;
  sectionName: string;
  courseCode: string;
  courseName: string;
  eventId?: string;
  eventName?: string;
  requestType: string;
  requestedDate: string;
  reason?: string;
  status: string;
  approverName?: string;
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  clubName?: string;
}

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<StudentAttendanceOverview | null>(null);
  const [requests, setRequests] = useState<StudentODRequest[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [requestType, setRequestType] = useState<'OD' | 'ML'>('OD');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [attRes, odRes, eventsRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: StudentAttendanceOverview }>('/api/attendance/my'),
        api.get<{ success: boolean; data: StudentODRequest[] }>('/api/od/my'),
        api.get<{ success: boolean; data: EventItem[] }>('/api/events'),
      ]);

      if (attRes.status === 'fulfilled' && attRes.value?.data) {
        setOverview(attRes.value.data);
        if (attRes.value.data.sections.length > 0 && !selectedSectionId) {
          setSelectedSectionId(attRes.value.data.sections[0].sectionId);
        }
      }

      if (odRes.status === 'fulfilled' && odRes.value?.data) {
        setRequests(odRes.value.data);
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
        setEvents(eventsRes.value.data);
        if (eventsRes.value.data.length > 0 && !selectedEventId) {
          setSelectedEventId(eventsRes.value.data[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  }, [selectedSectionId, selectedEventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId || !requestDate) {
      setSubmitError('Please select a course section and date.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      if (requestType === 'OD') {
        await api.post('/api/od/request', {
          sectionIds: [selectedSectionId],
          requestedDate: requestDate,
          eventId: selectedEventId || undefined,
          reason,
        });
      } else {
        await api.post('/api/od/ml-request', {
          sectionIds: [selectedSectionId],
          requestedDate: requestDate,
          reason,
        });
      }

      setSubmitSuccess(true);
      await fetchData();

      setTimeout(() => {
        setSubmitSuccess(false);
        setOpenApplyDialog(false);
        setReason('');
        setRequestDate('');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const overall = overview?.overall || {
    total: 0,
    present: 0,
    absent: 0,
    od: 0,
    ml: 0,
    percentage: 0,
  };

  const sections = overview?.sections || [];

  const chartData = [
    { name: 'Present', value: overall.present, color: '#16a34a' },
    { name: 'Absent', value: overall.absent, color: '#dc2626' },
    { name: 'OD', value: overall.od, color: '#d97706' },
    { name: 'ML', value: overall.ml, color: '#2563eb' },
  ];

  const isSafe = overall.percentage >= 75;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Attendance Records
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor per-subject attendance percentages, margin to 75%, and submit OD/ML applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Dialog open={openApplyDialog} onOpenChange={setOpenApplyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2">
                <Plus className="w-4 h-4" />
                <span>Apply for OD / ML</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Leave / On-Duty Request</DialogTitle>
              </DialogHeader>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-gray-900">Request Submitted!</h3>
                  <p className="text-xs text-muted-foreground">
                    Your request has been forwarded to the reviewing faculty.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 pt-2">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Request Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={requestType === 'OD' ? 'campus' : 'outline'}
                        onClick={() => setRequestType('OD')}
                        className="text-xs h-9"
                      >
                        On-Duty (OD)
                      </Button>
                      <Button
                        type="button"
                        variant={requestType === 'ML' ? 'campus' : 'outline'}
                        onClick={() => setRequestType('ML')}
                        className="text-xs h-9"
                      >
                        Medical Leave (ML)
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Affected Course Section
                    </label>
                    <select
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                      required
                    >
                      {sections.map((s) => (
                        <option key={s.sectionId} value={s.sectionId}>
                          {s.courseCode} · {s.courseName} ({s.sectionName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {requestType === 'OD' && events.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase text-gray-700">
                        Linked Event (Optional)
                      </label>
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                      >
                        <option value="">None / General Event</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.date})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Date of Absence
                    </label>
                    <Input
                      type="date"
                      required
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Reason / Justification
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide details about the hackathon, conference, or medical justification..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenApplyDialog(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-campus-green-950 hover:bg-campus-green-800 text-white"
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 shadow-sm flex flex-col justify-center items-center p-6">
          <DonutChart
            data={chartData}
            centerValue={`${overall.percentage}%`}
            centerLabel="Total Attendance"
            height={200}
            innerRadius={55}
            outerRadius={75}
          />
        </Card>

        <Card className="border-gray-200 shadow-sm md:col-span-2 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-semibold text-gray-800 text-sm">
                Aggregate Campus Attendance
              </span>
              <Badge variant={isSafe ? 'present' : 'absent'} className="text-xs">
                {isSafe ? 'In Safe Zone (≥ 75%)' : 'Attendance Shortage (< 75%)'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-xs font-medium text-emerald-800 block">Present</span>
                <span className="text-2xl font-bold text-emerald-700">{overall.present}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                <span className="text-xs font-medium text-rose-800 block">Absent</span>
                <span className="text-2xl font-bold text-rose-700">{overall.absent}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <span className="text-xs font-medium text-amber-800 block">On-Duty (OD)</span>
                <span className="text-2xl font-bold text-amber-700">{overall.od}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <span className="text-xs font-medium text-blue-800 block">Medical Leave</span>
                <span className="text-2xl font-bold text-blue-700">{overall.ml}</span>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-campus-green-600 shrink-0 mt-0.5" />
              <span>
                University policy mandates 75% attendance for exam eligibility. Approved OD (events/sports) and ML (certified health leaves) dynamically credit back into your attendance record.
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Course Breakdown Table with Margin Indicators (ATT-4) */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Course-Wise Breakdown & Margin to 75%
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Margin indicates the number of upcoming classes you can miss or must attend to stay at or above 75%.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">OD / ML</TableHead>
                <TableHead className="text-center">Attendance %</TableHead>
                <TableHead className="text-center">Margin to 75%</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-sm text-muted-foreground">
                    No enrolled class sections found.
                  </TableCell>
                </TableRow>
              ) : (
                sections.map((c) => {
                  const isShort = c.percentage < 75;
                  return (
                    <TableRow key={c.sectionId}>
                      <TableCell className="font-semibold text-gray-900">
                        {c.courseCode}
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {c.courseName}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {c.facultyName}
                      </TableCell>
                      <TableCell className="text-center font-medium">{c.total}</TableCell>
                      <TableCell className="text-center text-emerald-700 font-semibold">{c.present}</TableCell>
                      <TableCell className="text-center text-rose-700 font-semibold">{c.absent}</TableCell>
                      <TableCell className="text-center text-amber-700 font-medium">
                        {c.od + c.ml}
                      </TableCell>
                      <TableCell className="text-center font-bold text-gray-900">
                        {c.percentage}%
                      </TableCell>
                      <TableCell className="text-center">
                        {c.margin > 0 ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            +{c.margin} safe to miss
                          </span>
                        ) : c.margin < 0 ? (
                          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            Must attend {Math.abs(c.margin)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 font-medium">On the threshold</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={isShort ? 'absent' : 'present'} className="text-[10px]">
                          {isShort ? 'Attendance Shortage' : 'Satisfactory'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student's OD & ML Applications History */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-900">
            My OD & Medical Leave Applications ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Absence Date</TableHead>
                <TableHead>Reason / Event</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                    No OD or ML requests submitted yet. Use the &quot;Apply for OD / ML&quot; button above.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          req.requestType === 'OD'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]'
                            : 'bg-blue-50 text-blue-800 border-blue-200 text-[10px]'
                        }
                      >
                        {req.requestType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-xs text-gray-900">
                      {req.courseCode} ({req.sectionName})
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {req.requestedDate}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-xs truncate">
                      {req.eventName ? `${req.eventName}: ` : ''}{req.reason || 'No description provided'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {req.approverName || 'Under Review'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
                            : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
