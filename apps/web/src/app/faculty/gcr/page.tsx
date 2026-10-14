'use client';

import React from 'react';
import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Users,
  BookOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FacultyGCRPage() {
  const gcrMappings = [
    {
      id: 'gcr-f1',
      code: 'CS301-A',
      name: 'Data Structures & Algorithms (Sec A)',
      gcrId: 'c/NTE4ODkxMzUzMTIz',
      enrolled: 64,
      status: 'Synchronized',
      url: 'https://classroom.google.com',
      lastSync: '12 mins ago',
    },
    {
      id: 'gcr-f2',
      code: 'CS301-B',
      name: 'Data Structures & Algorithms (Sec B)',
      gcrId: 'c/NTA3Mjg1ODU0NzY1',
      enrolled: 62,
      status: 'Synchronized',
      url: 'https://classroom.google.com',
      lastSync: '25 mins ago',
    },
    {
      id: 'gcr-f3',
      code: 'CS402-A',
      name: 'Advanced Algorithms Lab',
      gcrId: 'c/NTM4MjAxOTI4MTk1',
      enrolled: 38,
      status: 'Synchronized',
      url: 'https://classroom.google.com',
      lastSync: '1 hour ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Google Classroom (GCR) Course Links
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage synced classroom IDs, roster synchronization, and external course folders.
          </p>
        </div>

        <Button
          variant="outline"
          className="text-xs h-9 gap-1.5 border-gray-200"
          onClick={() => alert('Synchronizing student rosters with Google Classroom API...')}
        >
          <RefreshCw className="w-3.5 h-3.5 text-campus-green-600" />
          <span>Sync All Roster Data</span>
        </Button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gcrMappings.map((cls) => (
          <Card
            key={cls.id}
            className="border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold text-campus-green-700 bg-campus-green-50 px-2 py-0.5 rounded border border-campus-green-200">
                  {cls.code}
                </span>
                <Badge variant="present" className="text-[10px] gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {cls.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-gray-900 leading-snug">
                  {cls.name}
                </h3>
                <p className="text-xs font-mono text-gray-500 mt-1">
                  Classroom ID: {cls.gcrId}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cls.enrolled} Roster Students</span>
                </div>
                <span className="text-[11px] text-gray-400">
                  Synced {cls.lastSync}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Single Sign-On Linked</span>
              <a
                href={cls.url}
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
