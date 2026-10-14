# OneCampus: Unified Campus Platform for SRM
## Product Requirements Document (PRD), v1.1 (Prototype Scope)

| | |
|---|---|
| **Product** | OneCampus (UI brand: "Campus Portal") |
| **Owner** | Koraylo |
| **Version** | 1.1: scoped to a web-app prototype on mock data |
| **Audience** | Engineering leads, academic administration, partners |
| **Status** | Draft for review |
| **Sources** | Product Overview PDF, dashboard and architecture mockups, OneCampus Dummy Database reference |

---

## 1. Summary

SRM campus operations run across Zoho (attendance), WhatsApp (communication), Google Classroom (coursework), and paper/Shine (OD and certificates). OneCampus brings these into one role-based web app with one login, one roster, one timetable, and one attendance record.

**Tagline:** *One Platform. A Connected Campus.*

**v1 is a web-app prototype built on the supplied mock database.** Security hardening, encryption, backup, and several advanced features are deliberately deferred to the next version (Section 12).

## 2. Problem Statement

| Pain point | Impact today |
|---|---|
| Zoho silo | Attendance does not reflect OD or event participation dynamically |
| WhatsApp groups | Fragmented conversations, exposed phone numbers, no oversight |
| Google Classroom | Disconnected from the timetable and student records |
| Paper / Shine OD flow | Slow manual signatures, unverifiable certificates |

## 3. Goals and Non-Goals

### v1 Goals
1. One web app with three role-based portals: **Student, Faculty, Club Member**.
2. Auto-provisioned chat channels tied to sections, courses, and clubs.
3. Slot-level attendance with OD/ML handled inside the same record.
4. Club event lifecycle: create, faculty-coordinator approval, registration, attendance, certificates.
5. Google Classroom kept as a linked **integration** (stubbed mapping in v1).
6. Run entirely on the supplied mock database so every dashboard shows realistic data.

### Non-Goals (v1)
- HOD/Dean and Admin portals (the `admin` role exists in the data only to post system announcements).
- Geofencing, rotating QR check-in, and any mobile-native features.
- Live Zoho or Google Classroom API calls.
- Security hardening, encryption, backup (see Section 12).
- SLAs, legal/compliance review.

## 4. Users and Roles

| Portal | Role in data | Purpose |
|---|---|---|
| **Student** | `student` | Timetable, attendance, marks, events, chats, OD/ML requests |
| **Faculty** | `faculty` | Mark attendance, upload marks, approve OD/ML/certificates, announce |
| **Club Member** | `club_lead` | Run club, create events, registrations, event attendance, certificates |

Login routes each user to their portal based on `role`.

### Permissions (v1)

| Capability | Student | Faculty | Club Member |
|---|---|---|---|
| View personal timetable | Yes | Yes | Yes |
| Mark class attendance | No | Yes | No |
| Upload / view marks | View own | Upload, view | View own |
| Submit OD / ML request | Yes | No | Yes (as student) |
| Approve OD for their section | No | Yes | No |
| Approve ML request | No | Yes (faculty advisor only) | No |
| Create club event | No | No | Yes |
| Approve club event | No | Yes (faculty coordinator of that club only) | No |
| Mark event attendance | No | No | Yes |
| Propose / distribute certificates | No | Approve | Propose, distribute |
| Post announcements | No | Yes (section/batch) | Yes (club) |

---

## 5. Product Scope (v1)

1. **Core Data:** users, courses, class sections, enrollments loaded from mock data.
2. **Communication:** channels, members, messages.
3. **Attendance and OD/ML:** slot-based records plus request workflow.
4. **Clubs and Events:** clubs, events, registrations, event attendance.
5. **Marks:** per-course exam marks.
6. **Certificates:** proposal, approval, distribution.
7. **Announcements:** scoped notices.
8. **GCR Integration:** mapping table and status only.

---

## 6. Functional Requirements

Priority: **P0** = required for v1, **P1** = should have, **P2** = nice to have.

### 6.1 Authentication
| ID | Requirement | Priority |
|---|---|---|
| AUTH-1 | Basic login with institutional email; role determines which of the 3 portals loads | P0 |
| AUTH-2 | Each user sees only the data for their `user_id` and role | P0 |
| AUTH-3 | Mobile numbers are not shown anywhere in the UI | P0 |

### 6.2 Core Data
| ID | Requirement | Priority |
|---|---|---|
| DATA-1 | Load users, courses, class sections, and enrollments from the supplied mock database | P0 |
| DATA-2 | Class sections carry course code, faculty, section, slot, room, academic year | P0 |
| DATA-3 | Timetable view derived from enrolled sections (slot, room, faculty) | P0 |

### 6.3 Communication
| ID | Requirement | Priority |
|---|---|---|
| COMM-1 | Channel types: section, course, club, event | P0 |
| COMM-2 | Channels are created automatically from class sections, clubs, and events (no manual group creation) | P0 |
| COMM-3 | Read-only channel option for broadcasts; per-member posting rights | P0 |
| COMM-4 | Post and view messages in a channel | P0 |
| COMM-5 | Recent messages and channel list on each dashboard | P1 |
| COMM-6 | Student-to-faculty DMs limited to enrolled courses | P2 |

### 6.4 Attendance and OD/ML
| ID | Requirement | Priority |
|---|---|---|
| ATT-1 | Faculty mark per-student, per-section, per-date attendance: Present / Absent / OD | P0 |
| ATT-2 | Student sees overall attendance % and Present/Absent/OD breakdown | P0 |
| ATT-3 | Faculty see section-level and average attendance | P1 |
| ATT-4 | Margin indicator: classes that can be missed before dropping below 75% | P1 |
| OD-1 | Student submits an OD request for an event, choosing the affected class sections | P0 |
| OD-2 | Request goes to the faculty of each affected section; faculty approve or reject | P0 |
| OD-3 | On approval, that day's attendance for the section changes to OD | P0 |
| OD-4 | Faculty see event name, club, date, and student's current attendance % when deciding | P1 |
| OD-5 | Bulk approval for a section | P1 |
| ML-1 | Student submits an ML (medical leave) request | P1 |
| ML-2 | ML requests are approved by the student's **faculty advisor** | P1 |

### 6.5 Clubs and Events
| ID | Requirement | Priority |
|---|---|---|
| CLUB-1 | Each club has a faculty coordinator (`faculty_coordinator_id`) | P0 |
| CLUB-2 | Club member creates an event (title, date, venue, description); it starts as **Pending Approval** | P0 |
| CLUB-3 | The club's faculty coordinator approves or rejects the event; approved events become Upcoming | P0 |
| CLUB-4 | Students see approved events and register | P0 |
| CLUB-5 | Club view of registrations per event | P0 |
| CLUB-6 | Club member marks each registrant as attended (manual in v1) | P0 |
| CLUB-7 | Event status flow: Pending Approval, Upcoming, Ongoing, Completed, Cancelled | P1 |
| CLUB-8 | A time-boxed event channel is created for approved events | P2 |

### 6.6 Marks
| ID | Requirement | Priority |
|---|---|---|
| MARK-1 | Faculty enter marks per student, course, and exam type (CLA-1, CLA-2, End Semester) | P0 |
| MARK-2 | Students view their marks per course | P0 |
| MARK-3 | CGPA is not computed in v1 (no grade-point data in the mock set) | P2 |

### 6.7 Certificates
| ID | Requirement | Priority |
|---|---|---|
| CERT-1 | Club member proposes a certificate for a student and event | P0 |
| CERT-2 | Faculty approve proposed certificates | P0 |
| CERT-3 | Status flow: Proposed, Approved, Distributed; students view their certificates | P0 |
| CERT-4 | Approver for club certificates is assumed to be the club's faculty coordinator (to be confirmed) | P1 |

### 6.8 Announcements
| ID | Requirement | Priority |
|---|---|---|
| ANN-1 | Faculty post section/batch announcements; club members post club announcements | P0 |
| ANN-2 | Announcements appear in the relevant dashboards, newest first | P0 |
| ANN-3 | Seeded system announcements (e.g., from admin) display to all students | P1 |

### 6.9 Google Classroom Integration
| ID | Requirement | Priority |
|---|---|---|
| GCR-1 | Each class section can be mapped to a GCR course id (`gcr_sync`) with a sync status | P0 |
| GCR-2 | Dashboards show an "Open GCR" link for mapped sections | P0 |
| GCR-3 | v1 uses placeholder ids; no live Google API calls | P0 |
| GCR-4 | Real two-way sync (rosters, coursework) | Next version |

### 6.10 Dashboards
| Portal | v1 widgets |
|---|---|
| **Student** | Greeting; attendance %; upcoming classes (from timetable); events with Register; recent announcements; chats; marks; quick links (timetable, OD/ML request, GCR) |
| **Faculty** | My classes (course, section, student count); today's schedule; quick actions (mark attendance, upload marks, create announcement, open GCR); pending approvals (OD, ML, certificates); recent messages; attendance overview |
| **Club Member** | My club; upcoming events with Manage; event registrations with counts; quick actions (create event, mark event attendance, propose certificate, post announcement); club channel |

---

## 7. Data Model

Based on the supplied dummy database. Tables: `users`, `courses`, `class_sections`, `enrollments`, `channels`, `channel_members`, `messages`, `attendance`, `od_requests`, `clubs`, `events`, `event_registrations`, `marks`, `certificates`, `announcements`, `gcr_sync`.

### 7.1 Service-to-Table Map

| Service | Reads / Writes |
|---|---|
| Authentication & Authorization | `users` |
| User Management | `users` |
| Chat & Messaging | `channels`, `channel_members`, `messages` |
| Event Management | `clubs`, `events`, `event_registrations` |
| Attendance | `class_sections`, `attendance`, `od_requests` |
| Marks & Academics | `courses`, `class_sections`, `enrollments`, `marks` |
| Notification | `announcements` |
| GCR Integration | `gcr_sync` |
| Reporting & Analytics | Read-only over all tables |

### 7.2 Schema Changes Needed for the Decisions Above

The mock schema does not yet support every v1 decision. These small additions are required:

| Change | Why |
|---|---|
| `events.status` add value `Pending Approval` (and `Rejected`) | Faculty-coordinator approval of club events |
| `events.approved_by` (FK to `users`) | Record who approved |
| `od_requests.request_type` (`OD` / `ML`) | Handle ML in the same workflow |
| `attendance.status` add `ML` | Show approved medical leave |
| `users.advisor_id` (FK to `users`), set for students | Route ML to the faculty advisor |
| `od_requests.requested_date` | OD is per date, since events only store a date, not times |
| Role label: display `club_lead` as "Club Member" | Matches the 3-portal naming |

### 7.3 Data Rules
- `mobile_number` stays NULL in the mock data and is never displayed.
- One attendance row per student, section, and date (existing unique constraint).
- Only the faculty of a class section may mark its attendance or decide its OD requests.

---

## 8. Key User Flows

**OD flow (v1, no geofencing/QR)**
1. Club member creates an event; the club's faculty coordinator approves it.
2. Student registers; club member marks them **attended** after the event.
3. Student submits an OD request for that event, selecting affected class sections.
4. Each affected section's faculty approves or rejects.
5. On approval, that date's attendance becomes **OD** and the percentage recalculates.

**ML flow**
1. Student submits an ML request. 2. Faculty advisor approves or rejects. 3. Attendance for those dates becomes **ML**.

**Certificate flow**
1. Club member proposes. 2. Faculty approves. 3. Club member distributes; student sees it in their portal.

---

## 9. Non-Functional Requirements (v1)

| Category | Requirement |
|---|---|
| Platform | Responsive web app in the browser; no native mobile app |
| Data | Runs on SQLite or Postgres using the supplied schema and seed data |
| Performance | Dashboards load acceptably on prototype data volumes (no formal targets in v1) |
| Reset | Database can be rebuilt from `schema.sql` + `seed.sql` in under a minute |

Formal SLAs (uptime, latency, retention) are out of scope for v1.

---

## 10. Release Plan (v1)

| Phase | Scope |
|---|---|
| **1. Foundation** | Schema + seed data, login by role, three dashboard shells, timetable |
| **2. Attendance and OD/ML** | Attendance marking and views, OD/ML requests and approvals |
| **3. Clubs and Events** | Event creation, coordinator approval, registration, event attendance |
| **4. Communication and Notices** | Channels, messages, announcements |
| **5. Marks, Certificates, GCR link** | Marks entry/view, certificate flow, GCR mapping and links |

## 11. Risks

| Risk | Mitigation |
|---|---|
| Mock data too thin to demo well | Extend seed data (more students, sections, events) as needed |
| Events lack time of day, so OD is date-based | Accepted for v1; add start/end times next version |
| Approval chains need data that is missing (advisor, coordinator) | Add the schema changes in 7.2 and seed them |

## 12. Deferred to the Next Version

**Security, encryption, and backup (explicitly postponed):**
- SSO via SAML 2.0 / OAuth2, JWT access/refresh token policy
- Encryption at rest and in transit hardening, secrets management
- Zero-PII enforcement at the API layer
- Immutable audit logs
- Backups and disaster recovery
- SHA-256 certificate hashing and QR verification

**Features:**
- Geofenced, rotating-QR event check-in
- HOD/Dean and Admin portals, system settings, user management UI
- Live Zoho sync and live Google Classroom sync
- Content hub, assignments, grading, plagiarism analysis
- Chat moderation, rich messaging, DM rules
- Certificate designer, verified profile and digital CV
- Event analytics, member engagement, reports
- CGPA computation, SLAs, legal and compliance review

## 13. Open Questions

1. Who approves **certificates**: the club's faculty coordinator or any faculty? (No answer given; assumed coordinator in CERT-4.)
2. Can a club member submit OD for events they organize, and does the coordinator also count as an affected-class faculty?
3. How is a student's **faculty advisor** assigned in the mock data?
4. Should the Admin role have any login in v1, or exist only as seeded data?

## 14. Glossary

**OD:** On-Duty. **ML:** Medical Leave. **GCR:** Google Classroom. **CLA:** Continuous Learning Assessment. **PRD:** Product Requirements Document.
