'use client';

import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Send,
  Calendar,
  Eye,
  ExternalLink,
  BookOpen,
  CheckCircle2,
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

export default function ClubNewslettersPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editionTitle, setEditionTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const [editions, setEditions] = useState([
    {
      id: 'nl-12',
      issue: 'Issue #12 · October 2026',
      title: 'Green Tech, Autonomous Agents & Hackathon Kickoff',
      description:
        'A comprehensive roundup of cutting-edge campus software projects, tips for first-time hackathon attendees, and an exclusive interview with alumni at OpenAI.',
      subscribers: 840,
      reads: 612,
      date: 'Oct 10, 2026',
      status: 'Published',
    },
    {
      id: 'nl-11',
      issue: 'Issue #11 · September 2026',
      title: 'Summer Internships & Open Source Demystified',
      description:
        'Practical guides on cracking GSOC and Linux Foundation mentorships, plus campus developer spotlight stories.',
      subscribers: 810,
      reads: 745,
      date: 'Sep 15, 2026',
      status: 'Published',
    },
    {
      id: 'nl-10',
      issue: 'Issue #10 · August 2026',
      title: 'Welcome Batch 2026: The Ultimate Campus Tech Survival Guide',
      description:
        'Essential developer tools, git cheatsheets, and clubs orientation overview for incoming first-year engineers.',
      subscribers: 780,
      reads: 790,
      date: 'Aug 20, 2026',
      status: 'Published',
    },
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEdition = {
      id: Date.now().toString(),
      issue: `Issue #${editions.length + 10} · Draft`,
      title: editionTitle,
      description: summary,
      subscribers: 840,
      reads: 0,
      date: 'Today',
      status: 'Draft',
    };

    setEditions([newEdition, ...editions]);
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setOpenCreate(false);
      setEditionTitle('');
      setSummary('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Club Tech Digest & Newsletters
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Curate technical writeups, spotlight student projects, and broadcast monthly digests.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
              <Plus className="w-4 h-4" />
              <span>Draft New Digest</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Compose Club Tech Digest</DialogTitle>
            </DialogHeader>

            {dispatched ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900">Draft Created!</h3>
                <p className="text-xs text-muted-foreground">
                  Saved in your publication staging area for editorial review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Edition Headline
                  </label>
                  <Input
                    placeholder="e.g. Next-Gen Computing & Web3 Special"
                    value={editionTitle}
                    onChange={(e) => setEditionTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Lead Abstract / Summary
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe featured articles, spotlights, and event roundups..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
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
                    Save Draft
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {editions.map((ed) => (
          <Card
            key={ed.id}
            className="border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-all bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-campus-green-700">
                    {ed.issue}
                  </span>
                  <Badge
                    variant={ed.status === 'Published' ? 'present' : 'outline'}
                    className="text-[10px]"
                  >
                    {ed.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-base text-gray-900">{ed.title}</h3>

                <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                  {ed.description}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-campus-green-600" />
                    {ed.subscribers} Subscribers
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    {ed.reads} Reads
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {ed.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Reading digital issue: ${ed.title}`)}
                  className="text-xs h-9 border-gray-200 gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Edition</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
