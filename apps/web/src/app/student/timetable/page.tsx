'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar, MapPin, Printer, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
  slot: string;
  room: string;
  facultyName: string;
  startTime: string;
  endTime: string;
}

export default function StudentTimetablePage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ success: boolean; data: TimetableEntry[] }>('/api/timetable/my');
      if (res.data) {
        setEntries(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timetable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Class Timetable & Schedule
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your personalized slot-wise academic schedule derived from enrolled sections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTimetable}
            disabled={loading}
            className="text-xs h-9 gap-1.5 border-gray-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs h-9 gap-1.5 border-gray-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Schedule</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Timetable Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="w-8 h-8 text-campus-green-600 animate-spin mx-auto mb-2" />
            Loading class timetable...
          </div>
        ) : entries.length === 0 ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground bg-white rounded-xl border border-gray-200">
            No class sections enrolled for this semester.
          </div>
        ) : (
          entries.map((entry) => (
            <Card
              key={entry.id}
              className="border-gray-200 shadow-sm hover:border-gray-300 transition-all p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 font-bold mb-1">
                    Slot {entry.slot}
                  </Badge>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {entry.courseCode} · {entry.courseName}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                  Sec {entry.sectionName}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>
                    {entry.startTime} – {entry.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Venue: {entry.room}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-campus-green-600 shrink-0" />
                  <span>Faculty: {entry.facultyName}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
