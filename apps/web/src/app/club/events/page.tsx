'use client';

import React, { useState } from 'react';
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
import { ProgressBar } from '@/components/charts/ProgressBar';
import { EventStatus } from '@koraylo/shared';

interface ClubEventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  registered: number;
  capacity: number;
  status: EventStatus;
  budget: string;
}

export default function ClubEventsPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('Main Auditorium');
  const [capacity, setCapacity] = useState(150);
  const [budget, setBudget] = useState('25000');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const [events, setEvents] = useState<ClubEventItem[]>([
    {
      id: 'e1',
      title: 'Hackathon 2026: Code for Green',
      category: 'Flagship Hackathon',
      date: 'Oct 18, 2026',
      time: '09:00 AM',
      venue: 'Main Auditorium',
      registered: 184,
      capacity: 200,
      status: EventStatus.UPCOMING,
      budget: '₹45,000',
    },
    {
      id: 'e2',
      title: 'Fullstack Next.js 14 Workshop',
      category: 'Hands-on Workshop',
      date: 'Oct 25, 2026',
      time: '02:00 PM',
      venue: 'Computer Center Lab 2',
      registered: 65,
      capacity: 70,
      status: EventStatus.UPCOMING,
      budget: '₹12,000',
    },
    {
      id: 'e3',
      title: 'Cloud Native & DevOps Symposium',
      category: 'Seminar',
      date: 'Sep 28, 2026',
      time: '10:00 AM',
      venue: 'Seminar Hall B',
      registered: 148,
      capacity: 150,
      status: EventStatus.COMPLETED,
      budget: '₹18,000',
    },
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ClubEventItem = {
      id: Date.now().toString(),
      title,
      category,
      date,
      time: '10:00 AM',
      venue,
      registered: 0,
      capacity: Number(capacity) || 100,
      status: EventStatus.PENDING_APPROVAL,
      budget: `₹${budget}`,
    };

    setEvents([newEvent, ...events]);
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setOpenCreate(false);
      setTitle('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Event Management & Operations
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize club technical competitions, track attendance, and publish certificates.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
              <Plus className="w-4 h-4" />
              <span>Propose New Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Propose New Club Event</DialogTitle>
            </DialogHeader>

            {createdSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900">Event Proposal Submitted!</h3>
                <p className="text-xs text-muted-foreground">
                  Forwarded to faculty coordinator for approval and venue allocation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Event Title
                  </label>
                  <Input
                    placeholder="e.g. AI & ML Sprint 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Hands-on Workshop">Hands-on Workshop</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Guest Lecture">Guest Lecture</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Proposed Date
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Preferred Venue
                    </label>
                    <select
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                    >
                      <option value="Main Auditorium">Main Auditorium</option>
                      <option value="Seminar Hall B">Seminar Hall B</option>
                      <option value="Computer Center Lab 2">Computer Center Lab 2</option>
                      <option value="Open Air Amphitheatre">Open Air Amphitheatre</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-700">
                      Maximum Capacity
                    </label>
                    <Input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Estimated Budget (INR ₹)
                  </label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-campus-green-950 hover:bg-campus-green-800 text-white"
                  >
                    Submit Proposal
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((evt) => (
          <Card
            key={evt.id}
            className="border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-all bg-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {evt.category}
                  </Badge>
                  <Badge
                    variant={
                      evt.status === EventStatus.COMPLETED
                        ? 'secondary'
                        : evt.status === EventStatus.UPCOMING
                        ? 'present'
                        : 'od'
                    }
                    className="text-[10px]"
                  >
                    {evt.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-lg text-gray-900 leading-snug">
                  {evt.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gray-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-campus-green-600" />
                    {evt.date} · {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {evt.venue}
                  </span>
                  <span>Budget: <span className="font-semibold text-gray-800">{evt.budget}</span></span>
                </div>

                <div className="max-w-md pt-1">
                  <ProgressBar
                    label="Registrations"
                    current={evt.registered}
                    total={evt.capacity}
                    color="bg-campus-green-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link href={`/club/registrations?id=${evt.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 border-gray-200">
                    <Users className="w-3.5 h-3.5" />
                    <span>View Signups</span>
                  </Button>
                </Link>

                <Link href={`/club/attendance?id=${evt.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 border-gray-200">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Event Attn</span>
                  </Button>
                </Link>

                <Link href={`/club/certificates?id=${evt.id}`}>
                  <Button size="sm" className="bg-campus-green-950 hover:bg-campus-green-800 text-white text-xs h-9 gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificates</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
