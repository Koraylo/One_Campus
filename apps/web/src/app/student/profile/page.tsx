'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Award,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Hostel Block C, Room 304, Campus Campus');
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
          Student Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal information, institutional details, and communication preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left ID Card */}
        <Card className="border-gray-200 shadow-sm p-6 text-center space-y-4 bg-white flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-campus-green-200">
            <AvatarFallback className="bg-campus-green-950 text-white font-bold text-2xl">
              AS
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || 'Aarav Sharma'}
            </h2>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              Roll No: 22CS042 · Reg: 2022104084
            </p>
            <div className="mt-2">
              <Badge variant="campus">Undergraduate Student</Badge>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="font-semibold text-gray-800">Computer Science</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Degree</span>
              <span className="font-semibold text-gray-800">B.Tech (Honors)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Current Semester</span>
              <span className="font-semibold text-gray-800">Semester 5 (Year 3)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Section</span>
              <span className="font-semibold text-gray-800">Section A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Faculty Advisor</span>
              <span className="font-semibold text-gray-800">Prof. R. Ramanujan</span>
            </div>
          </div>
        </Card>

        {/* Right Editable Personal & Contact Info */}
        <Card className="border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-gray-900">
              Contact & Emergency Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Full Name
                  </label>
                  <Input
                    value={user?.name || 'Aarav Sharma'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Campus Email
                  </label>
                  <Input
                    value={user?.email || 'student@campus.edu'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Contact Phone Number
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-gray-700">
                    Emergency Contact (Parent / Guardian)
                  </label>
                  <Input defaultValue="+91 94433 22110 (M. Sharma)" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-gray-700">
                  Residential / Hostel Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saved ? (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Profile changes saved successfully!
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
