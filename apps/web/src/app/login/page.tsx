'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Users,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Role, ROLE_PORTAL_MAP } from '@koraylo/shared';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      setError(
        err.message || 'Failed to sign in. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick test demo helper
  const handleQuickLogin = (demoRole: Role) => {
    if (demoRole === Role.STUDENT) {
      setEmail('student@campus.edu');
      setPassword('password123');
    } else if (demoRole === Role.FACULTY) {
      setEmail('faculty@campus.edu');
      setPassword('password123');
    } else if (demoRole === Role.CLUB_LEAD) {
      setEmail('club@campus.edu');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Branding Panel (Dark Forest Green) */}
      <div className="relative flex-1 bg-[#1B4332] text-white p-8 md:p-14 flex flex-col justify-between overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        {/* Top brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-campus-green-500/20 border border-campus-green-400/40 flex items-center justify-center text-white shadow-inner">
              <GraduationCap className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white block">
                Campus Portal
              </span>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">
                One Platform. A Connected Campus.
              </span>
            </div>
          </div>
        </div>

        {/* Center narrative & feature highlights */}
        <div className="relative z-10 my-10 space-y-8 max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Unified Campus Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Bridging Students, Faculty & Clubs in real-time.
            </h2>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Experience frictionless attendance tracking, official approvals, marks
              publishing, club event workflows, and interactive channels all under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#143527]/60 border border-[#23533e]">
              <CalendarCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Smart Attendance</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Real-time stats, OD & ML tracking with approvals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#143527]/60 border border-[#23533e]">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Verified Approvals</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Faculty sign-offs on event certificates & ODs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#143527]/60 border border-[#23533e]">
              <Users className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Club Hub</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Host registrations, attendance & broadcasts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#143527]/60 border border-[#23533e]">
              <Sparkles className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">GCR Integration</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Seamless links to all your Google Classrooms.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer note */}
        <div className="relative z-10 text-xs text-emerald-200/60 border-t border-emerald-500/20 pt-4 flex justify-between items-center">
          <span>&copy; 2026 Campus Portal · All Rights Reserved</span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your institutional credentials to access your portal
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  placeholder="name@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-white border-gray-200 focus:border-campus-green-600 focus:ring-campus-green-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact your campus administrator to reset your password.');
                  }}
                  className="text-xs font-medium text-campus-green-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-11 bg-white border-gray-200 focus:border-campus-green-600 focus:ring-campus-green-600"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-campus-green-950 hover:bg-campus-green-800 text-white font-semibold transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Pre-fill Links */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center mb-3">
              Quick Demo Fill
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-emerald-200 hover:bg-emerald-50 text-emerald-800"
                onClick={() => handleQuickLogin(Role.STUDENT)}
              >
                Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-blue-200 hover:bg-blue-50 text-blue-800"
                onClick={() => handleQuickLogin(Role.FACULTY)}
              >
                Faculty
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-amber-200 hover:bg-amber-50 text-amber-800"
                onClick={() => handleQuickLogin(Role.CLUB_LEAD)}
              >
                Club Lead
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
