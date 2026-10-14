'use client';

import React, { useState } from 'react';
import { Clock, Calendar, MapPin, Printer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SLOTS = [
  '09:00 - 10:00 AM',
  '10:15 - 11:15 AM',
  '11:30 - 12:30 PM',
  '02:00 - 03:00 PM',
  '03:15 - 04:15 PM',
];

const TIMETABLE_DATA: Record<
  string,
  Array<{ course: string; code: string; room: string; faculty: string } | null>
> = {
  Monday: [
    { course: 'Data Structures', code: 'CS301', room: 'CS-102', faculty: 'Prof. Ramanujan' },
    { course: 'Computer Networks', code: 'CS303', room: 'CS-204', faculty: 'Dr. Anita Sharma' },
    { course: 'Discrete Mathematics', code: 'MA201', room: 'LH-1', faculty: 'Prof. Venkatesh' },
    { course: 'OS Lab (Batch 1)', code: 'CS305P', room: 'Lab 3', faculty: 'Dr. Subramanian' },
    { course: 'OS Lab (Batch 1)', code: 'CS305P', room: 'Lab 3', faculty: 'Dr. Subramanian' },
  ],
  Tuesday: [
    { course: 'Discrete Mathematics', code: 'MA201', room: 'LH-1', faculty: 'Prof. Venkatesh' },
    { course: 'Data Structures', code: 'CS301', room: 'CS-102', faculty: 'Prof. Ramanujan' },
    { course: 'Professional Ethics', code: 'HS102', room: 'CS-102', faculty: 'Dr. Meera N.' },
    { course: 'Computer Networks', code: 'CS303', room: 'CS-204', faculty: 'Dr. Anita Sharma' },
    null,
  ],
  Wednesday: [
    { course: 'Computer Networks', code: 'CS303', room: 'CS-204', faculty: 'Dr. Anita Sharma' },
    { course: 'Data Structures', code: 'CS301', room: 'CS-102', faculty: 'Prof. Ramanujan' },
    { course: 'Discrete Mathematics', code: 'MA201', room: 'LH-1', faculty: 'Prof. Venkatesh' },
    { course: 'Mentoring Session', code: 'MENT', room: 'CS-102', faculty: 'Faculty Advisor' },
    null,
  ],
  Thursday: [
    { course: 'Data Structures', code: 'CS301', room: 'CS-102', faculty: 'Prof. Ramanujan' },
    { course: 'Professional Ethics', code: 'HS102', room: 'CS-102', faculty: 'Dr. Meera N.' },
    { course: 'Computer Networks', code: 'CS303', room: 'CS-204', faculty: 'Dr. Anita Sharma' },
    { course: 'Networks Lab', code: 'CS303P', room: 'Lab 2', faculty: 'Dr. Anita Sharma' },
    { course: 'Networks Lab', code: 'CS303P', room: 'Lab 2', faculty: 'Dr. Anita Sharma' },
  ],
  Friday: [
    { course: 'Discrete Mathematics', code: 'MA201', room: 'LH-1', faculty: 'Prof. Venkatesh' },
    { course: 'Computer Networks', code: 'CS303', room: 'CS-204', faculty: 'Dr. Anita Sharma' },
    { course: 'Data Structures Tutorial', code: 'CS301T', room: 'CS-102', faculty: 'Prof. Ramanujan' },
    { course: 'Club & Sports Hour', code: 'ACT', room: 'Campus Arena', faculty: 'Coordinators' },
    null,
  ],
};

export default function StudentTimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Weekly Class Timetable
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            B.Tech Computer Science & Engineering · Year 3 (Sem 5) · Section A
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="text-xs h-9 gap-1.5 border-gray-200"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Schedule</span>
        </Button>
      </div>

      {/* Day Selector for Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
        {days.map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? 'campus' : 'outline'}
            size="sm"
            onClick={() => setActiveDay(day)}
            className="text-xs shrink-0"
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Desktop Timetable Matrix */}
      <Card className="border-gray-200 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-campus-green-950 text-white">
                <th className="p-3.5 font-bold uppercase tracking-wider w-28 border-r border-[#23533e]">
                  Day / Slot
                </th>
                {SLOTS.map((slot, idx) => (
                  <th
                    key={idx}
                    className="p-3.5 font-semibold text-center border-r border-[#23533e] last:border-r-0"
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {days.map((day) => (
                <tr key={day} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">
                    {day}
                  </td>
                  {TIMETABLE_DATA[day].map((cell, idx) => (
                    <td
                      key={idx}
                      className="p-3 border-r border-gray-200 last:border-r-0 align-top"
                    >
                      {cell ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-950">
                              {cell.code}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-1.5 py-0.2 rounded">
                              {cell.room}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium leading-tight">
                            {cell.course}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {cell.faculty}
                          </p>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300 italic text-[11px] py-4">
                          Free Slot
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {TIMETABLE_DATA[activeDay].map((cell, idx) => (
          <Card key={idx} className="border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-mono font-bold text-campus-green-700">
                {SLOTS[idx]}
              </span>
              {cell && <Badge variant="outline">{cell.room}</Badge>}
            </div>
            {cell ? (
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900">
                  {cell.code} · {cell.course}
                </h4>
                <p className="text-xs text-gray-500">{cell.faculty}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No class scheduled</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
