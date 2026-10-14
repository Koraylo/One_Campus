'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  AlertCircle,
  Plus,
  CheckCircle2,
  FileText,
  Clock,
  Filter,
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
import { AttendanceStatus } from '@koraylo/shared';

export default function StudentAttendancePage() {
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [requestType, setRequestType] = useState<'OD' | 'ML'>('OD');
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [requestDate, setRequestDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      faculty: 'Prof. R. Ramanujan',
      total: 30,
      present: 27,
      absent: 2,
      od: 1,
      ml: 0,
      percentage: 90,
    },
    {
      code: 'CS303',
      name: 'Computer Networks',
      faculty: 'Dr. Anita Sharma',
      total: 28,
      present: 24,
      absent: 3,
      od: 1,
      ml: 0,
      percentage: 85.7,
    },
    {
      code: 'MA201',
      name: 'Discrete Mathematics',
      faculty: 'Prof. K. Venkatesh',
      total: 26,
      present: 20,
      absent: 5,
      od: 0,
      ml: 1,
      percentage: 76.9,
    },
    {
      code: 'CS305P',
      name: 'Operating Systems Laboratory',
      faculty: 'Dr. P. Subramanian',
      total: 12,
      present: 11,
      absent: 1,
      od: 0,
      ml: 0,
      percentage: 91.7,
    },
    {
      code: 'HS102',
      name: 'Professional Ethics & Values',
      faculty: 'Dr. Meera Nambiar',
      total: 14,
      present: 13,
      absent: 1,
      od: 0,
      ml: 0,
      percentage: 92.8,
    },
  ];

  const overallPresent = courses.reduce((a, b) => a + b.present, 0);
  const overallAbsent = courses.reduce((a, b) => a + b.absent, 0);
  const overallOD = courses.reduce((a, b) => a + b.od, 0);
  const overallML = courses.reduce((a, b) => a + b.ml, 0);
  const overallTotal = courses.reduce((a, b) => a + b.total, 0);
  const overallPercentage = Math.round(((overallPresent + overallOD) / overallTotal) * 100);

  const chartData = [
    { name: 'Present', value: overallPresent, color: '#16a34a' },
    { name: 'Absent', value: overallAbsent, color: '#dc2626' },
    { name: 'OD', value: overallOD, color: '#d97706' },
    { name: 'ML', value: overallML, color: '#2563eb' },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpenApplyDialog(false);
      setReason('');
      setRequestDate('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Attendance Records
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor per-subject attendance percentages and submit OD/ML applications.
          </p>
        </div>

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

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900">Request Submitted!</h3>
                <p className="text-xs text-muted-foreground">
                  Your request has been forwarded to the faculty coordinator.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 pt-2">
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
                    Course Section
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                    Reason / Event Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about the hackathon, symposium, or medical condition..."
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
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-campus-green-950 hover:bg-campus-green-800 text-white"
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 shadow-sm flex flex-col justify-center items-center p-6">
          <DonutChart
            data={chartData}
            centerValue={`${overallPercentage}%`}
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
                Attendance Policy Status
              </span>
              <Badge variant="present" className="text-xs">
                In Safe Zone (≥ 75%)
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-xs font-medium text-emerald-800 block">Present</span>
                <span className="text-2xl font-bold text-emerald-700">{overallPresent}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                <span className="text-xs font-medium text-rose-800 block">Absent</span>
                <span className="text-2xl font-bold text-rose-700">{overallAbsent}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <span className="text-xs font-medium text-amber-800 block">On-Duty (OD)</span>
                <span className="text-2xl font-bold text-amber-700">{overallOD}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <span className="text-xs font-medium text-blue-800 block">Medical Leave</span>
                <span className="text-2xl font-bold text-blue-700">{overallML}</span>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-campus-green-600 shrink-0 mt-0.5" />
              <span>
                University ordinance requires a minimum aggregate attendance of 75% in each course to be eligible for end-semester examinations. Approved OD and ML credits count towards attendance.
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Course Breakdown Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-900">
            Course-Wise Attendance Breakdown
          </CardTitle>
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
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => {
                const isShort = c.percentage < 75;
                return (
                  <TableRow key={c.code}>
                    <TableCell className="font-semibold text-gray-900">
                      {c.code}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {c.name}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {c.faculty}
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
                    <TableCell className="text-right">
                      <Badge variant={isShort ? 'absent' : 'present'} className="text-[10px]">
                        {isShort ? 'Low Attendance' : 'Satisfactory'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
