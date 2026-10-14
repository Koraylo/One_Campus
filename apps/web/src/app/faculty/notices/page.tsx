'use client';

import React, { useState } from 'react';
import {
  BellRing,
  Plus,
  Send,
  Users,
  Calendar,
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

export default function FacultyNoticesPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState('CS301 - Section A');
  const [content, setContent] = useState('');
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const [notices, setNotices] = useState([
    {
      id: 'n1',
      title: 'Mid-Term Assessment 1 Syllabus & Format',
      scope: 'CS301 - Section A',
      content:
        'The upcoming internal exam will cover Modules 1 and 2 (Linear data structures, balanced trees). Calculators will not be permitted.',
      author: 'Dr. Anita Sharma',
      date: 'Today, 10:30 AM',
      views: 58,
    },
    {
      id: 'n2',
      title: 'Lab 3 Makeup Session on Friday',
      scope: 'CS402 - Advanced Lab',
      content:
        'Students who were absent during the dynamic memory allocation lab must attend the makeup session on Friday at 4 PM.',
      author: 'Dr. Anita Sharma',
      date: 'Oct 12, 2026',
      views: 34,
    },
    {
      id: 'n3',
      title: 'Campus Hackathon 2026: Problem Statements Announced',
      scope: 'Department-wide',
      content:
        'The problem tracks for Smart Agriculture, Clean Energy, and Accessible Education are now live on the portal.',
      author: 'CSE Department Council',
      date: 'Oct 10, 2026',
      views: 142,
    },
  ]);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice = {
      id: Date.now().toString(),
      title,
      scope,
      content,
      author: 'Dr. Anita Sharma',
      date: 'Just now',
      views: 0,
    };

    setNotices([newNotice, ...notices]);
    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
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
            Announcements & Department Notices
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Broadcast official notices to specific sections, year groups, or all students.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Broadcast New Notice</DialogTitle>
            </DialogHeader>

            {publishedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900">Notice Published!</h3>
                <p className="text-xs text-muted-foreground">
                  The announcement has been dispatched to student dashboards.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateNotice} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Notice Title
                  </label>
                  <Input
                    placeholder="e.g. Test Syllabus Announcement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Audience Scope
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                  >
                    <option value="CS301 - Section A">CS301 - Section A</option>
                    <option value="CS301 - Section B">CS301 - Section B</option>
                    <option value="CS402 - Advanced Lab">CS402 - Advanced Lab</option>
                    <option value="Department-wide">All CSE Students</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Notice Content
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write announcement details..."
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
                    Publish Notice
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
                  <span className="text-xs text-gray-400">Published {n.date}</span>
                </div>

                <h3 className="font-bold text-base text-gray-900">{n.title}</h3>

                <p className="text-xs text-gray-700 leading-relaxed max-w-3xl">
                  {n.content}
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    Posted by: <span className="font-semibold text-gray-800">{n.author}</span>
                  </span>
                  <span>·</span>
                  <span>{n.views} student views</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotice(n.id)}
                className="text-xs h-8 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Delete</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
