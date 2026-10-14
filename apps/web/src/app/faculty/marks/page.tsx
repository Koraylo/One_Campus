'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Upload,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
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

interface StudentMarkInput {
  rollNo: string;
  name: string;
  score: number;
}

export default function FacultyMarksPage() {
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [selectedExam, setSelectedExam] = useState('Internal Assessment 1');
  const [maxMarks, setMaxMarks] = useState(50);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [studentMarks, setStudentMarks] = useState<StudentMarkInput[]>([
    { rollNo: '22CS001', name: 'Aarav Sharma', score: 46 },
    { rollNo: '22CS015', name: 'Aditya Rao', score: 39 },
    { rollNo: '22CS028', name: 'Ananya Deshmukh', score: 32 },
    { rollNo: '22CS034', name: 'Devendra Joshi', score: 44 },
    { rollNo: '22CS042', name: 'Karthik Raja', score: 48 },
    { rollNo: '22CS059', name: 'Megha Iyer', score: 49 },
    { rollNo: '22CS071', name: 'Naveen Kumar', score: 38 },
    { rollNo: '22CS084', name: 'Rohit Verma', score: 28 },
    { rollNo: '22CS095', name: 'Sanya Mirza', score: 45 },
    { rollNo: '22CS112', name: 'Priya Sundaram', score: 41 },
  ]);

  const handleScoreChange = (rollNo: string, newScore: number) => {
    setStudentMarks((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, score: Math.min(maxMarks, Math.max(0, newScore)) } : s))
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

  const scores = studentMarks.map((s) => s.score);
  const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const passCount = scores.filter((s) => s >= maxMarks * 0.5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Upload & Publish Student Marks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Record continuous assessment scores, grade lab assignments, and push to transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-xs h-9 gap-1.5 border-gray-200"
            onClick={() => alert('Please select a .csv file formatted with: RollNo, Score')}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-campus-green-600" />
            <span>Import CSV</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
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
            <span>Marks for {selectedCourse} - {selectedExam} have been successfully published.</span>
          </div>
        </div>
      )}

      {/* Course & Exam Configurations */}
      <Card className="p-4 border-gray-200 shadow-xs bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600 font-medium"
            >
              <option value="CS301">CS301 - Data Structures & Algorithms</option>
              <option value="CS303">CS303 - Computer Networks</option>
              <option value="CS402">CS402 - Advanced Algorithms Lab</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Evaluation Component
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600 font-medium"
            >
              <option value="Internal Assessment 1">Internal Assessment 1 (50 Marks)</option>
              <option value="Internal Assessment 2">Internal Assessment 2 (50 Marks)</option>
              <option value="Assignment / Quiz">Assignment & Quiz (20 Marks)</option>
              <option value="Model Practical">Model Practical Exam (100 Marks)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-700">
              Maximum Marks
            </label>
            <Input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value) || 50)}
              className="h-10"
            />
          </div>
        </div>
      </Card>

      {/* Cohort Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-white rounded-xl border border-gray-200 text-center shadow-xs">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Class Average</span>
          <span className="text-2xl font-bold text-gray-900 block mt-1">{avgScore} / {maxMarks}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-gray-200 text-center shadow-xs">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Highest Mark</span>
          <span className="text-2xl font-bold text-emerald-700 block mt-1">{maxScore}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-gray-200 text-center shadow-xs">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Lowest Mark</span>
          <span className="text-2xl font-bold text-rose-700 block mt-1">{minScore}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-gray-200 text-center shadow-xs">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Passing Students</span>
          <span className="text-2xl font-bold text-campus-green-700 block mt-1">
            {passCount} / {studentMarks.length}
          </span>
        </div>
      </div>

      {/* Marks Entry Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Score (Max: {maxMarks})</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-right">Performance Band</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentMarks.map((s) => {
                const pct = Math.round((s.score / maxMarks) * 100);
                return (
                  <TableRow key={s.rollNo}>
                    <TableCell className="font-mono font-bold text-gray-900">
                      {s.rollNo}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {s.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        value={s.score}
                        max={maxMarks}
                        min={0}
                        onChange={(e) =>
                          handleScoreChange(s.rollNo, Number(e.target.value))
                        }
                        className="w-24 h-8 text-center mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-700">
                      {pct}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={pct >= 75 ? 'present' : pct >= 50 ? 'od' : 'absent'}
                        className="text-[10px]"
                      >
                        {pct >= 90
                          ? 'Outstanding'
                          : pct >= 75
                          ? 'Proficient'
                          : pct >= 50
                          ? 'Needs Attention'
                          : 'Critical'}
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
