'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Download,
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
import { CertificateStatus } from '@koraylo/shared';

interface CertificateBatch {
  id: string;
  eventName: string;
  title: string;
  recipientCount: number;
  status: CertificateStatus;
  proposedDate: string;
  facultySignedBy?: string;
}

export default function ClubCertificatesPage() {
  const [openPropose, setOpenPropose] = useState(false);
  const [eventTitle, setEventTitle] = useState('Hackathon 2026: Code for Green');
  const [certTitle, setCertTitle] = useState('Certificate of Achievement (Winner)');
  const [recipientCount, setRecipientCount] = useState(12);
  const [submitted, setSubmitted] = useState(false);

  const [batches, setBatches] = useState<CertificateBatch[]>([
    {
      id: 'cb-1',
      eventName: 'Hackathon 2026: Code for Green',
      title: 'Certificate of Participation',
      recipientCount: 148,
      status: CertificateStatus.PROPOSED,
      proposedDate: 'Oct 14, 2026',
    },
    {
      id: 'cb-2',
      eventName: 'Next.js 14 Hands-on Workshop',
      title: 'Certificate of Completion',
      recipientCount: 65,
      status: CertificateStatus.APPROVED,
      proposedDate: 'Oct 10, 2026',
      facultySignedBy: 'Dr. Anita Sharma',
    },
    {
      id: 'cb-3',
      eventName: 'Cloud DevOps Symposium',
      title: 'Certificate of Attendance',
      recipientCount: 135,
      status: CertificateStatus.DISTRIBUTED,
      proposedDate: 'Sep 29, 2026',
      facultySignedBy: 'Dr. Anita Sharma',
    },
  ]);

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: CertificateBatch = {
      id: Date.now().toString(),
      eventName: eventTitle,
      title: certTitle,
      recipientCount: Number(recipientCount) || 10,
      status: CertificateStatus.PROPOSED,
      proposedDate: 'Just now',
    };

    setBatches([newBatch, ...batches]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpenPropose(false);
    }, 1200);
  };

  const distribute = (id: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: CertificateStatus.DISTRIBUTED } : b
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Certificate Proposals & Distribution
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Submit verifiable certificate batches to faculty coordinators for official authorization.
          </p>
        </div>

        <Dialog open={openPropose} onOpenChange={setOpenPropose}>
          <DialogTrigger asChild>
            <Button className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9">
              <Plus className="w-4 h-4" />
              <span>Propose Certificate Batch</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Propose Certificates to Faculty Advisor</DialogTitle>
            </DialogHeader>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900">Proposal Dispatched!</h3>
                <p className="text-xs text-muted-foreground">
                  Faculty coordinator has received the certificate sign-off request.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePropose} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Associated Event
                  </label>
                  <select
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                  >
                    <option value="Hackathon 2026: Code for Green">Hackathon 2026: Code for Green</option>
                    <option value="Next.js 14 Workshop">Next.js 14 Workshop</option>
                    <option value="Cloud DevOps Symposium">Cloud DevOps Symposium</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Certificate Header Title
                  </label>
                  <Input
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Recipient Student Count
                  </label>
                  <Input
                    type="number"
                    value={recipientCount}
                    onChange={(e) => setRecipientCount(Number(e.target.value))}
                    required
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenPropose(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-campus-green-950 hover:bg-campus-green-800 text-white"
                  >
                    Submit for Sign-Off
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Batches List */}
      <div className="space-y-4">
        {batches.map((batch) => (
          <Card
            key={batch.id}
            className="border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-all bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="campus" className="text-[10px]">
                    {batch.eventName}
                  </Badge>
                  <Badge
                    variant={
                      batch.status === CertificateStatus.DISTRIBUTED
                        ? 'present'
                        : batch.status === CertificateStatus.APPROVED
                        ? 'campus'
                        : 'od'
                    }
                    className="text-[10px]"
                  >
                    {batch.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-base text-gray-900">
                  {batch.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <Users className="w-3.5 h-3.5 text-campus-green-600" />
                    {batch.recipientCount} Recipients
                  </span>
                  <span>Proposed: {batch.proposedDate}</span>
                  {batch.facultySignedBy && (
                    <span className="text-emerald-700 font-semibold">
                      Authorized by {batch.facultySignedBy}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {batch.status === CertificateStatus.APPROVED && (
                  <Button
                    size="sm"
                    onClick={() => distribute(batch.id)}
                    className="text-xs h-9 bg-campus-green-950 hover:bg-campus-green-800 text-white gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Distribute to Students</span>
                  </Button>
                )}

                {batch.status === CertificateStatus.DISTRIBUTED && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert('Downloading verified certificate manifest archive (ZIP)...')}
                    className="text-xs h-9 border-gray-200 gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-campus-green-600" />
                    <span>Download Manifest</span>
                  </Button>
                )}

                {batch.status === CertificateStatus.PROPOSED && (
                  <span className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Faculty Sign-Off
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
