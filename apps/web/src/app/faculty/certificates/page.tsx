'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Calendar,
  RefreshCw,
  AlertCircle,
  User,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface PendingCertificate {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  eventId: string;
  eventTitle: string;
  clubName: string;
  title: string;
  status: string;
  proposedByName: string;
  createdAt: string;
}

export default function FacultyCertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingCertificate[]>([]);
  const [approvedList, setApprovedList] = useState<PendingCertificate[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: PendingCertificate[] }>('/api/certificates/pending');
      if (res.data) {
        setPending(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch pending certificates.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (id: string) => {
    try {
      setApprovingId(id);
      await api.patch(`/api/certificates/${id}/approve`);
      const target = pending.find((p) => p.id === id);
      if (target) {
        setApprovedList((prev) => [{ ...target, status: 'Approved' }, ...prev]);
      }
      setPending((prev) => prev.filter((p) => p.id !== id));
      setNotification({ type: 'success', message: 'Certificate proposal approved successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Approval failed.' });
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Club Certificate Verification & Sign-Off
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review proposed student event credentials and authorize institutional certificate distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-sm ${
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

      {/* Pending Proposals Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
          <Award className="w-4 h-4 text-campus-green-600" />
          <span>Pending Faculty Sign-Offs ({pending.length})</span>
        </h2>

        {loading ? (
          <Card className="p-12 text-center border-gray-200">
            <RefreshCw className="w-8 h-8 text-campus-green-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading pending certificate proposals...</p>
          </Card>
        ) : pending.length === 0 ? (
          <Card className="p-8 text-center border-gray-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900">No Pending Certificate Proposals</h3>
            <p className="text-xs text-muted-foreground mt-1">
              All student activity certificates have been reviewed and approved.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((item) => (
              <Card
                key={item.id}
                className="border-gray-200 shadow-sm hover:border-gray-300 transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]"
                    >
                      {item.clubName}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200">
                      Proposed
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Event: <span className="font-medium text-gray-800">{item.eventTitle}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 font-medium text-gray-800">
                      <User className="w-3.5 h-3.5 text-campus-green-600" />
                      <span>Recipient: {item.studentName} ({item.studentEmail})</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Proposed by: {item.proposedByName}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                  <Button
                    onClick={() => handleApprove(item.id)}
                    disabled={approvingId === item.id}
                    className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{approvingId === item.id ? 'Approving...' : 'Approve Certificate'}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Session Approvals History */}
      {approvedList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Approved in this session ({approvedList.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {approvedList.map((a) => (
              <div key={a.id} className="p-3 bg-white rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900 block">{a.title}</span>
                  <span className="text-gray-500 text-[11px]">{a.studentName} · {a.eventTitle}</span>
                </div>
                <Badge variant="present" className="text-[10px]">
                  Approved
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
