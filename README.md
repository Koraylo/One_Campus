# OneCampus (Campus Portal)
> **One Platform. A Connected Campus.**  
> Unified Campus Operations & Collaboration Platform for SRM Institute of Science and Technology.

---

## 1. Executive Summary & Project Status

SRM campus operations traditionally run fragmented across Zoho (attendance), WhatsApp (communication), Google Classroom (coursework), and paper/Shine processes (OD forms and physical certificates). **OneCampus** brings these disparate systems into a unified, role-based platform with single authentication, central roster synchronization, timetable management, and automated attendance handling.

This repository is built as a full-stack monorepo featuring **Next.js 14 (App Router)**, **Express 4 + TypeScript**, **Prisma ORM**, and **PostgreSQL**.

### Current Implementation State
- **Build & Monorepo Status:** Turborepo pipeline is operational; both `@koraylo/api` and `@koraylo/web` compile cleanly with **38 static pages prerendered**.
- **Backend API & Data Layer (~85% Complete):** 15 relational tables, compound uniqueness constraints, complete migrations, and a realistic seed generator. The Express API features 13 robust service modules with JWT authentication, role checks, and atomic transactions.
- **Frontend Application (~30% Integrated):** All 38 portal routes are fully styled with Tailwind CSS, Lucide icons, and Radix UI components. Currently, **Authentication (`useAuth.ts`) and the Chat Workspace (`ChatWorkspace.tsx`) are connected to the live API**. Dashboards, attendance marking, OD/ML requests, marks, and event management currently operate on mock UI state and local timeouts awaiting full API hookup.

---

## 2. Architecture & Monorepo Layout

Managed via **pnpm workspaces** and **Turborepo**:

```
One_Campus/
├── apps/
│   ├── api/                     # Express 4 REST API (Port 3000)
│   │   ├── prisma/              # schema.prisma, migration SQL, seed.ts
│   │   └── src/
│   │       ├── config/          # Environment configuration & validation
│   │       ├── lib/             # Prisma client instance
│   │       ├── middleware/      # JWT authentication, role authorization, errorHandler
│   │       ├── routes/          # 13 REST route controllers
│   │       ├── services/        # Business logic & database operations
│   │       └── utils/           # JWT & bcrypt helpers
│   └── web/                     # Next.js 14 App Router (Port 3001)
│       └── src/
│           ├── app/             # /student, /faculty, /club, /login routes
│           ├── components/      # UI components, layout shells, charts, ChatWorkspace
│           ├── hooks/           # useAuth.ts, usePolling.ts
│           └── lib/             # api.ts (fetch client with credentials: 'include')
├── packages/
│   └── shared/                  # Shared TypeScript types, enums, role mappings, constants
├── turbo.json                   # Build, dev, lint, db pipeline definitions
├── OneCampus_PRD.md             # v1.1 Prototype Product Requirements Document
└── package.json                 # Root workspace package configuration
```

---

## 3. What is Completed & Working

### 3.1. Database & Seed Ecosystem
- **15 Normalized Tables:** `users`, `courses`, `class_sections`, `enrollments`, `attendance`, `od_requests`, `clubs`, `events`, `event_registrations`, `marks`, `certificates`, `channels`, `channel_members`, `messages`, `announcements`, and `gcr_sync`.
- **Relational Integrity:** Foreign keys, cascades, and compound constraints (`[student_id, section_id, date]`, `[event_id, student_id]`, `[student_id, course_id, exam_type]`).
- **Rich Seed Data (`prisma/seed.ts`):**
  - **1 Admin:** `admin@srm.edu`
  - **4 Faculty Members:** Dr. Sundar Iyer, Prof. Radhika Mehta, Dr. Prakash Nair, Prof. Kavita Sharma
  - **3 Club Leads:** Riya Sen (CSE Club), Karan Verma (Coding Club), Ananya Joshi (Design Club)
  - **6 Students:** Abhinav Raman, Priya Sharma, Rohan Gupta, Sneha Patel, Arjun Nair, Meera Krishnan
  - **Academics:** 4 Courses, 8 Class Sections (Semesters V & VII), student enrollments
  - **30 Days of Slot-Level Attendance:** Generated with realistic ~84% Present, ~10% Absent, ~6% OD distribution
  - **Events & OD Requests:** Completed, upcoming, and pending events; approved ODs with attendance synced; pending medical leaves (ML)
  - **Channels & Chat:** Pre-populated section and club channels with historical conversation threads
  - **Marks & Certificates:** CLA-1 and CLA-2 exam marks, awarded and proposed certificates

### 3.2. Backend API Services
The Express API provides production-ready services for all v1 PRD domains:
1. **Authentication (`/api/auth`):**
   - Secure login using bcrypt and JWT.
   - HTTP-only cookie (`campus-token`) with 7-day expiration.
   - `GET /me` strictly omits `mobile_number` to satisfy PRD privacy requirements (AUTH-3).
2. **Attendance & Margin Calculation (`/api/attendance`):**
   - Dynamic calculation of attendance percentages and breakdown (Present, Absent, OD, ML).
   - **Margin Indicator:** Implements the PRD formula to show exact classes that can be missed before falling below 75%, or classes needed to recover.
   - Bulk attendance marking for section faculty (`POST /mark`) with input validation (up to 500 records).
3. **OD & Medical Leave (ML) Workflow (`/api/od`):**
   - Section enrollment verification before submission.
   - Verification of event attendance for OD requests.
   - Intelligent reviewer routing: Section faculty review ODs; assigned student Faculty Advisors (`advisorId`) review MLs.
   - Atomic approval transaction: Approving an OD/ML updates the request status and upserts the date's attendance record to `'OD'` or `'ML'`.
4. **Clubs & Events (`/api/clubs`, `/api/events`):**
   - Lifecycle: Club Lead creates $\to$ Faculty Coordinator approves $\to$ Students register $\to$ Lead marks attendance.
5. **Marks & Academics (`/api/marks`):**
   - Bulk upload endpoint for faculty (`POST /upload`) for CLA-1, CLA-2, and End Semester.
   - Student per-course marks viewing (`GET /my`).
6. **Certificates (`/api/certificates`):**
   - 3-step pipeline: Propose (Lead) $\to$ Approve (Faculty Coordinator) $\to$ Distribute (Lead) $\to$ Student View.
7. **Channels & Messages (`/api/channels`, `/api/messages`):**
   - Auto-mapped section and club channels.
   - Cursor-based message polling (`GET /:channelId/new?after=<ISO>`).
   - Read-only channels and per-member posting permission checks.
8. **Announcements (`/api/announcements`):**
   - Scoped notices (`system`, `section`, `club`) with role-based author permission enforcement.
9. **Timetable & GCR Sync (`/api/timetable`, `/api/gcr`):**
   - Slot timing mappings and today's schedule calculation.
   - Direct Google Classroom deep-link generation (`https://classroom.google.com/c/<gcrCourseId>`).

### 3.3. Frontend Features Connected to Live API
- **Session Management (`useAuth.ts`):** Performs real session validation against `/api/auth/me`, handles login redirects, and performs cookie logout.
- **Chat Workspace (`ChatWorkspace.tsx`):** Fully integrated into all three portals. Fetches user channels, displays message streams, polls every 5 seconds via `usePolling.ts`, and posts new messages directly to the API.

---

## 4. Known Issues & Persisting Bugs

### 🔴 Critical Issue 1: Login Page Quick Demo Buttons Mismatched with Seed Data
- **Location:** `apps/web/src/app/login/page.tsx` (lines 51–62)
- **Problem:** Quick demo helper buttons fill `student@campus.edu`, `faculty@campus.edu`, and `club@campus.edu` with password `password123`.
- **Root Cause:** The database seed script creates users with `@srm.edu` domains (e.g., `abhinav@srm.edu`, `s.iyer@srm.edu`, `riya.cse@srm.edu`) and password `campus123`.
- **Impact:** Clicking any Quick Demo button fails with `401 Invalid email or password`.

### 🔴 Critical Issue 2: Frontend Pages Running on Mock UI Data
- **Location:** All dashboard and sub-pages across `/student`, `/faculty`, and `/club` (except `/login` and `chats`).
- **Problem:** `apps/web/src/lib/api.ts` is only imported in `useAuth.ts` and `ChatWorkspace.tsx`.
- **Examples:**
  - `faculty/attendance/page.tsx` has a static roster array. Clicking "Save" triggers an 800ms `setTimeout` rather than calling `POST /api/attendance/mark`.
  - `student/attendance/page.tsx` runs on hardcoded course percentages and uses a `setTimeout` for OD/ML requests instead of `POST /api/od/request`.
  - `faculty/marks/page.tsx` does not submit marks to `POST /api/marks/upload`.
  - Dashboards display hardcoded widgets instead of consuming `/api/timetable/today` and `/api/attendance/my`.

### 🔴 Critical Issue 3: Hard Postgres/Supabase Prerequisite (No Local SQLite Option)
- **Problem:** The PRD requires running on either SQLite or Postgres. Currently, `schema.prisma` is locked to `provider = "postgresql"` and `apps/api/src/config/env.ts` throws fatal errors immediately on boot if `DATABASE_URL` or `DIRECT_URL` are missing.
- **Impact:** A freshly cloned repository cannot start without provisioning a PostgreSQL database first.

### 🟡 Warning Issue 4: Club Member Student Features Lockout
- **Problem:** In `apps/web/src/app/student/layout.tsx`, access is restricted to `user.role === Role.STUDENT || user.role === Role.ADMIN`.
- **Impact:** When a user with role `club_lead` logs in, they are redirected to `/club` and blocked from `/student`. Because `/club` does not contain pages for personal timetable, marks, or personal academic OD requests, club members cannot access their own student records.

### 🟡 Warning Issue 5: `pnpm lint` Fails in CI / Headless Environments
- **Problem:** `apps/web` lacks an ESLint configuration file (`.eslintrc.json`), causing Next.js to prompt interactively for configuration on `next lint`, which fails in Turbo. `apps/api` also lacks a `lint` script in `package.json`.

### 🟡 Warning Issue 6: API Production Build Path Structure
- **Problem:** Due to TypeScript path mappings to `packages/shared`, `tsc` outputs to `apps/api/dist/apps/api/src/index.js` rather than `apps/api/dist/index.js`. `apps/api/package.json` also lacks a `"start"` script.

### 🟡 Warning Issue 7: Minor PRD Feature Gaps
- **OD Bulk Approval (OD-5, P1):** API currently only supports single-request approval.
- **Event Channel Auto-Creation (CLUB-8, P2):** Approving an event does not automatically create a linked channel in the `channels` table.
- **CGPA Display (MARK-3):** The student dashboard displays a hardcoded "Cumulative GPA: 8.84", whereas the PRD states CGPA is out of scope for v1.

---

## 5. PRD Requirement Alignment Matrix

| ID | PRD Requirement | Priority | Backend API | Frontend UI | Status Summary |
|:---|:---|:---:|:---:|:---:|:---|
| **AUTH-1** | Role-based institutional login | P0 | ✅ Done | ✅ Done | Cookie-based JWT auth functional |
| **AUTH-2** | User sees only authorized role data | P0 | ✅ Done | ⚠️ Partial | Backend enforced; UI pages show mock data |
| **AUTH-3** | Mobile numbers never displayed in UI | P0 | ✅ Done | ✅ Done | Stripped from profile queries |
| **DATA-1..3** | Mock courses, sections, slots, timetable | P0 | ✅ Done | ⚠️ Mock | API complete; UI timetable is static |
| **COMM-1..4** | Channels (section, club), read-only, posting | P0 | ✅ Done | ✅ Done | Working in `ChatWorkspace.tsx` |
| **COMM-5** | Dashboard recent messages / channels | P1 | ✅ Done | ⚠️ Mock | Dashboard widgets display hardcoded previews |
| **COMM-6** | Student-to-faculty course-restricted DMs | P2 | ❌ Deferred | ❌ Deferred | Out of v1 prototype scope |
| **ATT-1** | Faculty mark Present / Absent / OD / ML | P0 | ✅ Done | ⚠️ Mock | Batch upsert ready in API; UI not wired |
| **ATT-2** | Student sees overall % and breakdown | P0 | ✅ Done | ⚠️ Mock | API summary ready; UI displays static 87.5% |
| **ATT-4** | Margin indicator (classes safe to miss before <75%) | P1 | ✅ Done | ⚠️ Mock | Calculation complete in service |
| **OD-1..3** | Student submits OD; Faculty approves; Attendance updates | P0 | ✅ Done | ⚠️ Mock | Atomic DB transaction in API; UI not wired |
| **OD-5** | Bulk approval for a section | P1 | ❌ Missing | ❌ Missing | Only single request review implemented |
| **ML-1..2** | Student submits ML; Faculty Advisor approves | P1 | ✅ Done | ⚠️ Mock | Advisor routing implemented in API |
| **CLUB-1..3** | Lead creates event; Faculty coordinator approves | P0 | ✅ Done | ⚠️ Mock | Full state machine in API |
| **CLUB-4..6** | Student event registration; Lead marks attendance | P0 | ✅ Done | ⚠️ Mock | Endpoints functional in API |
| **MARK-1..2** | Faculty upload marks; Students view own marks | P0 | ✅ Done | ⚠️ Mock | Upsert logic ready; UI uses static tables |
| **CERT-1..3** | Propose $\to$ Approve $\to$ Distribute certificate flow | P0 | ✅ Done | ⚠️ Mock | Backend pipeline ready |
| **ANN-1..2** | Scoped announcements (system, section, club) | P0 | ✅ Done | ⚠️ Mock | Scoped queries complete |
| **GCR-1..3** | GCR course mapping & "Open GCR" links | P0 | ✅ Done | ⚠️ Mock | Data model ready; UI uses placeholder links |

---

## 6. Getting Started & Setup Guide

### 6.1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **Package Manager:** `pnpm` (v9.0.0+)
- **PostgreSQL Database:** A local instance or a cloud database (e.g. Supabase, Neon)

### 6.2. Environment Setup
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Configure the following variables in `.env`:
   ```env
   # Database (Pooled and Direct connections)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

   # JWT Secret (minimum 32 characters in production)
   JWT_SECRET="super-secret-campus-portal-jwt-token-key-32chars"

   # Origins & Ports
   CORS_ORIGINS="http://localhost:3001"
   API_PORT=3000
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

### 6.3. Install Dependencies & Initialize Database
```bash
# Install monorepo dependencies
pnpm install

# Generate Prisma Client
pnpm db:generate

# Push database schema to PostgreSQL
pnpm db:push

# Seed realistic campus mock data
pnpm db:seed
```

### 6.4. Start Development Servers
```bash
pnpm dev
```
- **Web App:** [http://localhost:3001](http://localhost:3001)
- **API Server:** [http://localhost:3000](http://localhost:3000)
- **API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 7. Seeded Test Credentials

All seeded test accounts share the default password: **`campus123`**

| Role | Name | Email | Default Portal |
|:---|:---|:---|:---|
| **Student** | Abhinav Raman | `abhinav@srm.edu` | `/student` |
| **Student** | Priya Sharma | `priya@srm.edu` | `/student` |
| **Student** | Rohan Gupta | `rohan@srm.edu` | `/student` |
| **Faculty** | Dr. Sundar Iyer (DBMS) | `s.iyer@srm.edu` | `/faculty` |
| **Faculty** | Prof. Radhika Mehta (OS) | `r.mehta@srm.edu` | `/faculty` |
| **Faculty** | Dr. Prakash Nair (ML) | `p.nair@srm.edu` | `/faculty` |
| **Club Lead** | Riya Sen (CSE Club) | `riya.cse@srm.edu` | `/club` |
| **Club Lead** | Karan Verma (Coding Club) | `karan.code@srm.edu` | `/club` |
| **Admin** | Admin Officer | `admin@srm.edu` | `/student` (Announcements) |

---

## 8. Development Roadmap & Next Steps

1. **Immediate Quick Fixes:**
   - Update `handleQuickLogin` in `apps/web/src/app/login/page.tsx` to use the seeded credentials (`@srm.edu` / `campus123`).
   - Add `.eslintrc.json` (`{"extends": "next/core-web-vitals"}`) to `apps/web` and `"lint": "tsc --noEmit"` to `apps/api/package.json`.
   - Update `apps/web/src/app/student/layout.tsx` to allow `Role.CLUB_LEAD` access to personal student views.
2. **Wire Frontend to Ready API Endpoints:**
   - Connect student and faculty attendance views to `/api/attendance/*`.
   - Connect OD/ML request submission modals to `/api/od/request` and `/api/od/ml-request`.
   - Connect faculty approvals to `/api/od/:id/approve` and `/api/certificates/:id/approve`.
   - Connect marks entry forms to `/api/marks/upload`.
3. **Local Developer Experience (SQLite Fallback):**
   - Provide an optional SQLite configuration so developers can run and test the complete app offline without a live PostgreSQL server.
