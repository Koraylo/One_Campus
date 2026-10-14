'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export default function ClubProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('+91 97890 54321');
  const [responsibilities, setResponsibilities] = useState(
    'Event conceptualization, university faculty liaison, budget allocation, and technical mentorship.'
  );
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
          Club Lead Executive Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Student organization leadership credentials, tenure history, and official club contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card */}
        <Card className="border-gray-200 shadow-sm p-6 text-center space-y-4 bg-white flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-campus-green-200">
            <AvatarFallback className="bg-campus-green-950 text-white font-bold text-2xl">
              CL
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || 'Karthik Raja'}
            </h2>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              Roll No: 22CS042 · CSE Club President
            </p>
            <div className="mt-2">
              <Badge variant="campus">Elected Club Lead (2026-27)</Badge>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Club</span>
              <span className="font-semibold text-gray-800">CSE Technical Club</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="font-semibold text-gray-800">Computer Science</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Academic Year</span>
              <span className="font-semibold text-gray-800">Year 3 (Sem 5)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Faculty Coordinator</span>
              <span className="font-semibold text-gray-800">Dr. Anita Sharma</span>
            </div>
          </div>
        </Card>

        {/* Right Details Form */}
        <Card className="border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-gray-900">
              Executive Details & Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Lead Name
                  </label>
                  <Input
                    value={user?.name || 'Karthik Raja'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Club Official Email
                  </label>
                  <Input
                    value={user?.email || 'club@campus.edu'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Direct Contact Number
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Tenure Term
                  </label>
                  <Input defaultValue="June 2026 - May 2027" disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-gray-700">
                  Leadership Portfolio & Scope
                </label>
                <textarea
                  rows={3}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-campus-green-600"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saved ? (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Club lead profile saved!
                  </span>
                ) : (
                  <span />
                )}

                <Button
                  type="submit"
                  className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
