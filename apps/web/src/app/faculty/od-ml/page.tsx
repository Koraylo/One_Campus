'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileCheck2,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ODRequestType, ODRequestStatus } from '@koraylo/shared';
import { api } from '@/lib/api';

interface RequestItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  sectionId: string;
  sectionName: string;
  courseCode: string;
  courseName: string;
  eventId?: string;
  eventName?: string;
  clubName?: string;
  requestType: ODRequestType;
  requestedDate: string;
  reason?: string;
  currentAttendance: number;
  status: ODRequestStatus;
  createdAt: string;
}

export default function FacultyODMLPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [reviewedRequests, setReviewedRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [bulkApproving, setBulkApproving] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: RequestItem[] }>('/api/od/pending');
      if (res.data) {
        setRequests(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch pending requests.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      const targetReq = requests.find((r) => r.id === id);

      if (decision === 'approve') {
        await api.patch(`/api/od/${id}/approve`);
        setNotification({ type: 'success', message: 'Request approved and attendance credited.' });
        if (targetReq) {
          setReviewedRequests((prev) => [
            { ...targetReq, status: ODRequestStatus.APPROVED },
            ...prev,
          ]);
        }
      } else {
        await api.patch(`/api/od/${id}/reject`);
        setNotification({ type: 'success', message: 'Request rejected.' });
        if (targetReq) {
          setReviewedRequests((prev) => [
            { ...targetReq, status: ODRequestStatus.REJECTED },
            ...prev,
          ]);
        }
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Action failed.' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleBulkApprove = async () => {
    const pendingIds = pendingRequests.map((r) => r.id);
    if (pendingIds.length === 0) return;

    try {
      setBulkApproving(true);
      const res = await api.patch<{ success: boolean; data: { count: number; approvedIds: string[] } }>(
        '/api/od/bulk-approve',
        { requestIds: pendingIds }
      );

      setNotification({
        type: 'success',
        message: `Successfully approved all ${res.data?.count || pendingIds.length} pending requests!`,
      });

      const approvedItems = requests
        .filter((r) => pendingIds.includes(r.id))
        .map((r) => ({ ...r, status: ODRequestStatus.APPROVED }));
      setReviewedRequests((prev) => [...approvedItems, ...prev]);
      setRequests((prev) => prev.filter((r) => !pendingIds.includes(r.id)));

      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Bulk approval failed.' });
    } finally {
      setBulkApproving(false);
    }
  };

  const pendingRequests = requests.filter(
    (r) =>
      r.status === ODRequestStatus.PENDING &&
      (filterType === 'All' || r.requestType === filterType)
  );

  const historyRequests = reviewedRequests.filter(
    (r) => filterType === 'All' || r.requestType === filterType
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
            Review and validate student official duty event participation and certified medical leave.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'OD', 'ML'].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'campus' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="text-xs h-9 px-3"
            >
              {type}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={fetchPending}
            disabled={loading}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>

          {pendingRequests.length > 1 && (
            <Button
              onClick={handleBulkApprove}
              disabled={bulkApproving}
              className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-9 gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{bulkApproving ? 'Approving...' : `Bulk Approve All (${pendingRequests.length})`}</span>
            </Button>
          )}
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'pending' | 'history')}
      >
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="pending" className="text-xs gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals ({pendingRequests.length})</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Session History ({historyRequests.length})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Pending Grid */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center border-gray-200">
              <RefreshCw className="w-8 h-8 text-campus-green-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading pending requests...</p>
            </Card>
          ) : pendingRequests.length === 0 ? (
            <Card className="p-12 text-center border-gray-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-base">All Caught Up!</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No pending OD or Medical Leave requests requiring your review.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <Card
                  key={req.id}
                  className="border-gray-200 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            req.requestType === ODRequestType.OD
                              ? 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]'
                              : 'bg-blue-50 text-blue-800 border-blue-200 text-[10px]'
                          }
                        >
                          {req.requestType === ODRequestType.OD ? 'On-Duty' : 'Medical Leave'}
                        </Badge>
                        <span className="text-xs font-semibold text-gray-500">
                          {req.courseCode} ({req.sectionName})
                        </span>
                      </div>

                      {/* Current Attendance Indicator (OD-4) */}
                      <Badge
                        variant={req.currentAttendance >= 75 ? 'present' : 'absent'}
                        className="text-[10px]"
                      >
                        Att: {req.currentAttendance}%
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {req.studentName}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{req.studentEmail}</span>
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1.5 text-gray-700">
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Absence Date: {req.requestedDate}</span>
                      </div>
                      {req.eventName && (
                        <div className="font-semibold text-gray-900">
                          Event: {req.eventName} {req.clubName ? `(${req.clubName})` : ''}
                        </div>
                      )}
                      <p className="italic text-gray-600 pt-0.5">
                        &ldquo;{req.reason || 'No description provided.'}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={actionLoading[req.id]}
                        onClick={() => handleDecision(req.id, 'reject')}
                        className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 h-8 gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        disabled={actionLoading[req.id]}
                        onClick={() => handleDecision(req.id, 'approve')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8 gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{actionLoading[req.id] ? 'Updating...' : 'Approve & Credit'}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Grid */}
      {activeTab === 'history' && (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0">
            {historyRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No requests reviewed in this session.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {historyRequests.map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm block">
                        {req.studentName}
                      </span>
                      <span className="text-gray-500">
                        {req.courseCode} · {req.requestedDate} · {req.requestType}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        req.status === ODRequestStatus.APPROVED
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]'
                          : 'bg-rose-50 text-rose-800 border-rose-200 text-[10px]'
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
