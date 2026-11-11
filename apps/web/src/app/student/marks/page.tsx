'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Award,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  BookOpen,
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
import { api } from '@/lib/api';

interface RawMarkItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  examType: string;
  marks: number;
  maxMarks: number;
}

interface CourseMarksSummary {
  courseCode: string;
  courseName: string;
  cla1?: { marks: number; maxMarks: number };
  cla2?: { marks: number; maxMarks: number };
  endSem?: { marks: number; maxMarks: number };
  totalMarks: number;
  maxTotal: number;
  percentage: number;
  grade: string;
  status: string;
}

function calculateGrade(percentage: number): { grade: string; status: string } {
  if (percentage >= 90) return { grade: 'O', status: 'Outstanding' };
  if (percentage >= 80) return { grade: 'A+', status: 'Excellent' };
  if (percentage >= 70) return { grade: 'A', status: 'Very Good' };
  if (percentage >= 60) return { grade: 'B+', status: 'Good' };
  if (percentage >= 50) return { grade: 'B', status: 'Pass' };
  return { grade: 'F', status: 'Reappear' };
}

export default function StudentMarksPage() {
  const [loading, setLoading] = useState(true);
  const [rawMarks, setRawMarks] = useState<RawMarkItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ success: boolean; data: RawMarkItem[] }>('/api/marks/my');
      if (res.data) {
        setRawMarks(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load examination marks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  // Group raw marks by course
  const courseMap = new Map<string, CourseMarksSummary>();
  rawMarks.forEach((m) => {
    let summary = courseMap.get(m.courseCode);
    if (!summary) {
      summary = {
        courseCode: m.courseCode,
        courseName: m.courseName,
        totalMarks: 0,
        maxTotal: 0,
        percentage: 0,
        grade: '—',
        status: 'In Progress',
      };
      courseMap.set(m.courseCode, summary);
    }

    if (m.examType === 'CLA-1') summary.cla1 = { marks: m.marks, maxMarks: m.maxMarks };
    else if (m.examType === 'CLA-2') summary.cla2 = { marks: m.marks, maxMarks: m.maxMarks };
    else if (m.examType === 'End Semester') summary.endSem = { marks: m.marks, maxMarks: m.maxMarks };

    summary.totalMarks += m.marks;
    summary.maxTotal += m.maxMarks;
  });

  const courseList = Array.from(courseMap.values()).map((c) => {
    const pct = c.maxTotal > 0 ? Math.round((c.totalMarks / c.maxTotal) * 100) : 0;
    const { grade, status } = calculateGrade(pct);
    return {
      ...c,
      percentage: pct,
      grade,
      status,
    };
  });

  const totalPossible = courseList.reduce((acc, c) => acc + c.maxTotal, 0);
  const totalScored = courseList.reduce((acc, c) => acc + c.totalMarks, 0);
  const aggregatePercentage = totalPossible > 0 ? Math.round((totalScored / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Academic Performance & Marks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Verified marks uploaded by course faculty for Continuous Learning Assessments (CLA) and End Semesters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMarks}
            disabled={loading}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Marks</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-gray-200 shadow-xs bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500">Graded Courses</span>
            <BookOpen className="w-5 h-5 text-campus-green-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">
            {courseList.length}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Active Semester</span>
        </Card>

        <Card className="p-5 border-gray-200 shadow-xs bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500">Aggregate Assessment</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-700">
            {aggregatePercentage}%
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">
            {totalScored} of {totalPossible} total marks
          </span>
        </Card>

        <Card className="p-5 border-gray-200 shadow-xs bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500">Recorded Exam Components</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-purple-700">
            {rawMarks.length}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">CLA-1, CLA-2 & Finals</span>
        </Card>
      </div>

      {/* Marks Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-900">
            Course Performance Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead className="text-center">CLA-1 (Max: 50)</TableHead>
                <TableHead className="text-center">CLA-2 (Max: 50)</TableHead>
                <TableHead className="text-center">End Sem (Max: 100)</TableHead>
                <TableHead className="text-center">Total Score</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-right">Grade / Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                    Loading academic marks...
                  </TableCell>
                </TableRow>
              ) : courseList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                    No examination marks uploaded yet by course faculty.
                  </TableCell>
                </TableRow>
              ) : (
                courseList.map((c) => (
                  <TableRow key={c.courseCode}>
                    <TableCell className="font-semibold text-gray-900">
                      {c.courseCode}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {c.courseName}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.cla1 ? (
                        <span className="font-semibold text-gray-900">{c.cla1.marks}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.cla2 ? (
                        <span className="font-semibold text-gray-900">{c.cla2.marks}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.endSem ? (
                        <span className="font-semibold text-gray-900">{c.endSem.marks}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-900">
                      {c.totalMarks} / {c.maxTotal}
                    </TableCell>
                    <TableCell className="text-center font-bold text-emerald-700">
                      {c.percentage}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={c.percentage >= 50 ? 'present' : 'absent'}
                        className="text-xs font-bold"
                      >
                        {c.grade} ({c.status})
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
