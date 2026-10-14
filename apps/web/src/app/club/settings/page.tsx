'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Bell,
  Award,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ClubSettingsPage() {
  const [membershipPolicy, setMembershipPolicy] = useState('open');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAttendanceOD, setAutoAttendanceOD] = useState(true);
  const [defaultCertSignatory, setDefaultCertSignatory] = useState('Dr. Anita Sharma');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Club Configuration & Policies
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure membership eligibility rules, notification routing, and automated certificate settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Membership Policies */}
        <Card className="border-gray-200 shadow-sm p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Users className="w-4 h-4 text-campus-green-600" />
            <h3 className="font-bold text-sm text-gray-900">
              Membership Registration Model
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="policy"
                value="open"
                checked={membershipPolicy === 'open'}
                onChange={() => setMembershipPolicy('open')}
                className="mt-1 text-campus-green-600 focus:ring-campus-green-600"
              />
              <div>
                <span className="font-semibold text-xs text-gray-900 block">
                  Open Enrollment (Auto-Approve)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Any enrolled student in the institution can join as general member immediately.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="policy"
                value="screening"
                checked={membershipPolicy === 'screening'}
                onChange={() => setMembershipPolicy('screening')}
                className="mt-1 text-campus-green-600 focus:ring-campus-green-600"
              />
              <div>
                <span className="font-semibold text-xs text-gray-900 block">
                  Screening & Core Review
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Applicants must submit a portfolio or project link for core committee approval.
                </span>
              </div>
            </label>
          </div>
        </Card>

        {/* Automated OD and Certification Policies */}
        <Card className="border-gray-200 shadow-sm p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Award className="w-4 h-4 text-campus-green-600" />
            <h3 className="font-bold text-sm text-gray-900">
              Attendance & OD Integration
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-900 block">
                  Auto-generate On-Duty (OD) Drafts
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Automatically forward on-ground attendees to faculty advisors for OD sign-off.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAttendanceOD}
                onChange={(e) => setAutoAttendanceOD(e.target.checked)}
                className="w-4 h-4 rounded text-campus-green-600 focus:ring-campus-green-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-gray-700">
                Designated Faculty Signatory for Certificates
              </label>
              <Input
                value={defaultCertSignatory}
                onChange={(e) => setDefaultCertSignatory(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Club preferences updated successfully!
            </span>
          ) : (
            <span />
          )}

          <Button
            type="submit"
            className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs h-9"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
