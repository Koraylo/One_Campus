'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Users,
  Search,
  Save,
  Check,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { api } from '@/lib/api';

interface ClubEventItem {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface EventRegistrationItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department?: string;
  year?: number;
  attended: boolean;
}

export default function ClubAttendancePage() {
  const [events, setEvents] = useState<ClubEventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendees, setAttendees] = useState<EventRegistrationItem[]>([]);
  const [search, setSearch] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Fetch club and events
  useEffect(() => {
    async function fetchClubEvents() {
      try {
        setLoadingEvents(true);
        const clubRes = await api.get<{ success: boolean; data: { id: string } }>('/api/clubs/my');
        if (clubRes.data) {
          const evRes = await api.get<{ success: boolean; data: ClubEventItem[] }>(`/api/events?clubId=${clubRes.data.id}`);
          if (evRes.data && evRes.data.length > 0) {
            setEvents(evRes.data);
            setSelectedEventId(evRes.data[0].id);
          }
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Failed to fetch club events.' });
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchClubEvents();
  }, []);

  // 2. Fetch event registrations
  const fetchRegistrations = useCallback(async () => {
    if (!selectedEventId) return;
    try {
      setLoadingAttendees(true);
      const res = await api.get<{
        success: boolean;
        data: Array<{
          id: string;
          studentId: string;
          attended: boolean;
          student: {
            id: string;
            name: string;
            email: string;
            department?: string;
            year?: number;
          };
        }>;
      }>(`/api/events/${selectedEventId}/registrations`);

      if (res.data) {
        setAttendees(
          res.data.map((r) => ({
            id: r.id,
            studentId: r.studentId,
            studentName: r.student?.name || 'Student',
            studentEmail: r.student?.email || '',
            department: r.student?.department || 'Engineering',
            year: r.student?.year || 3,
            attended: r.attended,
          }))
        );
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to load attendees.' });
    } finally {
      setLoadingAttendees(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const toggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, attended: !a.attended } : a))
    );
  };

  const handleSave = async () => {
    if (!selectedEventId) return;
    const attendedRegIds = attendees.filter((a) => a.attended).map((a) => a.id);

    try {
      setSaving(true);
      await api.patch(`/api/events/${selectedEventId}/attendance`, {
        registrationIds: attendedRegIds,
      });

      setSavedSuccess(true);
      setNotification({
        type: 'success',
        message: `Saved attendance! ${attendedRegIds.length} students marked as attended.`,
      });
      setTimeout(() => {
        setSavedSuccess(false);
        setNotification(null);
      }, 3500);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save attendance.' });
    } finally {
      setSaving(false);
    }
  };

  const total = attendees.length;
  const checkedInCount = attendees.filter((a) => a.attended).length;
  const percentage = total > 0 ? Math.round((checkedInCount / total) * 100) : 0;

  const filtered = attendees.filter(
    (a) =>
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.studentEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Event Participant Attendance
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Mark participant presence for your club events to validate official OD applications and certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRegistrations}
            disabled={loadingAttendees}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendees ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving || attendees.length === 0}
            className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </Button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Control Bar */}
      <Card className="p-4 border-gray-200 shadow-xs bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Select Club Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
              disabled={loadingEvents}
            >
              {events.length === 0 ? (
                <option value="">No events found</option>
              ) : (
                events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.date})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Search Registrants
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search attendee by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-800 block">Attended Participants</span>
            <span className="text-2xl font-bold text-emerald-700">{checkedInCount}</span>
          </div>
          <Check className="w-6 h-6 text-emerald-500 opacity-60" />
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-700 block">Total Registered</span>
            <span className="text-2xl font-bold text-gray-900">{total}</span>
          </div>
          <Users className="w-6 h-6 text-gray-400 opacity-60" />
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-blue-800 block">Turnout Rate</span>
            <span className="text-2xl font-bold text-blue-700">{percentage}%</span>
          </div>
          <CalendarCheck className="w-6 h-6 text-blue-500 opacity-60" />
        </div>
      </div>

      {/* Registrations Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Event Registration Roster ({attendees.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggle attended status for each student.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAttendees ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                    Loading event registrations...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                    No registrations found for this event.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-semibold text-gray-900">
                      {att.studentName}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {att.studentEmail}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {att.department}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={att.attended ? 'present' : 'absent'}
                        className="text-[10px]"
                      >
                        {att.attended ? 'Attended' : 'Not Present'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={att.attended ? 'outline' : 'default'}
                        onClick={() => toggleCheckIn(att.id)}
                        className={`text-xs h-8 gap-1 ${
                          att.attended
                            ? 'text-rose-700 border-rose-200 hover:bg-rose-50'
                            : 'bg-campus-green-950 hover:bg-campus-green-800 text-white'
                        }`}
                      >
                        {att.attended ? (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Attended</span>
                          </>
                        )}
                      </Button>
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
