'use client';

import React from 'react';
import {
  Sparkles,
  Users,
  Award,
  Calendar,
  Globe,
  Github,
  Mail,
  Shield,
  Edit3,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MyClubPage() {
  const coreCommittee = [
    {
      name: 'Karthik Raja',
      role: 'Club President / Lead',
      rollNo: '22CS042',
      email: 'karthik.r@campus.edu',
    },
    {
      name: 'Pooja Sundaram',
      role: 'Vice President & Logistics',
      rollNo: '22CS112',
      email: 'pooja.s@campus.edu',
    },
    {
      name: 'Aarav Sharma',
      role: 'Technical Operations Head',
      rollNo: '22CS001',
      email: 'aarav.s@campus.edu',
    },
    {
      name: 'Megha Iyer',
      role: 'Design & Outreach Lead',
      rollNo: '22CS059',
      email: 'megha.i@campus.edu',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Club Charter & Organization
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Official profile, leadership team, and faculty advisory council.
          </p>
        </div>

        <Button
          onClick={() => alert('Club charter modification request submitted to Student Affairs.')}
          variant="outline"
          className="text-xs h-9 gap-1.5 border-gray-200"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Club Info</span>
        </Button>
      </div>

      {/* Main Club Banner Card */}
      <Card className="border-gray-200 shadow-sm overflow-hidden bg-white">
        <div className="h-32 bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#143527] relative p-6 flex items-end">
          <div className="absolute -bottom-10 left-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border-2 border-emerald-300">
              <div className="w-full h-full rounded-xl bg-campus-green-950 flex items-center justify-center text-white">
                <Sparkles className="w-9 h-9 text-emerald-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 pb-6 px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  CSE Technical Club
                </h2>
                <Badge variant="campus">Official Technical Society</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Department of Computer Science & Engineering · Est. 2018 · 248 Active Members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>csetech.campus.edu</span>
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed max-w-4xl">
            The CSE Technical Club is the apex student developer community dedicated to fostering
            competitive programming, open-source software contributions, systems engineering,
            and hackathons. We organize university-wide workshops, mentor student teams for national
            competitions, and build impact projects.
          </p>
        </div>
      </Card>

      {/* Faculty Advisor & Core Committee Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Advisor */}
        <Card className="border-gray-200 shadow-sm p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Shield className="w-4 h-4 text-campus-green-600" />
            <h3 className="font-bold text-sm text-gray-900">Faculty Coordinator</h3>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-campus-green-300">
              <AvatarFallback className="bg-campus-green-950 text-white font-bold text-sm">
                AS
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Dr. Anita Sharma</h4>
              <p className="text-xs text-muted-foreground">Associate Professor, CSE</p>
              <p className="text-[11px] text-campus-green-700 font-medium">faculty@campus.edu</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            Oversees club charter adherence, budget sign-offs, external collaborations, and authorized student certification.
          </div>
        </Card>

        {/* Leadership Team (Span 2) */}
        <Card className="border-gray-200 shadow-sm lg:col-span-2 p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-campus-green-600" />
              <h3 className="font-bold text-sm text-gray-900">
                Core Committee Officers (2026-27)
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">4 Leads</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreCommittee.map((lead) => (
              <div
                key={lead.rollNo}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">{lead.name}</h4>
                  <span className="text-[10px] font-mono font-medium text-gray-500">
                    {lead.rollNo}
                  </span>
                </div>
                <p className="text-xs font-semibold text-campus-green-700">
                  {lead.role}
                </p>
                <p className="text-[11px] text-gray-500">{lead.email}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
