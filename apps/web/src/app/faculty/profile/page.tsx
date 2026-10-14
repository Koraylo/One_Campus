'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Award,
  Save,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export default function FacultyProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('+91 98450 11223');
  const [office, setOffice] = useState('Cabin CS-308, Faculty Block B');
  const [consultHours, setConsultHours] = useState('Mon & Wed: 03:00 PM - 05:00 PM');
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
          Faculty Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Departmental appointment records, research domains, and student office hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Faculty Card */}
        <Card className="border-gray-200 shadow-sm p-6 text-center space-y-4 bg-white flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-campus-green-200">
            <AvatarFallback className="bg-campus-green-950 text-white font-bold text-2xl">
              AS
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || 'Dr. Anita Sharma'}
            </h2>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              Emp ID: FAC-CSE-084 · Ph.D. IIT Madras
            </p>
            <div className="mt-2">
              <Badge variant="campus">Associate Professor</Badge>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="font-semibold text-gray-800">Computer Science & Eng.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Specialization</span>
              <span className="font-semibold text-gray-800">Algorithms & Distributed Systems</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Classes Handled</span>
              <span className="font-semibold text-gray-800">CS301 (A & B), CS402</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Club Advisor</span>
              <span className="font-semibold text-gray-800">CSE Technical Club</span>
            </div>
          </div>
        </Card>

        {/* Right Details Form */}
        <Card className="border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-gray-900">
              Office Hours & Communication Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Faculty Name
                  </label>
                  <Input
                    value={user?.name || 'Dr. Anita Sharma'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Institutional Email
                  </label>
                  <Input
                    value={user?.email || 'faculty@campus.edu'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Intercom / Office Phone
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Faculty Office / Cabin
                  </label>
                  <Input
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-gray-700">
                  Student Consultation & Office Hours
                </label>
                <Input
                  value={consultHours}
                  onChange={(e) => setConsultHours(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saved ? (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Faculty profile details updated!
                  </span>
                ) : (
                  <span />
                )}

                <Button
                  type="submit"
                  className="bg-campus-green-950 hover:bg-campus-green-800 text-white gap-2 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
