'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function FacultyEventsPage() {
  const [events] = useState([
    {
      id: 'e1',
      title: 'Hackathon 2026: Code for Green',
      club: 'CSE Technical Club',
      coordinator: 'Dr. Anita Sharma',
      date: 'Oct 18, 2026',
      time: '09:00 AM - 05:00 PM',
      venue: 'Main Auditorium',
      registrations: 184,
      status: 'Approved',
      budget: '₹45,000',
    },
    {
      id: 'e2',
      title: 'AI & Robotics Annual Symposium',
      club: 'Robotics Society',
      coordinator: 'Dr. P. Subramanian',
      date: 'Oct 22, 2026',
      time: '10:30 AM - 04:30 PM',
      venue: 'Seminar Hall B',
      registrations: 92,
      status: 'Approved',
      budget: '₹30,000',
    },
    {
      id: 'e3',
      title: 'Next.js 14 Hands-on Workshop',
      club: 'Developer Student Circle',
      coordinator: 'Prof. R. Ramanujan',
      date: 'Oct 25, 2026',
      time: '02:00 PM - 05:00 PM',
      venue: 'Lab 2',
      registrations: 65,
      status: 'Pending Coordinator Review',
      budget: '₹12,000',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Institutional Events & Co-Curriculars
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Oversee departmental symposiums, student club initiatives, and venue scheduling.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <Card
            key={evt.id}
            className="border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="campus" className="text-[10px]">
                  {evt.club}
                </Badge>
                <Badge
                  variant={evt.status === 'Approved' ? 'present' : 'od'}
                  className="text-[10px]"
                >
                  {evt.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-gray-900 leading-snug">
                  {evt.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Faculty In-Charge: <span className="font-medium text-gray-800">{evt.coordinator}</span>
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-campus-green-600" />
                  <span>{evt.date} · {evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{evt.venue}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-500">Student Signups:</span>
                  <span className="font-bold text-gray-900">{evt.registrations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Estimated Budget:</span>
                  <span className="font-mono font-semibold text-gray-800">{evt.budget}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Venue Confirmed
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert(`Opening event log and student roster for ${evt.title}`)}
                className="text-xs h-8 border-gray-200"
              >
                View Roster
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
