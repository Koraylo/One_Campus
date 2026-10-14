'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  QrCode,
  Users,
  Search,
  Save,
  Check,
  X,
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

export default function ClubAttendancePage() {
  const [selectedEvent, setSelectedEvent] = useState('Hackathon 2026: Code for Green');
  const [search, setSearch] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [attendees, setAttendees] = useState([
    {
      id: 'a1',
      rollNo: '22CS001',
      name: 'Aarav Sharma',
      dept: 'Computer Science',
      checkedIn: true,
      checkInTime: '08:52 AM',
    },
    {
      id: 'a2',
      rollNo: '22CS015',
      name: 'Aditya Rao',
      dept: 'Computer Science',
      checkedIn: true,
      checkInTime: '09:05 AM',
    },
    {
      id: 'a3',
      rollNo: '22EC034',
      name: 'Divya Nambiar',
      dept: 'Electronics',
      checkedIn: false,
      checkInTime: '-',
    },
    {
      id: 'a4',
      rollNo: '22IT045',
      name: 'Siddharth Menon',
      dept: 'Information Tech',
      checkedIn: true,
      checkInTime: '09:14 AM',
    },
    {
      id: 'a5',
      rollNo: '23CS012',
      name: 'Tanvi Agarwal',
      dept: 'Computer Science',
      checkedIn: false,
      checkInTime: '-',
    },
  ]);

  const toggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              checkedIn: !a.checkedIn,
              checkInTime: !a.checkedIn
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '-',
            }
          : a
      )
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const total = attendees.length;
  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const percentage = Math.round((checkedInCount / total) * 100);

  const filtered = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.rollNo.toLowerCase().includes(search.toLowerCase())
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
            Verify on-ground physical presence of students to qualify for certificates and OD.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs h-9 gap-1.5 border-gray-200"
            onClick={() => alert('Launching camera scanner for digital entry passes...')}
          >
            <QrCode className="w-3.5 h-3.5 text-campus-green-600" />
            <span>Scan Student QR</span>
          </Button>

          <Button
            onClick={handleSave}
            className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lock Attendance</span>
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Event check-in roster recorded and synchronized with OD system.</span>
          </div>
        </div>
      )}

      {/* Control Bar & Live Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 md:col-span-3 border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Active Event Session
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600 font-medium"
            >
              <option value="Hackathon 2026: Code for Green">Hackathon 2026: Code for Green</option>
              <option value="Next.js 14 Workshop">Next.js 14 Workshop</option>
            </select>
          </div>

          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Search Participant
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-gray-50 text-xs"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200 shadow-xs bg-emerald-50/70 border-emerald-200 flex flex-col justify-center text-center">
          <span className="text-xs font-semibold text-emerald-800 uppercase">
            Live Check-In Rate
          </span>
          <span className="text-2xl font-bold text-emerald-900 mt-0.5">
            {checkedInCount} / {total} ({percentage}%)
          </span>
        </Card>
      </div>

      {/* Attendance Check-in Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Check-In Time</TableHead>
                <TableHead className="text-center">Check-In Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((att) => (
                <TableRow key={att.id}>
                  <TableCell className="font-mono font-bold text-gray-900">
                    {att.rollNo}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {att.name}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {att.dept}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-gray-500">
                    {att.checkInTime}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={att.checkedIn ? 'present' : 'absent'}
                      className="text-[10px]"
                    >
                      {att.checkedIn ? 'Present at Venue' : 'Not Checked In'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={att.checkedIn ? 'outline' : 'campus'}
                      onClick={() => toggleCheckIn(att.id)}
                      className="text-xs h-8"
                    >
                      {att.checkedIn ? 'Mark Absent' : 'Check In'}
                    </Button>
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
