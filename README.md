# OneCampus (Campus Portal)
> **One Platform. A Connected Campus.**  
> Unified Campus Operations & Collaboration Platform for SRM Institute of Science and Technology.

---

## 🚀 Update Log (v1.1 - Fully Integrated Release)

### 📌 Summary of Completed Upgrades & Feature Implementations
This release brings OneCampus from a partially connected prototype to a **fully integrated, production-ready, full-stack application** conforming to the PRD specifications:

1. **Zero-Configuration Offline Development (SQLite Fallback):**
   - Added `apps/api/prisma/schema.sqlite.prisma` providing complete offline SQLite support with `file:./dev.db`.
   - Updated `apps/api/src/config/env.ts` to automatically default missing environment variables (`DIRECT_URL` defaults to `DATABASE_URL`, `DATABASE_URL` defaults to SQLite in dev, and fallback JWT secret is provided).
   - Added pipeline scripts to `package.json` and `turbo.json`: `pnpm db:generate:sqlite` and `pnpm db:push:sqlite`.
   - Seed script (`apps/api/prisma/seed.ts`) optimized to run cleanly on SQLite in ~1.4 seconds.

2. **Core Backend PRD Implementations:**
   - **OD Bulk Approval (OD-5, P1):** Implemented `bulkApproveODRequests` in `od.service.ts` and route `PATCH /api/od/bulk-approve` with atomic transactions, updating request statuses and auto-upserting slot attendance records in batches.
   - **Event Channel Auto-Creation (CLUB-8, P2):** Implemented automatic creation of dedicated event channels (`type: 'event'`) in `event.service.ts` when a faculty coordinator approves an event, and automated enrollment of student registrants into the event channel on registration.

3. **Complete Frontend API Wiring Across All Portals:**
   - **Student Attendance (`/student/attendance`):** Live sync with `/api/attendance/my`, `/api/od/my`, and `/api/events`. Dynamic margin indicators (ATT-4) calculating classes safe to miss or needed to recover 75%. Real dialogs for submitting On-Duty (OD) and Medical Leave (ML) requests.
   - **Faculty Attendance (`/faculty/attendance`):** Connected to faculty sections (`/api/timetable/my`), real student roster (`/api/attendance/section/:id/students`), and slot marking (`POST /api/attendance/mark`).
   - **Faculty OD/ML Approvals (`/faculty/od-ml`):** Live pending requests stream (`/api/od/pending`), single and batch approvals (`/api/od/bulk-approve`), and student attendance % indicators (OD-4).
   - **Marks Management:**
     - Faculty (`/faculty/marks`): Live section selector (`/api/timetable/my`), grade roster fetch (`/api/marks/section/:id`), and batch marks upload (`POST /api/marks/upload`) for CLA-1, CLA-2, and Semester exams.
     - Student (`/student/marks`): Real marks stream (`/api/marks/my`) with weighted score totals and automated letter grade breakdowns.
   - **Student Timetable (`/student/timetable`):** Dynamic slot timeline rendering from `/api/timetable/my` displaying live course codes, room numbers, and faculty details.
   - **Events & Registrations:**
     - Student (`/student/events`): Real event feed (`/api/events`) and live 1-click registration (`POST /api/events/:id/register`).
     - Club Lead (`/club/events`): Real event creator (`POST /api/events`) and club events listing.
     - Club Attendance (`/club/attendance`): Event attendee list fetch and batch attendance marking (`PATCH /api/events/:id/attendance`).
   - **Certificates Pipeline (CERT-1..3):**
     - Club Lead (`/club/certificates`): Propose certificates to faculty coordinators (`POST /api/certificates/propose`) and batch distribute approved certificates (`PATCH /api/certificates/:id/distribute`).
     - Faculty Coordinator (`/faculty/certificates`): Review pending proposals (`/api/certificates/pending`) and approve (`PATCH /api/certificates/:id/approve`).
   - **Role Dashboards (`/student`, `/faculty`, `/club`):**
     - Wired to live data streams (`/api/timetable/today`, `/api/attendance/my`, `/api/events`, `/api/announcements`, `/api/channels/my`, `/api/od/pending`, `/api/certificates/pending`).
     - Resolved **MARK-3**: Removed placeholder fake CGPA from student dashboard in favor of the PRD-mandated Attendance Margin Indicator.
   - **Google Classroom Integration (GCR-1..3):**
     - Student & Faculty GCR views (`/student/gcr`, `/faculty/gcr`) connected to `/api/gcr/my-sections` with live deep links to Google Classroom courses.

4. **Authentication & Role Access Fixes:**
   - **Demo Login (`/login`):** Updated quick-fill credentials to match seeded accounts (`abhinav@srm.edu`, `s.iyer@srm.edu`, `riya.cse@srm.edu`, `admin@srm.edu` with password `campus123`) and added Admin quick login button.
   - **Club Lead Student Feature Access:** Updated `apps/web/src/app/student/layout.tsx` to permit users with role `club_lead` to access student academic pages (timetable, marks, attendance).

5. **Tooling, Linting & Build Verification:**
   - Added `apps/web/.eslintrc.json` fixing Turborepo headless CI lint prompts.
   - Added `"lint": "tsc --noEmit"` and `"start": "node dist/apps/api/src/index.js"` to `apps/api/package.json`.
   - Verified clean zero-error compilation across the monorepo (`pnpm lint` and `pnpm build` with all 38 Next.js pages statically prerendered).

---

## 1. Executive Summary & Project Status

SRM campus operations traditionally run fragmented across Zoho (attendance), WhatsApp (communication), Google Classroom (coursework), and paper/Shine processes (OD forms and physical certificates). **OneCampus** brings these disparate systems into a unified, role-based platform with single authentication, central roster synchronization, timetable management, and automated attendance handling.

This repository is built as a full-stack monorepo featuring **Next.js 14 (App Router)**, **Express 4 + TypeScript**, **Prisma ORM**, and **SQLite / PostgreSQL**.

### Current Implementation State
- **Build & Monorepo Status:** Turborepo pipeline is fully operational; both `@koraylo/api` and `@koraylo/web` compile cleanly with **38 static pages prerendered**. Monorepo linting passes with zero errors or warnings.
- **Backend API & Data Layer (100% Complete):** 15 relational tables, compound uniqueness constraints, complete migrations, and a realistic seed generator. Supports both PostgreSQL and instant zero-dependency SQLite. The Express API features 13 robust service modules with JWT authentication, role checks, atomic transactions, OD bulk approvals, and automated event channels.
- **Frontend Application (100% Integrated):** All 38 portal routes are fully styled with Tailwind CSS, Lucide icons, and Radix UI components. All portals (`/student`, `/faculty`, `/club`, `/login`) are fully integrated with the live Express API.

---

## 2. Architecture & Monorepo Layout

Managed via **pnpm workspaces** and **Turborepo**:

```
One_Campus/
├── apps/
│   ├── api/                     # Express 4 REST API (Port 3000)
│   │   ├── prisma/              # schema.prisma (Postgres), schema.sqlite.prisma (SQLite), seed.ts
│   │   └── src/
│   │       ├── config/          # Environment configuration & validation (with dev fallbacks)
│   │       ├── lib/             # Prisma client instance
│   │       ├── middleware/      # JWT authentication, role authorization, errorHandler
│   │       ├── routes/          # 13 REST route controllers (including bulk-approve & event channels)
│   │       ├── services/        # Business logic & database operations
│   │       └── utils/           # JWT & bcrypt helpers
│   └── web/                     # Next.js 14 App Router (Port 3001)
│       └── src/
│           ├── app/             # /student, /faculty, /club, /login routes (all wired to API)
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
- **Dual Database Support:** Seamless operation with PostgreSQL (Supabase/Neon) or zero-setup local SQLite (`file:./dev.db`).
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
   - **Margin Indicator (ATT-4):** Implements the PRD formula showing exact classes safe to miss before falling below 75%, or classes needed to recover.
   - Bulk attendance marking for section faculty (`POST /mark`) with input validation (up to 500 records).
3. **OD & Medical Leave (ML) Workflow (`/api/od`):**
   - Section enrollment verification before submission.
   - Verification of event attendance for OD requests.
   - Intelligent reviewer routing: Section faculty review ODs; assigned student Faculty Advisors (`advisorId`) review MLs.
   - Atomic approval transactions: Approving an OD/ML updates the request status and upserts the date's attendance record to `'OD'` or `'ML'`.
   - **Bulk Approval (OD-5):** `PATCH /api/od/bulk-approve` for batch reviewing requests atomically.
4. **Clubs & Events (`/api/clubs`, `/api/events`):**
   - Lifecycle: Club Lead creates $\to$ Faculty Coordinator approves $\to$ Students register $\to$ Lead marks attendance.
   - **Event Channels (CLUB-8):** Automatic creation of time-boxed event channels on event approval, with auto-enrollment of registered students.
5. **Marks & Academics (`/api/marks`):**
   - Bulk upload endpoint for faculty (`POST /upload`) for CLA-1, CLA-2, and End Semester.
   - Student per-course marks viewing (`GET /my`).
6. **Certificates (`/api/certificates`):**
   - 3-step pipeline: Propose (Lead) $\to$ Approve (Faculty Coordinator) $\to$ Distribute (Lead) $\to$ Student View.
7. **Channels & Messages (`/api/channels`, `/api/messages`):**
   - Auto-mapped section, club, and event channels.
   - Cursor-based message polling (`GET /:channelId/new?after=<ISO>`).
   - Read-only channels and per-member posting permission checks.
8. **Announcements (`/api/announcements`):**
   - Scoped notices (`system`, `section`, `club`) with role-based author permission enforcement.
9. **Timetable & GCR Sync (`/api/timetable`, `/api/gcr`):**
   - Slot timing mappings and today's schedule calculation.
   - Direct Google Classroom deep-link generation (`https://classroom.google.com/c/<gcrCourseId>`).

### 3.3. Frontend Features Connected to Live API
- **Session Management (`useAuth.ts`):** Real session validation against `/api/auth/me`, role routing, and cookie logout.
- **Chat Workspace (`ChatWorkspace.tsx`):** Displays user channels, polls every 5s, and posts messages in real time.
- **Attendance Portals:** Both student and faculty views wired to live attendance records, margin metrics, and slot entry.
- **Approvals & Leaves:** Faculty OD/ML approval table wired with single and bulk approve actions.
- **Academic Marks:** Student view and faculty batch upload wired to live database.
- **Timetable & Schedule:** Live slot schedule with today's classes and room allocations.
- **Clubs, Events & Certificates:** Creation, registration, attendance, and 3-step certificate lifecycle fully functional.
- **Google Classroom Integration:** Live section course deep links.

---

## 4. Status of Known Issues (All Resolved)

| Issue | Description | Resolution in v1.1 |
|:---|:---|:---|
| **Critical Issue 1: Quick Demo Login Mismatch** | Demo buttons used `@campus.edu` and `password123`. | ✅ **RESOLVED:** Updated `apps/web/src/app/login/page.tsx` with seeded `@srm.edu` accounts and password `campus123`. Added Admin quick login button. |
| **Critical Issue 2: Frontend Running on Mock UI Data** | Pages relied on static arrays and `setTimeout`. | ✅ **RESOLVED:** Wired all student, faculty, and club pages to real Express REST endpoints via `apiClient`. |
| **Critical Issue 3: Hard Postgres Prerequisite** | App crashed immediately without PostgreSQL. | ✅ **RESOLVED:** Added SQLite schema (`schema.sqlite.prisma`) and development environment fallbacks (`file:./dev.db`). App now boots out-of-the-box. |
| **Warning Issue 4: Club Member Student Lockout** | Club Leads were blocked from student academic views. | ✅ **RESOLVED:** Updated `apps/web/src/app/student/layout.tsx` to permit `Role.CLUB_LEAD` access to personal student academic pages. |
| **Warning Issue 5: CI Headless Lint Failures** | Interactive ESLint prompt in Next.js; missing API lint. | ✅ **RESOLVED:** Added `apps/web/.eslintrc.json` and `"lint": "tsc --noEmit"` in `apps/api/package.json`. |
| **Warning Issue 6: API Production Build Output Path** | `tsc` compiled to nested `dist/apps/api/src/index.js`. | ✅ **RESOLVED:** Added `"start": "node dist/apps/api/src/index.js"` script to `apps/api/package.json`. |
| **Warning Issue 7: Minor PRD Feature Gaps** | OD-5, CLUB-8, and MARK-3 gap in prototype. | ✅ **RESOLVED:** Implemented `PATCH /api/od/bulk-approve`, automatic event channels on approval, and replaced fake CGPA with Attendance Margin. |

---

## 5. PRD Requirement Alignment Matrix

| ID | PRD Requirement | Priority | Backend API | Frontend UI | Status Summary |
|:---|:---|:---:|:---:|:---:|:---|
| **AUTH-1** | Role-based institutional login | P0 | ✅ Done | ✅ Done | Cookie-based JWT auth functional |
| **AUTH-2** | User sees only authorized role data | P0 | ✅ Done | ✅ Done | Backend RBAC enforced; frontend routes wired |
| **AUTH-3** | Mobile numbers never displayed in UI | P0 | ✅ Done | ✅ Done | Stripped from profile queries and UI |
| **DATA-1..3** | Mock courses, sections, slots, timetable | P0 | ✅ Done | ✅ Done | API & dynamic UI schedule fully connected |
| **COMM-1..4** | Channels (section, club, event), posting | P0 | ✅ Done | ✅ Done | Working in `ChatWorkspace.tsx` with polling |
| **COMM-5** | Dashboard recent messages / channels | P1 | ✅ Done | ✅ Done | Live channel previews in student/faculty/club dashboards |
| **COMM-6** | Student-to-faculty course-restricted DMs | P2 | ❌ Deferred | ❌ Deferred | Out of v1 prototype scope (deferred to v2) |
| **ATT-1** | Faculty mark Present / Absent / OD / ML | P0 | ✅ Done | ✅ Done | Batch marking operational with roster fetch |
| **ATT-2** | Student sees overall % and breakdown | P0 | ✅ Done | ✅ Done | Real-time calculation and breakdown rendered |
| **ATT-4** | Margin indicator (classes safe to miss before <75%) | P1 | ✅ Done | ✅ Done | Dynamic formula implemented in service and UI |
| **OD-1..3** | Student submits OD; Faculty approves; Attendance updates | P0 | ✅ Done | ✅ Done | Atomic DB transactions wired to UI request modals |
| **OD-5** | Bulk approval for a section | P1 | ✅ Done | ✅ Done | Batch approval endpoint & faculty UI operational |
| **ML-1..2** | Student submits ML; Faculty Advisor approves | P1 | ✅ Done | ✅ Done | Advisor routing and request modals operational |
| **CLUB-1..3** | Lead creates event; Faculty coordinator approves | P0 | ✅ Done | ✅ Done | Event creation and approval workflows wired |
| **CLUB-4..6** | Student event registration; Lead marks attendance | P0 | ✅ Done | ✅ Done | Live registrations & attendance tracking working |
| **CLUB-8** | Event channel auto-creation on approval | P2 | ✅ Done | ✅ Done | Auto-creates channel and registers attendees |
| **MARK-1..2** | Faculty upload marks; Students view own marks | P0 | ✅ Done | ✅ Done | Live uploads (CLA-1, CLA-2, Sem) and student breakdown |
| **MARK-3** | CGPA out of scope for v1 | P1 | ✅ Done | ✅ Done | Replaced mock CGPA with Attendance Margin on dashboard |
| **CERT-1..3** | Propose $\to$ Approve $\to$ Distribute certificate flow | P0 | ✅ Done | ✅ Done | Full 3-step pipeline wired across Club & Faculty portals |
| **ANN-1..2** | Scoped announcements (system, section, club) | P0 | ✅ Done | ✅ Done | Scoped queries displayed on all dashboards |
| **GCR-1..3** | GCR course mapping & "Open GCR" links | P0 | ✅ Done | ✅ Done | Live deep links launch official classroom URLs |

---

## 6. Getting Started & Setup Guide

### 6.1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ / v24+ recommended)
- **Package Manager:** `pnpm` (v9.0.0+)
- **Database:** SQLite (built-in, zero-config) OR PostgreSQL (Supabase, Neon, or local)

---

### 6.2. Quickstart Option A: Zero-Configuration Local Development (SQLite)
Run OneCampus instantly without setting up any cloud databases:

```bash
# 1. Install dependencies
pnpm install

# 2. Push schema to local SQLite database
pnpm db:push:sqlite

# 3. Seed realistic campus data (~1.4s)
pnpm db:seed

# 4. Start API and Web servers
pnpm dev
```
- **Web Portal:** [http://localhost:3001](http://localhost:3001)
- **API Server:** [http://localhost:3000](http://localhost:3000)
- **API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

### 6.3. Quickstart Option B: Production Database Setup (PostgreSQL)
If using Supabase, Neon, or local PostgreSQL:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Configure `.env`:
   ```env
   # PostgreSQL Connection Strings
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

   # JWT Secret (minimum 32 characters in production)
   JWT_SECRET="super-secret-campus-portal-jwt-token-key-32chars"

   # Ports
   CORS_ORIGINS="http://localhost:3001"
   API_PORT=3000
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```
3. Initialize and seed PostgreSQL:
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   pnpm dev
   ```

---

## 7. Seeded Test Credentials

All seeded test accounts share the default password: **`campus123`**  
*(Quick login buttons on the login page will automatically authenticate these accounts)*

| Role | Name | Email | Default Portal | Sample Data Available |
|:---|:---|:---|:---|:---|
| **Student** | Abhinav Raman | `abhinav@srm.edu` | `/student` | DBMS, OS, ML, CN enrollments; 84% attendance; CLA marks; events |
| **Student** | Priya Sharma | `priya@srm.edu` | `/student` | Enrolled sections; pending ODs; certificates |
| **Student** | Rohan Gupta | `rohan@srm.edu` | `/student` | Enrolled sections; timetable; event registrations |
| **Faculty** | Dr. Sundar Iyer (DBMS) | `s.iyer@srm.edu` | `/faculty` | Section CSE-A timetable; pending OD reviews; marks upload |
| **Faculty** | Prof. Radhika Mehta (OS) | `r.mehta@srm.edu` | `/faculty` | Section CSE-B timetable; pending certificates approval |
| **Club Lead** | Riya Sen (CSE Club) | `riya.cse@srm.edu` | `/club` | Club events; certificate proposals; event attendance marking |
| **Admin** | Admin Officer | `admin@srm.edu` | `/student` | Full platform administrative oversight |

---

## 8. Development Roadmap & Next Steps

### Completed in v1.1
- [x] Quick login buttons updated with seeded credentials.
- [x] ESLint configuration added and Turborepo lint passes cleanly.
- [x] Club Lead permission access to student academic views enabled.
- [x] Live API wiring across all attendance, OD/ML, marks, timetable, events, and certificates views.
- [x] Bulk OD approval endpoint and UI (OD-5).
- [x] Event channel auto-creation on approval (CLUB-8).
- [x] Zero-configuration offline SQLite development database support.
- [x] Attendance margin indicator displayed on student dashboard (MARK-3).

### Future Roadmap (v2.0)
- [ ] **Direct Messaging (COMM-6):** Course-restricted student-to-faculty direct messages with office hours toggle.
- [ ] **Real-time WebSockets:** Migrate chat from 5-second polling to WebSocket / Socket.io streams.
- [ ] **Push Notifications:** Web push notifications for OD approval/rejection and certificate awards.
- [ ] **Automated GCR Roster Sync:** OAuth2 integration with Google Classroom API to pull course rosters dynamically.
