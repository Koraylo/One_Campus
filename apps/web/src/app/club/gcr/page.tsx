'use client';

import React from 'react';
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Users,
  FolderGit2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ClubGCRPage() {
  const clubClassrooms = [
    {
      id: 'gcr-c1',
      title: 'Hackathon 2026: Team Mentorship & Project Submission',
      code: 'GCR-HACK26',
      gcrId: 'c/NTE4ODkxMzUzMTAx',
      studentsEnrolled: 184,
      status: 'Active',
      url: 'https://classroom.google.com',
      lastSync: '15 mins ago',
    },
    {
      id: 'gcr-c2',
      title: 'Open Source Incubator & Git Workshop Roster',
      code: 'GCR-OS26',
      gcrId: 'c/NTA3Mjg1ODU0NzAy',
      studentsEnrolled: 65,
      status: 'Active',
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
            Club Google Classroom (GCR) Portals
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Share event mentorship material, project submission folders, and evaluation rubrics.
          </p>
        </div>

        <Button
          variant="outline"
          className="text-xs h-9 gap-1.5 border-gray-200"
          onClick={() => alert('Synchronized event participants with Google Classroom roster.')}
        >
          <RefreshCw className="w-3.5 h-3.5 text-campus-green-600" />
          <span>Sync GCR Cohorts</span>
        </Button>
      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubClassrooms.map((room) => (
          <Card
            key={room.id}
            className="border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold text-campus-green-700 bg-campus-green-50 px-2 py-0.5 rounded border border-campus-green-200">
                  {room.code}
                </span>
                <Badge variant="present" className="text-[10px] gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {room.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-gray-900 leading-snug">
                  {room.title}
                </h3>
                <p className="text-xs font-mono text-gray-500 mt-1">
                  Classroom ID: {room.gcrId}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{room.studentsEnrolled} Participant Students</span>
                </div>
                <span className="text-[11px] text-gray-400">
                  Synced {room.lastSync}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Institutional Domain Linked</span>
              <a
                href={room.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button
                  size="sm"
                  className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Classroom</span>
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
