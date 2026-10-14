'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Save,
  Users,
  Check,
  X,
  AlertCircle,
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

interface StudentAttendanceRow {
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

export default function FacultyAttendancePage() {
  const [selectedSection, setSelectedSection] = useState('CS301-A');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState('09:00 - 10:00 AM');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [roster, setRoster] = useState<StudentAttendanceRow[]>([
    { rollNo: '22CS001', name: 'Aarav Sharma', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS015', name: 'Aditya Rao', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS028', name: 'Ananya Deshmukh', status: AttendanceStatus.ABSENT },
    { rollNo: '22CS034', name: 'Devendra Joshi', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS042', name: 'Karthik Raja', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS059', name: 'Megha Iyer', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS071', name: 'Naveen Kumar', status: AttendanceStatus.OD },
    { rollNo: '22CS084', name: 'Rohit Verma', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS095', name: 'Sanya Mirza', status: AttendanceStatus.PRESENT },
    { rollNo: '22CS112', name: 'Priya Sundaram', status: AttendanceStatus.ML },
  ]);

  const updateStatus = (rollNo: string, newStatus: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((r) => (r.rollNo === rollNo ? { ...r, status: newStatus } : r))
    );
  };

  const markAllPresent = () => {
    setRoster((prev) =>
      prev.map((r) => ({ ...r, status: AttendanceStatus.PRESENT }))
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
  };

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
            Select section and period slot, then toggle attendance states for registered students.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            disabled={saving}
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
            <span>Attendance for {selectedSection} ({selectedSlot}) submitted and stored successfully.</span>
          </div>
        </div>
      )}

      {/* Control Bar: Section, Date, Slot */}
      <Card className="p-4 border-gray-200 shadow-xs bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Assigned Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600 font-medium"
            >
              <option value="CS301-A">CS301 - Sec A (Data Structures)</option>
              <option value="CS301-B">CS301 - Sec B (Data Structures)</option>
              <option value="CS402-A">CS402 - Advanced Algorithms Lab</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Class Date
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
              Period Slot
            </label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600 font-medium"
            >
              <option value="09:00 - 10:00 AM">Slot 1: 09:00 - 10:00 AM</option>
              <option value="10:15 - 11:15 AM">Slot 2: 10:15 - 11:15 AM</option>
              <option value="11:30 - 12:30 PM">Slot 3: 11:30 - 12:30 PM</option>
              <option value="02:00 - 04:00 PM">Lab Slot: 02:00 - 04:00 PM</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Attendance Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
          <span className="text-xs text-emerald-800 font-semibold uppercase">Present</span>
          <span className="text-2xl font-bold text-emerald-700 block">{presentCount}</span>
        </div>
        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center">
          <span className="text-xs text-rose-800 font-semibold uppercase">Absent</span>
          <span className="text-2xl font-bold text-rose-700 block">{absentCount}</span>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
          <span className="text-xs text-amber-800 font-semibold uppercase">On-Duty (OD)</span>
          <span className="text-2xl font-bold text-amber-700 block">{odCount}</span>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
          <span className="text-xs text-blue-800 font-semibold uppercase">Medical (ML)</span>
          <span className="text-2xl font-bold text-blue-700 block">{mlCount}</span>
        </div>
      </div>

      {/* Roster Attendance Marking Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Current Status</TableHead>
                <TableHead className="text-right">Set Attendance State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((student) => (
                <TableRow key={student.rollNo}>
                  <TableCell className="font-mono font-bold text-gray-900">
                    {student.rollNo}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        student.status === AttendanceStatus.PRESENT
                          ? 'present'
                          : student.status === AttendanceStatus.ABSENT
                          ? 'absent'
                          : student.status === AttendanceStatus.OD
                          ? 'od'
                          : 'ml'
                      }
                      className="text-xs font-semibold px-2.5"
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 gap-0.5">
                      <Button
                        type="button"
                        size="sm"
                        variant={student.status === AttendanceStatus.PRESENT ? 'campus' : 'ghost'}
                        onClick={() => updateStatus(student.rollNo, AttendanceStatus.PRESENT)}
                        className="h-7 px-2.5 text-xs font-medium"
                      >
                        P
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={student.status === AttendanceStatus.ABSENT ? 'destructive' : 'ghost'}
                        onClick={() => updateStatus(student.rollNo, AttendanceStatus.ABSENT)}
                        className="h-7 px-2.5 text-xs font-medium"
                      >
                        A
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={student.status === AttendanceStatus.OD ? 'secondary' : 'ghost'}
                        onClick={() => updateStatus(student.rollNo, AttendanceStatus.OD)}
                        className={`h-7 px-2.5 text-xs font-medium ${
                          student.status === AttendanceStatus.OD ? 'bg-amber-100 text-amber-800' : ''
                        }`}
                      >
                        OD
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={student.status === AttendanceStatus.ML ? 'secondary' : 'ghost'}
                        onClick={() => updateStatus(student.rollNo, AttendanceStatus.ML)}
                        className={`h-7 px-2.5 text-xs font-medium ${
                          student.status === AttendanceStatus.ML ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                      >
                        ML
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
