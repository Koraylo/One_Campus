'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DonutChart } from '@/components/charts/DonutChart';
import { ProgressBar } from '@/components/charts/ProgressBar';

export default function ClubAnalyticsPage() {
  const departmentBreakdown = [
    { name: 'Computer Science (CSE)', value: 165, color: '#16a34a' },
    { name: 'Information Tech (IT)', value: 58, color: '#2563eb' },
    { name: 'Electronics (ECE)', value: 42, color: '#d97706' },
    { name: 'Other Depts', value: 26, color: '#9333ea' },
  ];

  const topEvents = [
    {
      title: 'Hackathon 2026: Code for Green',
      registrations: 184,
      attended: 168,
      turnout: 91,
      rating: 4.9,
    },
    {
      title: 'Fullstack Next.js 14 Workshop',
      registrations: 65,
      attended: 60,
      turnout: 92,
      rating: 4.8,
    },
    {
      title: 'Cloud DevOps Symposium',
      registrations: 148,
      attended: 135,
      turnout: 91,
      rating: 4.7,
    },
    {
      title: 'Open Source Summer Sprint',
      registrations: 95,
      attended: 82,
      turnout: 86,
      rating: 4.6,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Club Event Analytics & Engagement Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Data-driven metrics on student participation, cross-department reach, and event satisfaction.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-campus-green-600 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Aggregate Turnout Rate
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">90.2%</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +4.1%
            </span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Registered vs Physical Attendance</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-600 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Total Event Attendees
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">445</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Unique student interactions</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-600 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Certificates Dispatched
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">412</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Faculty verified credentials</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500 bg-white shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Average Participant Rating
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">4.85 / 5</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">From 320 post-event surveys</span>
        </Card>
      </div>

      {/* Grid: Donut + Top Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Demographics Donut */}
        <Card className="border-gray-200 shadow-sm p-6 bg-white">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-900">
              Department Diversity
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Cross-disciplinary participation across campus
            </p>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <DonutChart
              data={departmentBreakdown}
              centerValue="291"
              centerLabel="Registrations"
              height={200}
              innerRadius={55}
              outerRadius={75}
            />
          </CardContent>
        </Card>

        {/* Top Events Performance (Span 2) */}
        <Card className="border-gray-200 shadow-sm lg:col-span-2 p-6 bg-white">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-900">
              Event Turnout Performance
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Comparison of confirmed signups to validated on-ground participants
            </p>
          </CardHeader>
          <CardContent className="p-0 pt-3 space-y-4">
            {topEvents.map((evt) => (
              <div key={evt.title} className="space-y-1.5 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-800">
                  <span>{evt.title}</span>
                  <span className="text-campus-green-700 font-bold">
                    {evt.attended} / {evt.registrations} attended ({evt.turnout}%)
                  </span>
                </div>
                <ProgressBar
                  current={evt.attended}
                  total={evt.registrations}
                  color="bg-campus-green-600"
                  showNumbers={false}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
