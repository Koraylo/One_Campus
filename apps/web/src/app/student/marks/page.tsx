'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Download,
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

export default function StudentMarksPage() {
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedExam, setSelectedExam] = useState('All');

  const marksData = [
    {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      credits: 4,
      internal1: 46,
      internal2: 48,
      assignment: 19,
      endSem: 88,
      maxInternal: 50,
      totalObtained: 92,
      maxTotal: 100,
      grade: 'O',
      status: 'Passed',
    },
    {
      code: 'CS303',
      name: 'Computer Networks',
      credits: 4,
      internal1: 42,
      internal2: 44,
      assignment: 18,
      endSem: 82,
      maxInternal: 50,
      totalObtained: 86,
      maxTotal: 100,
      grade: 'A+',
      status: 'Passed',
    },
    {
      code: 'MA201',
      name: 'Discrete Mathematics',
      credits: 4,
      internal1: 40,
      internal2: 45,
      assignment: 17,
      endSem: 80,
      maxInternal: 50,
      totalObtained: 83,
      maxTotal: 100,
      grade: 'A',
      status: 'Passed',
    },
    {
      code: 'CS305P',
      name: 'Operating Systems Laboratory',
      credits: 2,
      internal1: 48,
      internal2: 49,
      assignment: 20,
      endSem: 94,
      maxInternal: 50,
      totalObtained: 96,
      maxTotal: 100,
      grade: 'O',
      status: 'Passed',
    },
    {
      code: 'HS102',
      name: 'Professional Ethics & Values',
      credits: 2,
      internal1: 44,
      internal2: 46,
      assignment: 19,
      endSem: 85,
      maxInternal: 50,
      totalObtained: 89,
      maxTotal: 100,
      grade: 'A+',
      status: 'Passed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Academic Performance & Marks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Internal assessments, end-semester evaluations, and cumulative GPA reports.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="text-xs h-9 gap-1.5 border-gray-200"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Transcript</span>
        </Button>
      </div>

      {/* GPA Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-campus-green-600 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Cumulative GPA (CGPA)
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">8.84</p>
          <span className="text-[11px] text-emerald-700 font-medium">Top Decile</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-600 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Semester GPA (SGPA)
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">8.92</p>
          <span className="text-[11px] text-blue-700 font-medium">Semester 5</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-600 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Total Credits Earned
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">94</p>
          <span className="text-[11px] text-purple-700 font-medium">Out of 160 required</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Standing Backlogs
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">0</p>
          <span className="text-[11px] text-amber-700 font-medium">Clear Record</span>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Semester:
        </span>
        <div className="flex gap-2">
          {['1', '2', '3', '4', '5'].map((sem) => (
            <Button
              key={sem}
              size="sm"
              variant={selectedSemester === sem ? 'campus' : 'outline'}
              onClick={() => setSelectedSemester(sem)}
              className="h-8 px-3 text-xs"
            >
              Sem {sem}
            </Button>
          ))}
        </div>
      </div>

      {/* Marks Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-900">
            Semester {selectedSemester} Course Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Internal 1 (50)</TableHead>
                <TableHead className="text-center">Internal 2 (50)</TableHead>
                <TableHead className="text-center">Assignment (20)</TableHead>
                <TableHead className="text-center">Final (100)</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marksData.map((row) => (
                <TableRow key={row.code}>
                  <TableCell className="font-semibold text-gray-900">
                    {row.code}
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {row.credits}
                  </TableCell>
                  <TableCell className="text-center text-gray-800">
                    {row.internal1}
                  </TableCell>
                  <TableCell className="text-center text-gray-800">
                    {row.internal2}
                  </TableCell>
                  <TableCell className="text-center text-gray-800">
                    {row.assignment}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-900">
                    {row.totalObtained}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="campus" className="font-bold">
                      {row.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="present" className="text-[10px]">
                      {row.status}
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
