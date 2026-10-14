'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Check,
  X,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ODRequestType, ODRequestStatus } from '@koraylo/shared';

interface RequestItem {
  id: string;
  studentName: string;
  rollNo: string;
  course: string;
  type: ODRequestType;
  date: string;
  reason: string;
  currentAttendance: number;
  status: ODRequestStatus;
}

export default function FacultyODMLPage() {
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 'req-1',
      studentName: 'Rohit Verma',
      rollNo: '22CS084',
      course: 'CS301 - Data Structures',
      type: ODRequestType.OD,
      date: 'Oct 19, 2026',
      reason: 'Representing college at Smart India Hackathon grand finals.',
      currentAttendance: 76,
      status: ODRequestStatus.PENDING,
    },
    {
      id: 'req-2',
      studentName: 'Priya Sundaram',
      rollNo: '22CS112',
      course: 'CS301 - Data Structures',
      type: ODRequestType.ML,
      date: 'Oct 14, 2026',
      reason: 'Viral fever, advised 2 days bed rest (Medical certificate attached).',
      currentAttendance: 82,
      status: ODRequestStatus.PENDING,
    },
    {
      id: 'req-3',
      studentName: 'Ananya Deshmukh',
      rollNo: '22CS028',
      course: 'CS402 - Algorithms Lab',
      type: ODRequestType.OD,
      date: 'Oct 16, 2026',
      reason: 'IEEE Student Conference paper presentation in Bangalore.',
      currentAttendance: 71,
      status: ODRequestStatus.PENDING,
    },
    {
      id: 'req-4',
      studentName: 'Aditya Rao',
      rollNo: '22CS015',
      course: 'CS301 - Data Structures',
      type: ODRequestType.OD,
      date: 'Oct 10, 2026',
      reason: 'Inter-collegiate basketball championship finals.',
      currentAttendance: 84,
      status: ODRequestStatus.APPROVED,
    },
  ]);

  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const handleDecision = (id: string, newStatus: ODRequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const pendingRequests = requests.filter(
    (r) =>
      r.status === ODRequestStatus.PENDING &&
      (filterType === 'All' || r.type === filterType)
  );

  const historyRequests = requests.filter(
    (r) =>
      r.status !== ODRequestStatus.PENDING &&
      (filterType === 'All' || r.type === filterType)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            On-Duty (OD) & Medical Leave (ML) Approvals
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review student official duty participation and medical absence validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'OD', 'ML'].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'campus' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="text-xs h-8"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs: Pending vs History */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <Button
          variant={activeTab === 'pending' ? 'campus' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('pending')}
          className="text-xs font-semibold gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Decisions ({requests.filter((r) => r.status === ODRequestStatus.PENDING).length})</span>
        </Button>
        <Button
          variant={activeTab === 'history' ? 'campus' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
          className="text-xs font-semibold gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Decision History ({requests.filter((r) => r.status !== ODRequestStatus.PENDING).length})</span>
        </Button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingRequests.length === 0 ? (
            <Card className="p-8 text-center border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">All Caught Up!</h3>
              <p className="text-xs text-muted-foreground">
                No pending OD or Medical leave requests pending for your verification.
              </p>
            </Card>
          ) : (
            pendingRequests.map((req) => (
              <Card
                key={req.id}
                className="border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-all bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={req.type === ODRequestType.OD ? 'od' : 'ml'}
                        className="text-[10px] font-bold uppercase"
                      >
                        {req.type} Application
                      </Badge>
                      <h3 className="font-bold text-base text-gray-900">
                        {req.studentName} ({req.rollNo})
                      </h3>
                      <span className="text-xs text-muted-foreground">· {req.course}</span>
                    </div>

                    <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="font-semibold text-gray-900">Reason: </span>
                      {req.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-campus-green-600" />
                        Absence Date: {req.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        Current Attendance:
                        <span
                          className={`ml-1 font-bold ${
                            req.currentAttendance < 75 ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {req.currentAttendance}%
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecision(req.id, ODRequestStatus.REJECTED)}
                      className="text-xs h-9 text-rose-600 hover:bg-rose-50 border-rose-200"
                    >
                      <X className="w-4 h-4 mr-1" />
                      <span>Reject</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDecision(req.id, ODRequestStatus.APPROVED)}
                      className="text-xs h-9 bg-campus-green-950 hover:bg-campus-green-800 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      <span>Approve Request</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )
        ) : (
          historyRequests.map((req) => (
            <Card
              key={req.id}
              className="border-gray-200 shadow-sm p-4 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={req.type === ODRequestType.OD ? 'od' : 'ml'}
                    className="text-[10px]"
                  >
                    {req.type}
                  </Badge>
                  <span className="font-bold text-sm text-gray-900">
                    {req.studentName} ({req.rollNo})
                  </span>
                  <span className="text-xs text-gray-500">· {req.date}</span>
                </div>
                <p className="text-xs text-gray-600 truncate max-w-xl">
                  {req.reason}
                </p>
              </div>

              <div>
                <Badge
                  variant={
                    req.status === ODRequestStatus.APPROVED ? 'present' : 'absent'
                  }
                  className="text-xs"
                >
                  {req.status}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
