'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle,
  RefreshCw,
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

interface FacultySection {
  id: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
}

interface StudentMarkRow {
  studentId: string;
  name: string;
  email: string;
  score: number;
}

const EXAM_TYPES = ['CLA-1', 'CLA-2', 'End Semester'];

export default function FacultyMarksPage() {
  const [sections, setSections] = useState<FacultySection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedExam, setSelectedExam] = useState('CLA-1');
  const [maxMarks, setMaxMarks] = useState(50);
  const [students, setStudents] = useState<StudentMarkRow[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
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

  // 2. Fetch marks for selected section
  const fetchSectionMarks = useCallback(async () => {
    if (!selectedSectionId) return;
    try {
      setLoadingMarks(true);
      setError(null);
      const res = await api.get<{
        success: boolean;
        data: {
          section: any;
          students: Array<{
            id: string;
            name: string;
            email: string;
            marks: Array<{ examType: string; marks: number; maxMarks: number }>;
          }>;
        };
      }>(`/api/marks/section/${selectedSectionId}`);

      if (res.data?.students) {
        const rows: StudentMarkRow[] = res.data.students.map((st) => {
          const existing = st.marks.find((m) => m.examType === selectedExam);
          return {
            studentId: st.id,
            name: st.name,
            email: st.email,
            score: existing ? existing.marks : 40,
          };
        });
        setStudents(rows);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch section marks.');
    } finally {
      setLoadingMarks(false);
    }
  }, [selectedSectionId, selectedExam]);

  useEffect(() => {
    fetchSectionMarks();
  }, [fetchSectionMarks]);

  const handleScoreChange = (studentId: string, newScore: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, score: Math.min(maxMarks, Math.max(0, newScore)) }
          : s
      )
    );
  };

  const handleSave = async () => {
    if (!selectedSectionId || students.length === 0) return;
    try {
      setSaving(true);
      setError(null);
      const records = students.map((s) => ({
        studentId: s.studentId,
        marks: s.score,
        maxMarks,
      }));

      await api.post('/api/marks/upload', {
        sectionId: selectedSectionId,
        examType: selectedExam,
        records,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload marks.');
    } finally {
      setSaving(false);
    }
  };

  const scores = students.map((s) => s.score);
  const avgScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : '0.0';
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const passCount = scores.filter((s) => s >= maxMarks * 0.5).length;

  const selectedSectionObj = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Upload & Publish Student Marks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Record continuous assessment scores (CLA-1, CLA-2, End Semester) and publish to academic transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchSectionMarks}
            disabled={loadingMarks}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMarks ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish Marks'}</span>
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              Marks for {selectedSectionObj?.courseCode} - {selectedExam} have been successfully published to institutional records.
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Course & Exam Configurations */}
      <Card className="p-4 border-gray-200 shadow-xs bg-white">
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
                sections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode} · {c.courseName} ({c.sectionName})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Assessment Type (PRD MARK-1)
            </label>
            <select
              value={selectedExam}
              onChange={(e) => {
                const ex = e.target.value;
                setSelectedExam(ex);
                if (ex === 'End Semester') setMaxMarks(100);
                else setMaxMarks(50);
              }}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
            >
              {EXAM_TYPES.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Maximum Marks
            </label>
            <Input
              type="number"
              min={10}
              max={100}
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value) || 50)}
              className="h-10"
            />
          </div>
        </div>
      </Card>

      {/* Cohort Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-xs font-medium text-gray-600 block">Class Average</span>
          <span className="text-2xl font-bold text-gray-900">{avgScore} / {maxMarks}</span>
        </div>
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
          <span className="text-xs font-medium text-emerald-800 block">Highest Score</span>
          <span className="text-2xl font-bold text-emerald-700">{maxScore}</span>
        </div>
        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100">
          <span className="text-xs font-medium text-rose-800 block">Lowest Score</span>
          <span className="text-2xl font-bold text-rose-700">{minScore}</span>
        </div>
        <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100">
          <span className="text-xs font-medium text-blue-800 block">Pass Rate (≥ 50%)</span>
          <span className="text-2xl font-bold text-blue-700">
            {students.length > 0 ? Math.round((passCount / students.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Student Marks Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Student Gradebook ({students.length} students)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter or update scores out of {maxMarks} marks.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead className="w-36 text-center">Score (Max: {maxMarks})</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingMarks ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    Loading student gradebook...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    No students found in this section.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((s) => {
                  const pct = Math.round((s.score / maxMarks) * 100);
                  const isPass = s.score >= maxMarks * 0.5;

                  return (
                    <TableRow key={s.studentId}>
                      <TableCell className="font-semibold text-gray-900">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {s.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={maxMarks}
                          value={s.score}
                          onChange={(e) =>
                            handleScoreChange(s.studentId, Number(e.target.value))
                          }
                          className="w-24 h-8 text-center mx-auto text-sm font-bold"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={isPass ? 'present' : 'absent'}
                          className="text-[10px]"
                        >
                          {pct}% · {isPass ? 'Pass' : 'Needs Attention'}
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
    </div>
  );
}
