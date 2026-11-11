'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Save,
  Users,
  Check,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { AttendanceStatus } from '@koraylo/shared';
import { api } from '@/lib/api';

interface FacultySection {
  id: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
  slot: string;
  room: string;
}

interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  department?: string;
  year?: number;
  section?: string;
  status: AttendanceStatus | null;
}

export default function FacultyAttendancePage() {
  const [sections, setSections] = useState<FacultySection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [roster, setRoster] = useState<StudentRosterItem[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch faculty sections
  useEffect(() => {
    async function fetchSections() {
      try {
        setLoadingSections(true);
        const res = await api.get<{ success: boolean; data: FacultySection[] }>('/api/timetable/my');
        if (res.data && res.data.length > 0) {
          setSections(res.data);
          setSelectedSectionId(res.data[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load faculty sections.');
      } finally {
        setLoadingSections(false);
      }
    }
    fetchSections();
  }, []);

  // 2. Fetch section roster for chosen date
  const fetchRoster = useCallback(async () => {
    if (!selectedSectionId) return;
    try {
      setLoadingRoster(true);
      setError(null);
      const res = await api.get<{
        success: boolean;
        data: {
          section: any;
          date: string;
          students: StudentRosterItem[];
        };
      }>(`/api/attendance/section/${selectedSectionId}/students?date=${selectedDate}`);

      if (res.data?.students) {
        setRoster(
          res.data.students.map((s) => ({
            ...s,
            status: s.status || AttendanceStatus.PRESENT,
          }))
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load section students.');
    } finally {
      setLoadingRoster(false);
    }
  }, [selectedSectionId, selectedDate]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const updateStatus = (studentId: string, newStatus: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((r) => (r.id === studentId ? { ...r, status: newStatus } : r))
    );
  };

  const markAllPresent = () => {
    setRoster((prev) =>
      prev.map((r) => ({ ...r, status: AttendanceStatus.PRESENT }))
    );
  };

  const handleSave = async () => {
    if (!selectedSectionId || roster.length === 0) return;
    try {
      setSaving(true);
      setError(null);
      const records = roster.map((s) => ({
        studentId: s.id,
        status: s.status || AttendanceStatus.PRESENT,
      }));

      const res = await api.post('/api/attendance/mark', {
        sectionId: selectedSectionId,
        date: selectedDate,
        records,
      });

      setStatusMessage(res.message || `Successfully marked attendance for ${records.length} students.`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const selectedSectionObj = sections.find((s) => s.id === selectedSectionId);

  const presentCount = roster.filter((r) => r.status === AttendanceStatus.PRESENT).length;
  const absentCount = roster.filter((r) => r.status === AttendanceStatus.ABSENT).length;
  const odCount = roster.filter((r) => r.status === AttendanceStatus.OD).length;
  const mlCount = roster.filter((r) => r.status === AttendanceStatus.ML).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Record Class Attendance
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select section and date, then toggle attendance states for registered students and submit to institutional records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchRoster}
            disabled={loadingRoster}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRoster ? 'animate-spin' : ''}`} />
            <span>Reload Roster</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markAllPresent}
            className="text-xs h-9 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
          >
            Mark All Present
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || roster.length === 0}
            className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Submit Attendance'}</span>
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{statusMessage || 'Attendance submitted successfully! Records synchronized to database.'}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-gray-700">
                Class Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                disabled={loadingSections}
              >
                {sections.length === 0 ? (
                  <option value="">No sections assigned</option>
                ) : (
                  sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.courseCode} · {s.courseName} ({s.sectionName})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-gray-700">
                Attendance Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-gray-700">
                Slot & Room
              </label>
              <div className="h-10 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <span>
                  {selectedSectionObj ? `${selectedSectionObj.slot} · ${selectedSectionObj.room}` : '—'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-800 block">Present</span>
            <span className="text-2xl font-bold text-emerald-700">{presentCount}</span>
          </div>
          <Check className="w-6 h-6 text-emerald-500 opacity-60" />
        </div>

        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-rose-800 block">Absent</span>
            <span className="text-2xl font-bold text-rose-700">{absentCount}</span>
          </div>
          <X className="w-6 h-6 text-rose-500 opacity-60" />
        </div>

        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-800 block">On-Duty (OD)</span>
            <span className="text-2xl font-bold text-amber-700">{odCount}</span>
          </div>
          <CalendarCheck className="w-6 h-6 text-amber-500 opacity-60" />
        </div>

        <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-blue-800 block">Medical Leave (ML)</span>
            <span className="text-2xl font-bold text-blue-700">{mlCount}</span>
          </div>
          <Users className="w-6 h-6 text-blue-500 opacity-60" />
        </div>
      </div>

      {/* Roster Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Student Roster ({roster.length} enrolled)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click status pills to mark attendance for {selectedDate}.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email / Identifier</TableHead>
                <TableHead>Department / Year</TableHead>
                <TableHead className="text-right">Attendance Marking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRoster ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    Loading section roster...
                  </TableCell>
                </TableRow>
              ) : roster.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    No students enrolled in this section.
                  </TableCell>
                </TableRow>
              ) : (
                roster.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold text-gray-900">
                      {s.name}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {s.email}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {s.department || 'CSE'} · Year {s.year || 3} ({s.section || 'A'})
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateStatus(s.id, AttendanceStatus.PRESENT)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                            s.status === AttendanceStatus.PRESENT
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(s.id, AttendanceStatus.ABSENT)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                            s.status === AttendanceStatus.ABSENT
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(s.id, AttendanceStatus.OD)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                            s.status === AttendanceStatus.OD
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          OD
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(s.id, AttendanceStatus.ML)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                            s.status === AttendanceStatus.ML
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          ML
                        </button>
                      </div>
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
