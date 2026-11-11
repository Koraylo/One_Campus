'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  RefreshCw,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';

interface CertificateItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  eventId: string;
  eventTitle: string;
  title: string;
  status: string;
  proposedByName: string;
  approvedByName?: string;
  createdAt: string;
}

interface ClubEventItem {
  id: string;
  title: string;
  date: string;
}

interface EventRegistrant {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  attended: boolean;
}

export default function ClubCertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [events, setEvents] = useState<ClubEventItem[]>([]);
  const [registrants, setRegistrants] = useState<EventRegistrant[]>([]);

  // Dialog state
  const [openPropose, setOpenPropose] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [certTitle, setCertTitle] = useState('Certificate of Achievement');
  const [submitting, setSubmitting] = useState(false);
  const [distributingId, setDistributingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchClubData = useCallback(async () => {
    try {
      setLoading(true);
      const clubRes = await api.get<{ success: boolean; data: { id: string; name: string } }>('/api/clubs/my');
      if (clubRes.data) {
        const cId = clubRes.data.id;
        setClubId(cId);

        const [certsRes, eventsRes] = await Promise.all([
          api.get<{ success: boolean; data: CertificateItem[] }>(`/api/certificates/club/${cId}`),
          api.get<{ success: boolean; data: ClubEventItem[] }>(`/api/events?clubId=${cId}`),
        ]);

        if (certsRes.data) setCertificates(certsRes.data);
        if (eventsRes.data && eventsRes.data.length > 0) {
          setEvents(eventsRes.data);
          setSelectedEventId(eventsRes.data[0].id);
        }
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch club certificates.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubData();
  }, [fetchClubData]);

  // When selected event changes in dialog, fetch its attendees
  useEffect(() => {
    if (!selectedEventId) return;
    async function loadRegistrants() {
      try {
        const res = await api.get<{ success: boolean; data: any[] }>(`/api/events/${selectedEventId}/registrations`);
        if (res.data) {
          const list = res.data.map((r: any) => ({
            id: r.id,
            studentId: r.studentId,
            studentName: r.student?.name || 'Student',
            studentEmail: r.student?.email || '',
            attended: r.attended,
          }));
          setRegistrants(list);
          if (list.length > 0) {
            setSelectedStudentId(list[0].studentId);
          }
        }
      } catch {
        // Ignored if event has no registrations
      }
    }
    loadRegistrants();
  }, [selectedEventId]);

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !selectedStudentId || !certTitle) {
      setNotification({ type: 'error', message: 'Please select an event, attendee, and certificate title.' });
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/certificates/propose', {
        studentId: selectedStudentId,
        eventId: selectedEventId,
        title: certTitle,
      });

      setNotification({ type: 'success', message: 'Certificate proposed! Forwarded to faculty coordinator for sign-off.' });
      setOpenPropose(false);
      await fetchClubData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to propose certificate.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistribute = async (id: string) => {
    try {
      setDistributingId(id);
      await api.patch(`/api/certificates/${id}/distribute`);
      setNotification({ type: 'success', message: 'Certificate distributed! Recipient can now view it in their portal.' });
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'Distributed' } : c))
      );
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to distribute certificate.' });
    } finally {
      setDistributingId(null);
    }
  };

  const proposedCount = certificates.filter((c) => c.status === 'Proposed').length;
  const approvedCount = certificates.filter((c) => c.status === 'Approved').length;
  const distributedCount = certificates.filter((c) => c.status === 'Distributed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Event Certificates Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Propose credentials for event participants, track faculty sign-offs, and distribute verified certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClubData}
            disabled={loading}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>

          <Dialog open={openPropose} onOpenChange={setOpenPropose}>
            <DialogTrigger asChild>
              <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
                <Plus className="w-4 h-4" />
                <span>Propose Certificate</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Propose Event Certificate</DialogTitle>
              </DialogHeader>

              <form onSubmit={handlePropose} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Host Event
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                    required
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Student Recipient
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                    required
                  >
                    {registrants.length === 0 ? (
                      <option value="">No attendees found for this event</option>
                    ) : (
                      registrants.map((r) => (
                        <option key={r.studentId} value={r.studentId}>
                          {r.studentName} ({r.studentEmail}) {r.attended ? '· Attended' : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Certificate Title
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Winner - First Place, Certificate of Merit"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenPropose(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !selectedStudentId}
                    className="bg-campus-green-950 hover:bg-campus-green-800 text-white"
                  >
                    {submitting ? 'Submitting...' : 'Propose Certificate'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

      {/* 3 Stats Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-800 block">Awaiting Coordinator Approval</span>
            <span className="text-2xl font-bold text-amber-700">{proposedCount}</span>
          </div>
          <Clock className="w-6 h-6 text-amber-500 opacity-60" />
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-800 block">Faculty Approved (Ready to Distribute)</span>
            <span className="text-2xl font-bold text-emerald-700">{approvedCount}</span>
          </div>
          <FileCheck2 className="w-6 h-6 text-emerald-500 opacity-60" />
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-purple-800 block">Distributed to Students</span>
            <span className="text-2xl font-bold text-purple-700">{distributedCount}</span>
          </div>
          <Award className="w-6 h-6 text-purple-500 opacity-60" />
        </div>
      </div>

      {/* Certificates Pipeline Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-900">
            Certificate Proposals & Distribution Status ({certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <RefreshCw className="w-6 h-6 text-campus-green-600 animate-spin mx-auto mb-2" />
                Loading certificates...
              </div>
            ) : certificates.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No certificates recorded for your club yet. Propose one using the button above.
              </div>
            ) : (
              certificates.map((cert) => (
                <div key={cert.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{cert.title}</span>
                      <Badge
                        variant="outline"
                        className={
                          cert.status === 'Distributed'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 text-[10px]'
                            : cert.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                            : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                        }
                      >
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Recipient: <span className="font-medium text-gray-800">{cert.studentName}</span> ({cert.studentEmail}) · Event: {cert.eventTitle}
                    </p>
                    {cert.approvedByName && (
                      <p className="text-[11px] text-gray-500">
                        Signed off by Coordinator: {cert.approvedByName}
                      </p>
                    )}
                  </div>

                  <div>
                    {cert.status === 'Approved' && (
                      <Button
                        size="sm"
                        onClick={() => handleDistribute(cert.id)}
                        disabled={distributingId === cert.id}
                        className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-8 gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{distributingId === cert.id ? 'Distributing...' : 'Distribute Certificate'}</span>
                      </Button>
                    )}
                    {cert.status === 'Distributed' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Delivered</span>
                      </span>
                    )}
                    {cert.status === 'Proposed' && (
                      <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Awaiting Faculty Review</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
