'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  CalendarCheck,
  Upload,
  ExternalLink,
  Plus,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/charts/ProgressBar';

export default function FacultyClassesPage() {
  const classes = [
    {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      semester: 'Semester 5',
      section: 'Section A',
      credits: 4,
      totalStudents: 64,
      syllabusProgress: 65,
      gcrLink: 'https://classroom.google.com',
      room: 'CS-102',
    },
    {
      code: 'CS301-B',
      name: 'Data Structures & Algorithms',
      semester: 'Semester 5',
      section: 'Section B',
      credits: 4,
      totalStudents: 62,
      syllabusProgress: 60,
      gcrLink: 'https://classroom.google.com',
      room: 'CS-104',
    },
    {
      code: 'CS402',
      name: 'Advanced Algorithms Laboratory',
      semester: 'Semester 7',
      section: 'Section A',
      credits: 2,
      totalStudents: 38,
      syllabusProgress: 75,
      gcrLink: 'https://classroom.google.com',
      room: 'Lab 2 (Computing)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Assigned Courses & Classes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage course syllabi, section rosters, attendance, and assessment grades.
          </p>
        </div>

        <Button
          onClick={() => alert('New section assignment must be provisioned by Department HOD.')}
          className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Request Section Allocation</span>
        </Button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card
            key={cls.code}
            className="border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold text-campus-green-700 bg-campus-green-50 px-2.5 py-1 rounded-md border border-campus-green-200">
                  {cls.code}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {cls.section}
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {cls.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {cls.semester} · {cls.credits} Credits · Room {cls.room}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-800">{cls.totalStudents}</span>
                <span>Students Enrolled</span>
              </div>

              <div className="pt-2">
                <ProgressBar
                  label="Syllabus Completion"
                  current={cls.syllabusProgress}
                  total={100}
                  color="bg-campus-green-600"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
              <Link href={`/faculty/attendance?course=${cls.code}`}>
                <Button size="sm" variant="campus" className="text-xs h-8 gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Attendance</span>
                </Button>
              </Link>

              <Link href={`/faculty/marks?course=${cls.code}`}>
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Marks</span>
                </Button>
              </Link>

              <a
                href={cls.gcrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button size="sm" variant="ghost" className="text-xs h-8 px-2 text-gray-500">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
