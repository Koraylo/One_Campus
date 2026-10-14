'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ALL_EVENTS = [
  {
    id: 'e1',
    title: 'Hackathon 2026: Code for Green',
    category: 'Technical',
    club: 'CSE Technical Club',
    description:
      'A 24-hour hackathon to build sustainable software and hardware solutions addressing climate change and campus energy efficiency.',
    date: 'Oct 18, 2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'Main University Auditorium',
    registeredCount: 184,
    capacity: 200,
    registrationDeadline: 'Oct 17, 2026',
  },
  {
    id: 'e2',
    title: 'AI & Robotics Annual Symposium',
    category: 'Technical',
    club: 'Robotics Society',
    description:
      'Keynote addresses from industry pioneers at Google DeepMind and NVIDIA, featuring student autonomous drone demonstrations.',
    date: 'Oct 22, 2026',
    time: '10:30 AM - 04:30 PM',
    venue: 'Seminar Hall B',
    registeredCount: 92,
    capacity: 120,
    registrationDeadline: 'Oct 20, 2026',
  },
  {
    id: 'e3',
    title: 'Next.js 14 & Fullstack Modern Web',
    category: 'Workshop',
    club: 'Developer Student Circle',
    description:
      'Hands-on workshop building server components, server actions, and deploying scalable web apps on modern cloud platforms.',
    date: 'Oct 25, 2026',
    time: '02:00 PM - 05:00 PM',
    venue: 'Computer Center Lab 2',
    registeredCount: 65,
    capacity: 70,
    registrationDeadline: 'Oct 24, 2026',
  },
  {
    id: 'e4',
    title: 'Campus Cultural Night & Music Fest',
    category: 'Cultural',
    club: 'Cultural Forum',
    description:
      'An evening celebrating diversity, music, dance performances, and theatrical acts by collegiate talents across all departments.',
    date: 'Oct 28, 2026',
    time: '05:30 PM - 09:30 PM',
    venue: 'Open Air Amphitheatre',
    registeredCount: 310,
    capacity: 500,
    registrationDeadline: 'Oct 27, 2026',
  },
  {
    id: 'e5',
    title: 'Annual Inter-Department Football Cup',
    category: 'Sports',
    club: 'Sports Council',
    description:
      'Tournament kickoff for inter-department trophies. Cheer your department squad through preliminary knockouts.',
    date: 'Nov 05, 2026',
    time: '03:00 PM - 07:00 PM',
    venue: 'University Sports Complex',
    registeredCount: 160,
    capacity: 250,
    registrationDeadline: 'Nov 03, 2026',
  },
];

export default function StudentEventsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>({
    e1: true,
  });

  const toggleRegister = (id: string) => {
    setRegisteredIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredEvents = ALL_EVENTS.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.club.toLowerCase().includes(search.toLowerCase()) ||
      evt.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
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
            Discover upcoming workshops, hackathons, guest lectures, and cultural fests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="campus" className="px-3 py-1">
            <Ticket className="w-3.5 h-3.5 mr-1.5" />
            <span>Registered: {Object.values(registeredIds).filter(Boolean).length}</span>
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search events, clubs, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-gray-50 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Technical', 'Workshop', 'Cultural', 'Sports'].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'campus' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs h-8 shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredIds[evt.id];
          return (
            <Card
              key={evt.id}
              className="border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    {evt.category}
                  </Badge>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {evt.club}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-campus-green-700 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 mt-1.5 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-2 space-y-1.5 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-campus-green-600 shrink-0" />
                    <span className="font-medium text-gray-800">{evt.date}</span>
                    <span>·</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>
                      {evt.registeredCount} / {evt.capacity} registered
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Deadline: {evt.registrationDeadline}
                </span>
                <Button
                  size="sm"
                  variant={isRegistered ? 'secondary' : 'default'}
                  onClick={() => toggleRegister(evt.id)}
                  className={`text-xs h-8 ${
                    isRegistered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-campus-green-950 hover:bg-campus-green-800 text-white'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Registered
                    </>
                  ) : (
                    'Register Free'
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
