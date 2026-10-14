'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Mail,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
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

export default function FacultyStudentsPage() {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');

  const students = [
    {
      rollNo: '22CS001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      section: 'Section A',
      course: 'CS301',
      attendance: 90,
      internalMarks: '47/50',
      status: 'Safe',
    },
    {
      rollNo: '22CS015',
      name: 'Aditya Rao',
      email: 'aditya.rao@campus.edu',
      section: 'Section A',
      course: 'CS301',
      attendance: 78,
      internalMarks: '39/50',
      status: 'Safe',
    },
    {
      rollNo: '22CS028',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@campus.edu',
      section: 'Section A',
      course: 'CS301',
      attendance: 71,
      internalMarks: '32/50',
      status: 'At Risk',
    },
    {
      rollNo: '22CS042',
      name: 'Karthik Raja',
      email: 'karthik.r@campus.edu',
      section: 'Section B',
      course: 'CS301-B',
      attendance: 88,
      internalMarks: '45/50',
      status: 'Safe',
    },
    {
      rollNo: '22CS059',
      name: 'Megha Iyer',
      email: 'megha.iyer@campus.edu',
      section: 'Section B',
      course: 'CS301-B',
      attendance: 94,
      internalMarks: '49/50',
      status: 'Safe',
    },
    {
      rollNo: '22CS084',
      name: 'Rohit Verma',
      email: 'rohit.v@campus.edu',
      section: 'Section B',
      course: 'CS301-B',
      attendance: 68,
      internalMarks: '28/50',
      status: 'At Risk',
    },
  ];

  const filtered = students.filter((s) => {
    const matchesSection =
      selectedSection === 'All' || s.section === selectedSection;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Student Roster
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor individual student performance, attendance compliance, and contact details.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => alert('Exporting roster to Excel / CSV...')}
          className="text-xs h-9 gap-1.5 border-gray-200"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export Roster (CSV)</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search by name, roll number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-gray-50 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Section A', 'Section B'].map((sec) => (
            <Button
              key={sec}
              variant={selectedSection === sec ? 'campus' : 'outline'}
              size="sm"
              onClick={() => setSelectedSection(sec)}
              className="text-xs h-8"
            >
              {sec}
            </Button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Campus Email</TableHead>
                <TableHead>Section</TableHead>
                <TableHead className="text-center">Attendance %</TableHead>
                <TableHead className="text-center">Internal Avg</TableHead>
                <TableHead className="text-right">Academic Standing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.rollNo}>
                  <TableCell className="font-mono font-bold text-gray-900">
                    {s.rollNo}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {s.name}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {s.email}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {s.section}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    <span
                      className={
                        s.attendance < 75 ? 'text-rose-600' : 'text-emerald-700'
                      }
                    >
                      {s.attendance}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-medium text-gray-700">
                    {s.internalMarks}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={s.status === 'Safe' ? 'present' : 'absent'}
                      className="text-[10px]"
                    >
                      {s.status === 'Safe' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Satisfactory
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" /> Below 75%
                        </>
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
