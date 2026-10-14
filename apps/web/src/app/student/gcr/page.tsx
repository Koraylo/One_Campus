'use client';

import React from 'react';
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  FileText,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StudentGCRPage() {
  const gcrCourses = [
    {
      id: 'gcr-1',
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      section: 'Section A (Fall 2026)',
      faculty: 'Prof. R. Ramanujan',
      gcrId: 'c/NTE4ODkxMzUzMTIz',
      url: 'https://classroom.google.com',
      syncStatus: 'Synced',
      pendingAssignments: 1,
      lastSync: '10 mins ago',
    },
    {
      id: 'gcr-2',
      code: 'CS303',
      name: 'Computer Networks',
      section: 'Section A (Fall 2026)',
      faculty: 'Dr. Anita Sharma',
      gcrId: 'c/NTA3Mjg1ODU0NzY1',
      url: 'https://classroom.google.com',
      syncStatus: 'Synced',
      pendingAssignments: 2,
      lastSync: '1 hour ago',
    },
    {
      id: 'gcr-3',
      code: 'MA201',
      name: 'Discrete Mathematics',
      section: 'Section A (Fall 2026)',
      faculty: 'Prof. K. Venkatesh',
      gcrId: 'c/NDkyOTEyOTQwMTk4',
      url: 'https://classroom.google.com',
      syncStatus: 'Synced',
      pendingAssignments: 0,
      lastSync: 'Today at 08:30 AM',
    },
    {
      id: 'gcr-4',
      code: 'CS305P',
      name: 'Operating Systems Laboratory',
      section: 'Lab Batch 1',
      faculty: 'Dr. P. Subramanian',
      gcrId: 'c/NTM4MjAxOTI4MTk1',
      url: 'https://classroom.google.com',
      syncStatus: 'Synced',
      pendingAssignments: 1,
      lastSync: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Google Classroom (GCR) Links
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Access course materials, assignment submissions, and instructor announcements.
          </p>
        </div>

        <Button
          variant="outline"
          className="text-xs h-9 gap-1.5 border-gray-200"
          onClick={() => alert('All GCR course mappings are synchronized.')}
        >
          <RefreshCw className="w-3.5 h-3.5 text-campus-green-600" />
          <span>Sync GCR Records</span>
        </Button>
      </div>

      {/* Linked Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gcrCourses.map((course) => (
          <Card
            key={course.id}
            className="border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <Badge variant="present" className="text-[10px] gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {course.syncStatus}
                </Badge>
              </div>

              <div>
                <span className="text-xs font-bold text-campus-green-700 uppercase tracking-wider">
                  {course.code} · {course.section}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Instructor: <span className="font-medium text-gray-700">{course.faculty}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {course.pendingAssignments > 0
                      ? `${course.pendingAssignments} pending submission`
                      : 'All assignments submitted'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">
                  Synced {course.lastSync}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 truncate max-w-[200px]">
                {course.gcrId}
              </span>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button
                  size="sm"
                  className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in GCR</span>
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
