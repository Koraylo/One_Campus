'use client';

import React, { useState } from 'react';
import {
  BellRing,
  Plus,
  Send,
  Users,
  CheckCircle2,
  Trash2,
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

export default function ClubNoticesPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState('All Club Members');
  const [content, setContent] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const [notices, setNotices] = useState([
    {
      id: 'cn-1',
      title: 'Hackathon 2026: Mentor Pairing & Final Rules Announced',
      scope: 'Event Registrants',
      content:
        'All 42 registered teams have been paired with industry mentors. Check your team dashboard for your dedicated Google Meet link and project submission deadlines.',
      date: 'Today, 11:30 AM',
      views: 184,
    },
    {
      id: 'cn-2',
      title: 'Weekly Club General Body Meeting this Thursday',
      scope: 'All Club Members',
      content:
        'Discussion on upcoming open-source showcase and recruitment of junior core members for winter symposiums. Venue: CS Seminar Hall 2.',
      date: 'Yesterday',
      views: 112,
    },
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice = {
      id: Date.now().toString(),
      title,
      scope,
      content,
      date: 'Just now',
      views: 0,
    };

    setNotices([newNotice, ...notices]);
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setOpenCreate(false);
      setTitle('');
      setContent('');
    }, 1000);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Club Notices & Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Post updates, meeting reminders, and competition notifications to club members.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Broadcast Club Notice</DialogTitle>
            </DialogHeader>

            {dispatched ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900">Notice Broadcasted!</h3>
                <p className="text-xs text-muted-foreground">
                  The message has been sent to club members and event registrants.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Subject / Title
                  </label>
                  <Input
                    placeholder="e.g. Schedule Revision for Saturday"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Recipient Group
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                  >
                    <option value="All Club Members">All Club Members (248 students)</option>
                    <option value="Event Registrants">Hackathon Registrants (184 students)</option>
                    <option value="Core Committee">Core Committee Only</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Notice Body
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide detailed notice content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
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
                    Broadcast Now
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((n) => (
          <Card
            key={n.id}
            className="border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-all bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="campus" className="text-[10px]">
                    {n.scope}
                  </Badge>
                  <span className="text-xs text-gray-400">Sent {n.date}</span>
                </div>

                <h3 className="font-bold text-base text-gray-900">{n.title}</h3>

                <p className="text-xs text-gray-700 leading-relaxed max-w-3xl">
                  {n.content}
                </p>

                <div className="pt-2 text-xs text-gray-500">
                  <span>{n.views} member reads</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotice(n.id)}
                className="text-xs h-8 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Remove</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
