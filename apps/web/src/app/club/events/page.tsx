'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Award,
  CalendarCheck,
  RefreshCw,
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

interface ClubEventItem {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  description?: string;
  date: string;
  venue?: string;
  status: string;
  registrationCount: number;
}

export default function ClubEventsPage() {
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState<string | null>(null);
  const [events, setEvents] = useState<ClubEventItem[]>([]);

  // Dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('Main University Auditorium');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchClubEvents = useCallback(async () => {
    try {
      setLoading(true);
      const clubRes = await api.get<{ success: boolean; data: { id: string; name: string } }>('/api/clubs/my');
      if (clubRes.data) {
        const cId = clubRes.data.id;
        setClubId(cId);

        const evRes = await api.get<{ success: boolean; data: ClubEventItem[] }>(`/api/events?clubId=${cId}`);
        if (evRes.data) {
          setEvents(evRes.data);
        }
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch club events.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubEvents();
  }, [fetchClubEvents]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId || !title || !date) {
      setNotification({ type: 'error', message: 'Please provide event title and date.' });
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/events', {
        clubId,
        title,
        description,
        date,
        venue,
      });

      setNotification({
        type: 'success',
        message: 'Event created successfully! It is now pending approval from your faculty coordinator.',
      });
      setOpenCreate(false);
      setTitle('');
      setDescription('');
      setDate('');
      await fetchClubEvents();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to create event.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Club Events & Workshops
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize upcoming club hackathons, seminars, and technical workshops across campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClubEvents}
            disabled={loading}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Propose Club Event</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Event Title
                  </label>
                  <Input
                    required
                    placeholder="e.g. Hackathon 2026: Code for Green"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Event Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Venue / Location
                  </label>
                  <Input
                    placeholder="e.g. Main University Auditorium"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Event Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the schedule, eligibility, and prizes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreate(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-campus-green-950 hover:bg-campus-green-800 text-white"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Approval'}
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="w-8 h-8 text-campus-green-600 animate-spin mx-auto mb-2" />
            Loading club events...
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground bg-white rounded-xl border border-gray-200">
            No events found for this club. Click &quot;Create New Event&quot; to propose one.
          </div>
        ) : (
          events.map((ev) => (
            <Card
              key={ev.id}
              className="border-gray-200 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={
                      ev.status === 'Upcoming'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]'
                        : ev.status === 'Completed'
                        ? 'bg-blue-50 text-blue-800 border-blue-200 text-[10px]'
                        : 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]'
                    }
                  >
                    {ev.status}
                  </Badge>
                  <span className="text-xs text-gray-500 font-medium">{ev.date}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug">
                  {ev.title}
                </h3>
              </CardHeader>

              <CardContent className="space-y-4 pt-0 text-xs">
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {ev.description || 'No description provided.'}
                </p>

                <div className="space-y-1 text-gray-500 border-t border-gray-100 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{ev.venue || 'Campus Auditorium'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800">
                    <Users className="w-3.5 h-3.5 text-campus-green-600 shrink-0" />
                    <span>{ev.registrationCount} Registered Attendees</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Link href="/club/attendance" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 border-gray-200 hover:bg-gray-50"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 mr-1 text-campus-green-600" />
                      <span>Take Attendance</span>
                    </Button>
                  </Link>
                  <Link href="/club/certificates" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 border-gray-200 hover:bg-gray-50"
                    >
                      <Award className="w-3.5 h-3.5 mr-1 text-purple-600" />
                      <span>Certificates</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
