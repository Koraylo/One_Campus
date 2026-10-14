'use client';

import React, { useState } from 'react';
import {
  Award,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Users,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CertificateStatus } from '@koraylo/shared';

interface CertificateProposal {
  id: string;
  club: string;
  eventTitle: string;
  category: string;
  proposedBy: string;
  recipientCount: number;
  date: string;
  status: CertificateStatus;
}

export default function FacultyCertificatesPage() {
  const [proposals, setProposals] = useState<CertificateProposal[]>([
    {
      id: 'cert-p1',
      club: 'CSE Technical Club',
      eventTitle: 'Hackathon 2026: Code for Green (Winner & Participation)',
      category: 'Technical Hackathon',
      proposedBy: 'Karthik Raja (Lead)',
      recipientCount: 142,
      date: 'Oct 14, 2026',
      status: CertificateStatus.PROPOSED,
    },
    {
      id: 'cert-p2',
      club: 'Robotics Society',
      eventTitle: 'Autonomous Robotics Workshop',
      category: 'Hands-on Workshop',
      proposedBy: 'Priya Sundaram (Secretary)',
      recipientCount: 68,
      date: 'Oct 12, 2026',
      status: CertificateStatus.PROPOSED,
    },
    {
      id: 'cert-p3',
      club: 'Cultural Forum',
      eventTitle: 'Acoustic Jam Night 2026',
      category: 'Cultural Showcase',
      proposedBy: 'Megha Iyer',
      recipientCount: 35,
      date: 'Oct 05, 2026',
      status: CertificateStatus.APPROVED,
    },
  ]);

  const handleDecision = (id: string, newStatus: CertificateStatus) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const pending = proposals.filter((p) => p.status === CertificateStatus.PROPOSED);
  const approved = proposals.filter((p) => p.status !== CertificateStatus.PROPOSED);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Club Certificate Verification & Sign-Off
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review club event participant certificates and authorize institutional credential issuance.
          </p>
        </div>
      </div>

      {/* Pending Proposals Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
          <Award className="w-4 h-4 text-campus-green-600" />
          <span>Pending Faculty Sign-Offs ({pending.length})</span>
        </h2>

        {pending.length === 0 ? (
          <Card className="p-8 text-center border-gray-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900">No Pending Certificate Proposals</h3>
            <p className="text-xs text-muted-foreground">
              All student activity certificates have been reviewed.
            </p>
          </Card>
        ) : (
          pending.map((item) => (
            <Card
              key={item.id}
              className="border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-all bg-white"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="campus" className="text-[10px]">
                      {item.club}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {item.category}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-gray-900">
                    {item.eventTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <Users className="w-3.5 h-3.5 text-campus-green-600" />
                      {item.recipientCount} Student Recipients
                    </span>
                    <span>Proposed by {item.proposedBy}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      alert('Displaying sample PDF certificate template with dynamic student name and verification QR.')
                    }
                    className="text-xs h-9 border-gray-200 gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview Template</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleDecision(item.id, CertificateStatus.APPROVED)}
                    className="text-xs h-9 bg-campus-green-950 hover:bg-campus-green-800 text-white gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Authorize & Issue</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Authorized History Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Recently Authorized Certificate Batches</span>
        </h2>

        {approved.map((item) => (
          <Card
            key={item.id}
            className="border-gray-200 shadow-sm p-4 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900">
                  {item.eventTitle}
                </span>
                <Badge variant="present" className="text-[10px]">
                  Authorized & Distributed
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {item.club} · {item.recipientCount} Verified Certificates Issued · Signed by Faculty
              </p>
            </div>
            <span className="text-xs text-gray-400">{item.date}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
