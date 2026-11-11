'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Ticket,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface CampusEvent {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  description?: string;
  date: string;
  venue?: string;
  status: string;
  registrationCount: number;
  isRegistered?: boolean;
}

export default function StudentEventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [search, setSearch] = useState('');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ success: boolean; data: CampusEvent[] }>('/api/events');
      if (res.data) {
        setEvents(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRegister = async (eventId: string) => {
    try {
      setRegisteringId(eventId);
      setError(null);
      const res = await api.post(`/api/events/${eventId}/register`);
      setNotification(res.message || 'Successfully registered for event! Event channel access granted.');
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId
            ? { ...ev, isRegistered: true, registrationCount: ev.registrationCount + 1 }
            : ev
        )
      );
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const q = search.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.clubName.toLowerCase().includes(q) ||
      (ev.venue && ev.venue.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Campus Events & Activities
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover hackathons, symposiums, guest lectures, and cultural fests hosted across university clubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEvents}
            disabled={loading}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by event title, club name, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="w-8 h-8 text-campus-green-600 animate-spin mx-auto mb-2" />
            Loading upcoming campus events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground bg-white rounded-xl border border-gray-200">
            No events found matching your search.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isReg = !!ev.isRegistered;

            return (
              <Card
                key={ev.id}
                className="overflow-hidden border-gray-200 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-2 bg-emerald-600" />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]"
                      >
                        {ev.clubName}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-gray-500">
                        {ev.status}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {ev.description || 'No description provided.'}
                    </p>

                    <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Date: {ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Venue: {ev.venue || 'Campus Auditorium'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Users className="w-3.5 h-3.5 text-campus-green-600 shrink-0" />
                        <span>{ev.registrationCount} registered attendees</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-0">
                  {isReg ? (
                    <Button
                      disabled
                      className="w-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs h-9 gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Registered</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRegister(ev.id)}
                      disabled={registeringId === ev.id}
                      className="w-full bg-campus-green-950 hover:bg-campus-green-800 text-white font-semibold text-xs h-9 gap-1.5"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>{registeringId === ev.id ? 'Registering...' : 'Register for Event'}</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
