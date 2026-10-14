'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
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

export default function ClubRegistrationsPage() {
  const [selectedEvent, setSelectedEvent] = useState('Hackathon 2026: Code for Green');
  const [search, setSearch] = useState('');

  const [registrations] = useState([
    {
      id: 'reg-1',
      rollNo: '22CS001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      dept: 'Computer Science',
      year: 'Year 3',
      registeredAt: 'Oct 12, 2026 · 11:20 AM',
      attended: true,
    },
    {
      id: 'reg-2',
      rollNo: '22CS015',
      name: 'Aditya Rao',
      email: 'aditya.rao@campus.edu',
      dept: 'Computer Science',
      year: 'Year 3',
      registeredAt: 'Oct 12, 2026 · 02:45 PM',
      attended: true,
    },
    {
      id: 'reg-3',
      rollNo: '22EC034',
      name: 'Divya Nambiar',
      email: 'divya.n@campus.edu',
      dept: 'Electronics',
      year: 'Year 2',
      registeredAt: 'Oct 13, 2026 · 09:10 AM',
      attended: false,
    },
    {
      id: 'reg-4',
      rollNo: '22IT045',
      name: 'Siddharth Menon',
      email: 'siddharth.m@campus.edu',
      dept: 'Information Tech',
      year: 'Year 3',
      registeredAt: 'Oct 13, 2026 · 04:15 PM',
      attended: true,
    },
    {
      id: 'reg-5',
      rollNo: '23CS012',
      name: 'Tanvi Agarwal',
      email: 'tanvi.a@campus.edu',
      dept: 'Computer Science',
      year: 'Year 2',
      registeredAt: 'Oct 14, 2026 · 10:05 AM',
      attended: true,
    },
  ]);

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      r.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Event Registrations Roster
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View registered participants, verify eligibility, and export attendee lists.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => alert('Exporting registration list to CSV / Excel...')}
          className="text-xs h-9 gap-1.5 border-gray-200"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-campus-green-600" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Control Bar: Event Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Event:
          </span>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600 font-medium"
          >
            <option value="Hackathon 2026: Code for Green">Hackathon 2026: Code for Green</option>
            <option value="Next.js 14 Workshop">Next.js 14 Workshop</option>
            <option value="Cloud DevOps Symposium">Cloud DevOps Symposium</option>
          </select>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search by name, roll no, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-gray-50 text-sm"
          />
        </div>
      </div>

      {/* Registrations Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Participant Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Registration Time</TableHead>
                <TableHead className="text-right">Attendance Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-mono font-bold text-gray-900">
                    {reg.rollNo}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {reg.name}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {reg.dept}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {reg.year}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {reg.registeredAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={reg.attended ? 'present' : 'outline'}
                      className="text-[10px]"
                    >
                      {reg.attended ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Attended
                        </>
                      ) : (
                        'Registered'
                      )}
                    </Badge>
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
