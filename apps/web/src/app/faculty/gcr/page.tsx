'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface GCRSectionItem {
  id: string;
  sectionId: string;
  sectionName: string;
  courseCode?: string;
  courseName?: string;
  gcrCourseId: string;
  syncStatus: string;
  lastSynced?: string;
  courseUrl: string;
}

export default function FacultyGCRPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<GCRSectionItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGCR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ success: boolean; data: GCRSectionItem[] }>('/api/gcr/my-sections');
      if (res.data) {
        setSections(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GCR sections.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGCR();
  }, [fetchGCR]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Google Classroom (GCR) Course Links
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Launch directly into Google Classroom to manage coursework, upload materials, and grade assignments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchGCR}
          disabled={loading}
          className="text-xs h-9 gap-1.5 border-gray-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Mappings</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Linked Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="w-8 h-8 text-campus-green-600 animate-spin mx-auto mb-2" />
            Loading Google Classroom course mappings...
          </div>
        ) : sections.length === 0 ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground bg-white rounded-xl border border-gray-200">
            No Google Classroom sections mapped for your assigned classes.
          </div>
        ) : (
          sections.map((course) => (
            <Card
              key={course.id}
              className="border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 font-bold mb-1">
                      {course.courseCode || 'ACAD'}
                    </Badge>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {course.courseName || 'Teaching Section'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Section {course.sectionName}
                    </p>
                  </div>

                  <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{course.syncStatus}</span>
                  </Badge>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Classroom ID:</span>
                    <span className="font-mono text-gray-800">{course.gcrCourseId}</span>
                  </div>
                  {course.lastSynced && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Last Synced:</span>
                      <span className="text-gray-700">{course.lastSynced.split('T')[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end">
                <a
                  href={course.courseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Classroom</span>
                  </Button>
                </a>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
