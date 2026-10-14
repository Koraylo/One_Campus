import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env configuration
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Campus Portal Comprehensive Seed ---');

  // 1. Clean existing data in reverse foreign key order
  console.log('Cleaning up existing database records...');
  await prisma.message.deleteMany();
  await prisma.channelMember.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.oDRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.gCRSync.deleteMany();
  await prisma.event.deleteMany();
  await prisma.club.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.classSection.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('campus123', 10);

  // 2. Create Users
  console.log('Creating users...');
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Officer',
      email: 'admin@srm.edu',
      passwordHash: hashedPassword,
      role: 'admin',
      department: 'Academic Operations',
    },
  });

  // Faculty (4 faculty members)
  const f1 = await prisma.user.create({
    data: {
      name: 'Dr. Sundar Iyer',
      email: 's.iyer@srm.edu',
      passwordHash: hashedPassword,
      role: 'faculty',
      department: 'Computer Science and Engineering',
    },
  });

  const f2 = await prisma.user.create({
    data: {
      name: 'Prof. Radhika Mehta',
      email: 'r.mehta@srm.edu',
      passwordHash: hashedPassword,
      role: 'faculty',
      department: 'Computer Science and Engineering',
    },
  });

  const f3 = await prisma.user.create({
    data: {
      name: 'Dr. Prakash Nair',
      email: 'p.nair@srm.edu',
      passwordHash: hashedPassword,
      role: 'faculty',
      department: 'Computer Science and Engineering',
    },
  });

  const f4 = await prisma.user.create({
    data: {
      name: 'Prof. Kavita Sharma',
      email: 'k.sharma@srm.edu',
      passwordHash: hashedPassword,
      role: 'faculty',
      department: 'Computer Science and Engineering',
    },
  });

  // Club Leads (3 club leads)
  const cl1 = await prisma.user.create({
    data: {
      name: 'Riya Sen',
      email: 'riya.cse@srm.edu',
      passwordHash: hashedPassword,
      role: 'club_lead',
      department: 'Computer Science and Engineering',
      year: 3,
      section: 'A',
    },
  });

  const cl2 = await prisma.user.create({
    data: {
      name: 'Karan Verma',
      email: 'karan.code@srm.edu',
      passwordHash: hashedPassword,
      role: 'club_lead',
      department: 'Computer Science and Engineering',
      year: 3,
      section: 'B',
    },
  });

  const cl3 = await prisma.user.create({
    data: {
      name: 'Ananya Joshi',
      email: 'ananya.design@srm.edu',
      passwordHash: hashedPassword,
      role: 'club_lead',
      department: 'Computer Science and Engineering',
      year: 4,
      section: 'A',
    },
  });

  // Students (6 students)
  const s1 = await prisma.user.create({
    data: {
      name: 'Abhinav Raman',
      email: 'abhinav@srm.edu',
      passwordHash: hashedPassword,
      role: 'student',
      department: 'Computer Science and Engineering',
      year: 3,
      section: 'A',
    },
  });

  const s2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@srm.edu',
      passwordHash: hashedPassword,
      role: 'student',
      department: 'Computer Science and Engineering',
      year: 3,
      section: 'A',
    },
  });

  const s3 = await prisma.user.create({
    data: {
      name: 'Rohan Gupta',
      email: 'rohan@srm.edu',
      passwordHash: hashedPassword,
      role: 'student',
      department: 'Computer Science and Engineering',
      year: 3,
      section: 'B',
    },
  });

  const s4 = await prisma.user.create({
    data: {
      name: 'Sneha Patel',
      email: 'sneha@srm.edu',
      passwordHash: hashedPassword,
      role: 'student',
      department: 'Computer Science and Engineering',
      year: 4,
      section: 'A',
    },
  });

  const s5 = await prisma.user.create({
    data: {
      name: 'Arjun Nair',
      email: 'arjun@srm.edu',
      passwordHash: hashedPassword,
      role: 'student',
      department: 'Computer Science and Engineering',
      year: 4,
      section: 'B',
    },
  });

  const s6 = await prisma.user.create({
    data: {
      name: 'Meera Krishnan',
      email: 'meera@srm.edu',
      passwordHash: hashedPassword,
      role: 'student',
      department: 'Computer Science and Engineering',
      year: 4,
      section: 'A',
    },
  });

  // 3. Create Courses
  console.log('Creating courses...');
  const c1 = await prisma.course.create({
    data: {
      code: 'CS301',
      name: 'Database Management Systems',
      credits: 3,
    },
  });

  const c2 = await prisma.course.create({
    data: {
      code: 'CS302',
      name: 'Operating Systems',
      credits: 3,
    },
  });

  const c3 = await prisma.course.create({
    data: {
      code: 'CS401',
      name: 'Machine Learning',
      credits: 4,
    },
  });

  const c4 = await prisma.course.create({
    data: {
      code: 'CS450',
      name: 'AI Ethics & Society',
      credits: 2,
    },
  });

  // 4. Create Class Sections (8 sections across Semesters V and VII)
  console.log('Creating class sections...');
  const sec1 = await prisma.classSection.create({
    data: {
      courseId: c1.id,
      facultyId: f1.id,
      sectionName: 'CSE-V-A',
      slot: 'A1',
      room: 'TP-401',
      academicYear: '2026-2027',
      semester: 'V',
      advisorId: f1.id,
    },
  });

  const sec2 = await prisma.classSection.create({
    data: {
      courseId: c1.id,
      facultyId: f2.id,
      sectionName: 'CSE-V-B',
      slot: 'A2',
      room: 'TP-402',
      academicYear: '2026-2027',
      semester: 'V',
      advisorId: f1.id,
    },
  });

  const sec3 = await prisma.classSection.create({
    data: {
      courseId: c2.id,
      facultyId: f3.id,
      sectionName: 'CSE-V-A',
      slot: 'B1',
      room: 'TP-403',
      academicYear: '2026-2027',
      semester: 'V',
      advisorId: f2.id,
    },
  });

  const sec4 = await prisma.classSection.create({
    data: {
      courseId: c2.id,
      facultyId: f4.id,
      sectionName: 'CSE-V-B',
      slot: 'B2',
      room: 'TP-404',
      academicYear: '2026-2027',
      semester: 'V',
      advisorId: f2.id,
    },
  });

  const sec5 = await prisma.classSection.create({
    data: {
      courseId: c3.id,
      facultyId: f1.id,
      sectionName: 'CSE-VII-A',
      slot: 'C1',
      room: 'UB-601',
      academicYear: '2026-2027',
      semester: 'VII',
      advisorId: f3.id,
    },
  });

  const sec6 = await prisma.classSection.create({
    data: {
      courseId: c3.id,
      facultyId: f2.id,
      sectionName: 'CSE-VII-B',
      slot: 'C2',
      room: 'UB-602',
      academicYear: '2026-2027',
      semester: 'VII',
      advisorId: f3.id,
    },
  });

  const sec7 = await prisma.classSection.create({
    data: {
      courseId: c4.id,
      facultyId: f3.id,
      sectionName: 'CSE-VII-A',
      slot: 'D1',
      room: 'UB-603',
      academicYear: '2026-2027',
      semester: 'VII',
      advisorId: f4.id,
    },
  });

  const sec8 = await prisma.classSection.create({
    data: {
      courseId: c4.id,
      facultyId: f4.id,
      sectionName: 'CSE-VII-B',
      slot: 'D2',
      room: 'UB-604',
      academicYear: '2026-2027',
      semester: 'VII',
      advisorId: f4.id,
    },
  });

  // 5. Enrollments (each student enrolled in 3-4 sections)
  console.log('Creating enrollments...');
  const enrollmentMap = [
    // Year 3 Section A: Abhinav, Priya, Riya Sen (lead)
    { studentId: s1.id, sectionId: sec1.id }, // DBMS A
    { studentId: s1.id, sectionId: sec3.id }, // OS A
    { studentId: s1.id, sectionId: sec7.id }, // AI Ethics A
    { studentId: s1.id, sectionId: sec5.id }, // ML A

    { studentId: s2.id, sectionId: sec1.id },
    { studentId: s2.id, sectionId: sec3.id },
    { studentId: s2.id, sectionId: sec7.id },

    { studentId: cl1.id, sectionId: sec1.id },
    { studentId: cl1.id, sectionId: sec3.id },
    { studentId: cl1.id, sectionId: sec5.id },

    // Year 3 Section B: Rohan, Karan Verma (lead)
    { studentId: s3.id, sectionId: sec2.id }, // DBMS B
    { studentId: s3.id, sectionId: sec4.id }, // OS B
    { studentId: s3.id, sectionId: sec8.id }, // AI Ethics B

    { studentId: cl2.id, sectionId: sec2.id },
    { studentId: cl2.id, sectionId: sec4.id },
    { studentId: cl2.id, sectionId: sec6.id },

    // Year 4 Section A: Sneha, Meera, Ananya Joshi (lead)
    { studentId: s4.id, sectionId: sec5.id }, // ML A
    { studentId: s4.id, sectionId: sec7.id }, // AI Ethics A
    { studentId: s4.id, sectionId: sec1.id }, // Elective DBMS A

    { studentId: s6.id, sectionId: sec5.id },
    { studentId: s6.id, sectionId: sec7.id },
    { studentId: s6.id, sectionId: sec3.id }, // Elective OS A

    { studentId: cl3.id, sectionId: sec5.id },
    { studentId: cl3.id, sectionId: sec7.id },
    { studentId: cl3.id, sectionId: sec1.id },

    // Year 4 Section B: Arjun
    { studentId: s5.id, sectionId: sec6.id }, // ML B
    { studentId: s5.id, sectionId: sec8.id }, // AI Ethics B
    { studentId: s5.id, sectionId: sec2.id }, // Elective DBMS B
  ];

  for (const enr of enrollmentMap) {
    await prisma.enrollment.create({ data: enr });
  }

  // 6. Attendance (30 days of attendance for each enrollment)
  console.log('Generating 30 days of attendance records...');
  const allEnrollments = await prisma.enrollment.findMany();
  const attendanceList: any[] = [];

  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // Skip Sunday

    const dateOnly = new Date(d.toISOString().split('T')[0]);

    for (const enr of allEnrollments) {
      // Deterministic realistic attendance status distribution
      // ~84% Present, ~10% Absent, ~6% OD
      const seedVal = (enr.studentId.charCodeAt(0) * 17 + enr.sectionId.charCodeAt(0) * 11 + i * 13) % 100;
      let status = 'Present';
      if (seedVal > 94) {
        status = 'OD';
      } else if (seedVal > 84) {
        status = 'Absent';
      } else {
        status = 'Present';
      }

      attendanceList.push({
        studentId: enr.studentId,
        sectionId: enr.sectionId,
        date: dateOnly,
        status,
      });
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < attendanceList.length; i += 100) {
    const batch = attendanceList.slice(i, i + 100);
    await prisma.attendance.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  // 7. Marks for CLA-1 and CLA-2
  console.log('Creating exam marks for students...');
  const examRecords = [
    // Abhinav
    { studentId: s1.id, courseId: c1.id, examType: 'CLA-1', marks: 44, maxMarks: 50 },
    { studentId: s1.id, courseId: c1.id, examType: 'CLA-2', marks: 47, maxMarks: 50 },
    { studentId: s1.id, courseId: c2.id, examType: 'CLA-1', marks: 42, maxMarks: 50 },
    { studentId: s1.id, courseId: c2.id, examType: 'CLA-2', marks: 45, maxMarks: 50 },
    { studentId: s1.id, courseId: c3.id, examType: 'CLA-1', marks: 46, maxMarks: 50 },
    { studentId: s1.id, courseId: c3.id, examType: 'CLA-2', marks: 48, maxMarks: 50 },
    // Priya
    { studentId: s2.id, courseId: c1.id, examType: 'CLA-1', marks: 48, maxMarks: 50 },
    { studentId: s2.id, courseId: c1.id, examType: 'CLA-2', marks: 50, maxMarks: 50 },
    { studentId: s2.id, courseId: c2.id, examType: 'CLA-1', marks: 45, maxMarks: 50 },
    { studentId: s2.id, courseId: c2.id, examType: 'CLA-2', marks: 49, maxMarks: 50 },
    // Rohan
    { studentId: s3.id, courseId: c1.id, examType: 'CLA-1', marks: 36, maxMarks: 50 },
    { studentId: s3.id, courseId: c1.id, examType: 'CLA-2', marks: 39, maxMarks: 50 },
    { studentId: s3.id, courseId: c2.id, examType: 'CLA-1', marks: 38, maxMarks: 50 },
    { studentId: s3.id, courseId: c2.id, examType: 'CLA-2', marks: 41, maxMarks: 50 },
    // Sneha
    { studentId: s4.id, courseId: c3.id, examType: 'CLA-1', marks: 43, maxMarks: 50 },
    { studentId: s4.id, courseId: c3.id, examType: 'CLA-2', marks: 46, maxMarks: 50 },
    { studentId: s4.id, courseId: c4.id, examType: 'CLA-1', marks: 45, maxMarks: 50 },
    { studentId: s4.id, courseId: c4.id, examType: 'CLA-2', marks: 48, maxMarks: 50 },
    // Arjun
    { studentId: s5.id, courseId: c3.id, examType: 'CLA-1', marks: 39, maxMarks: 50 },
    { studentId: s5.id, courseId: c3.id, examType: 'CLA-2', marks: 42, maxMarks: 50 },
    { studentId: s5.id, courseId: c4.id, examType: 'CLA-1', marks: 40, maxMarks: 50 },
    { studentId: s5.id, courseId: c4.id, examType: 'CLA-2', marks: 44, maxMarks: 50 },
    // Meera
    { studentId: s6.id, courseId: c3.id, examType: 'CLA-1', marks: 47, maxMarks: 50 },
    { studentId: s6.id, courseId: c3.id, examType: 'CLA-2', marks: 49, maxMarks: 50 },
    { studentId: s6.id, courseId: c4.id, examType: 'CLA-1', marks: 46, maxMarks: 50 },
    { studentId: s6.id, courseId: c4.id, examType: 'CLA-2', marks: 48, maxMarks: 50 },
  ];

  for (const m of examRecords) {
    await prisma.mark.create({ data: m });
  }

  // 8. Clubs (3 clubs)
  console.log('Creating clubs...');
  const club1 = await prisma.club.create({
    data: {
      name: 'CSE Club',
      description: 'Departmental society fostering computer science research, peer learning, and tech seminars.',
      facultyCoordinatorId: f1.id,
      clubLeadId: cl1.id,
    },
  });

  const club2 = await prisma.club.create({
    data: {
      name: 'Coding Club',
      description: 'Hub for algorithms, competitive programming, dynamic programming contests, and hackathons.',
      facultyCoordinatorId: f2.id,
      clubLeadId: cl2.id,
    },
  });

  const club3 = await prisma.club.create({
    data: {
      name: 'Design Club',
      description: 'Creative studio dedicated to UI/UX design systems, user research, and interactive prototyping.',
      facultyCoordinatorId: f4.id,
      clubLeadId: cl3.id,
    },
  });

  // 9. Events (5 events with mixed statuses)
  console.log('Creating events...');
  const datePast10 = new Date(Date.now() - 10 * 86400000);
  const datePast3 = new Date(Date.now() - 3 * 86400000);
  const dateFuture7 = new Date(Date.now() + 7 * 86400000);
  const dateFuture14 = new Date(Date.now() + 14 * 86400000);
  const dateFuture21 = new Date(Date.now() + 21 * 86400000);

  const ev1 = await prisma.event.create({
    data: {
      clubId: club2.id,
      title: 'HackSRM 2026: 24-Hour National Hackathon',
      description: 'Premier collegiate hackathon challenging student engineers to build AI and Web3 solutions.',
      date: new Date(datePast10.toISOString().split('T')[0]),
      venue: 'Dr. T.P. Ganesan Auditorium - Mini Hall 1',
      status: 'Completed',
      createdById: cl2.id,
      approvedById: f2.id,
    },
  });

  const ev2 = await prisma.event.create({
    data: {
      clubId: club1.id,
      title: 'National Level AI & LLM Symposium',
      description: 'Keynotes, paper presentations, and tech talks from industry machine learning researchers.',
      date: new Date(datePast3.toISOString().split('T')[0]),
      venue: 'University Building 4th Floor Seminar Hall',
      status: 'Completed',
      createdById: cl1.id,
      approvedById: f1.id,
    },
  });

  const ev3 = await prisma.event.create({
    data: {
      clubId: club2.id,
      title: 'DevCraft: Web3 & FullStack Summit',
      description: 'Hands-on architectural masterclass building distributed apps with Next.js and Postgres.',
      date: new Date(dateFuture7.toISOString().split('T')[0]),
      venue: 'Tech Park Architecture Lab 602',
      status: 'Upcoming',
      createdById: cl2.id,
      approvedById: f2.id,
    },
  });

  const ev4 = await prisma.event.create({
    data: {
      clubId: club3.id,
      title: 'Design Odyssey: Figma & Design Systems',
      description: 'Zero to hero crash course on auto-layout, design tokens, and building scalable component libraries.',
      date: new Date(dateFuture14.toISOString().split('T')[0]),
      venue: 'Visual Design Lab - TP 303',
      status: 'Upcoming',
      createdById: cl3.id,
      approvedById: f4.id,
    },
  });

  const ev5 = await prisma.event.create({
    data: {
      clubId: club1.id,
      title: 'Quantum Computing Fundamentals Workshop',
      description: 'Introduction to Qubits, superposition, and quantum algorithms by invited research scientists.',
      date: new Date(dateFuture21.toISOString().split('T')[0]),
      venue: 'Tech Park Auditorium',
      status: 'Pending Approval',
      createdById: cl1.id,
    },
  });

  // 10. Event Registrations & Event Attendance
  console.log('Creating event registrations...');
  const eventRegs = [
    // HackSRM (completed)
    { eventId: ev1.id, studentId: s1.id, attended: true },
    { eventId: ev1.id, studentId: s2.id, attended: true },
    { eventId: ev1.id, studentId: s3.id, attended: true },
    { eventId: ev1.id, studentId: s5.id, attended: true },
    // AI Symposium (completed)
    { eventId: ev2.id, studentId: s1.id, attended: true },
    { eventId: ev2.id, studentId: s2.id, attended: true },
    { eventId: ev2.id, studentId: s4.id, attended: true },
    { eventId: ev2.id, studentId: s6.id, attended: true },
    // DevCraft (upcoming)
    { eventId: ev3.id, studentId: s1.id, attended: false },
    { eventId: ev3.id, studentId: s2.id, attended: false },
    { eventId: ev3.id, studentId: s3.id, attended: false },
    { eventId: ev3.id, studentId: s4.id, attended: false },
    // Design Odyssey (upcoming)
    { eventId: ev4.id, studentId: s2.id, attended: false },
    { eventId: ev4.id, studentId: s4.id, attended: false },
    { eventId: ev4.id, studentId: s6.id, attended: false },
  ];

  for (const reg of eventRegs) {
    await prisma.eventRegistration.create({ data: reg });
  }

  // 11. OD Requests in various states
  console.log('Creating OD and ML requests...');
  await prisma.oDRequest.create({
    data: {
      studentId: s1.id,
      sectionId: sec1.id,
      eventId: ev1.id,
      requestType: 'OD',
      requestedDate: new Date(datePast10.toISOString().split('T')[0]),
      reason: 'Participated as finalist in HackSRM 24-hour coding sprint.',
      status: 'Approved',
      approverId: f1.id,
    },
  });

  await prisma.oDRequest.create({
    data: {
      studentId: s2.id,
      sectionId: sec1.id,
      eventId: ev2.id,
      requestType: 'OD',
      requestedDate: new Date(datePast3.toISOString().split('T')[0]),
      reason: 'Presented research poster on Multimodal Embeddings at AI Symposium.',
      status: 'Approved',
      approverId: f1.id,
    },
  });

  await prisma.oDRequest.create({
    data: {
      studentId: s3.id,
      sectionId: sec2.id,
      eventId: ev1.id,
      requestType: 'OD',
      requestedDate: new Date(datePast10.toISOString().split('T')[0]),
      reason: 'Technical operations lead for HackSRM network infrastructure.',
      status: 'Pending',
    },
  });

  await prisma.oDRequest.create({
    data: {
      studentId: s4.id,
      sectionId: sec5.id,
      requestType: 'ML',
      requestedDate: new Date(new Date(Date.now() - 86400000).toISOString().split('T')[0]),
      reason: 'Medical leave with prescription for acute respiratory flu.',
      status: 'Pending',
    },
  });

  // 12. Certificates with mixed statuses
  console.log('Creating certificates...');
  await prisma.certificate.create({
    data: {
      studentId: s1.id,
      eventId: ev1.id,
      title: 'First Prize Winner - HackSRM 2026',
      status: 'Distributed',
      proposedById: cl2.id,
      approvedById: f2.id,
    },
  });

  await prisma.certificate.create({
    data: {
      studentId: s2.id,
      eventId: ev1.id,
      title: 'Runner Up - HackSRM 2026',
      status: 'Distributed',
      proposedById: cl2.id,
      approvedById: f2.id,
    },
  });

  await prisma.certificate.create({
    data: {
      studentId: s2.id,
      eventId: ev2.id,
      title: 'Best Research Poster - AI Symposium 2026',
      status: 'Approved',
      proposedById: cl1.id,
      approvedById: f1.id,
    },
  });

  await prisma.certificate.create({
    data: {
      studentId: s3.id,
      eventId: ev1.id,
      title: 'Certificate of Excellence - HackSRM 2026',
      status: 'Proposed',
      proposedById: cl2.id,
    },
  });

  // 13. Auto-create Channels and Members
  console.log('Creating chat channels and assigning memberships...');
  // Section Channels
  const chSec1 = await prisma.channel.create({
    data: {
      name: 'CS301 - CSE-V-A (DBMS)',
      type: 'section',
      referenceId: sec1.id,
      readOnly: false,
    },
  });

  const chSec2 = await prisma.channel.create({
    data: {
      name: 'CS302 - CSE-V-A (OS)',
      type: 'section',
      referenceId: sec3.id,
      readOnly: false,
    },
  });

  const chClubCoding = await prisma.channel.create({
    data: {
      name: 'Coding Club Announcements & General',
      type: 'club',
      referenceId: club2.id,
      readOnly: false,
    },
  });

  const chClubDesign = await prisma.channel.create({
    data: {
      name: 'Design Club Showcase',
      type: 'club',
      referenceId: club3.id,
      readOnly: false,
    },
  });

  // Assign members to chSec1 (DBMS)
  const dbmsMembers = [f1.id, s1.id, s2.id, cl1.id, s4.id, cl3.id];
  for (const uid of dbmsMembers) {
    await prisma.channelMember.create({
      data: {
        channelId: chSec1.id,
        userId: uid,
        canPost: true,
      },
    });
  }

  // Assign members to chSec2 (OS)
  const osMembers = [f3.id, s1.id, s2.id, cl1.id, s6.id];
  for (const uid of osMembers) {
    await prisma.channelMember.create({
      data: {
        channelId: chSec2.id,
        userId: uid,
        canPost: true,
      },
    });
  }

  // Assign members to Coding Club channel
  const codingMembers = [cl2.id, f2.id, s1.id, s2.id, s3.id, s4.id, s5.id];
  for (const uid of codingMembers) {
    await prisma.channelMember.create({
      data: {
        channelId: chClubCoding.id,
        userId: uid,
        canPost: uid === cl2.id || uid === f2.id || uid === s1.id,
      },
    });
  }

  // Assign members to Design Club channel
  const designMembers = [cl3.id, f4.id, s2.id, s4.id, s6.id];
  for (const uid of designMembers) {
    await prisma.channelMember.create({
      data: {
        channelId: chClubDesign.id,
        userId: uid,
        canPost: true,
      },
    });
  }

  // 14. Messages in channels
  console.log('Populating channel messages...');
  await prisma.message.create({
    data: {
      channelId: chSec1.id,
      senderId: f1.id,
      content: 'Good morning everyone. Please note that the B-Tree indexing assignment is due this Friday by 5:00 PM on the portal.',
      createdAt: new Date(Date.now() - 3600000 * 24),
    },
  });

  await prisma.message.create({
    data: {
      channelId: chSec1.id,
      senderId: s1.id,
      content: 'Sir, could you please clarify if we should implement composite primary keys for the schema normalization task?',
      createdAt: new Date(Date.now() - 3600000 * 18),
    },
  });

  await prisma.message.create({
    data: {
      channelId: chSec1.id,
      senderId: f1.id,
      content: 'Yes Abhinav, 3NF decomposition requires tracking composite foreign key dependencies as well.',
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
  });

  await prisma.message.create({
    data: {
      channelId: chSec1.id,
      senderId: s2.id,
      content: 'Thank you Sir! I have uploaded the ER diagram draft to our group repo.',
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
  });

  await prisma.message.create({
    data: {
      channelId: chClubCoding.id,
      senderId: cl2.id,
      content: '🎉 Massive shoutout to Abhinav and Priya for taking 1st and 2nd place at HackSRM! Certificates have been issued.',
      createdAt: new Date(Date.now() - 3600000 * 30),
    },
  });

  await prisma.message.create({
    data: {
      channelId: chClubCoding.id,
      senderId: f2.id,
      content: 'Heartiest congratulations to the winning teams! Great representation of our CSE department.',
      createdAt: new Date(Date.now() - 3600000 * 20),
    },
  });

  // 15. Announcements (system, section, club scoped)
  console.log('Creating announcements...');
  await prisma.announcement.create({
    data: {
      title: 'Mid-Term Examinations Schedule Released',
      content: 'The CLA and mid-semester assessment time-table for odd semester 2026-2027 is now published. All students must bring valid RFID identity cards to examination halls.',
      scope: 'system',
      authorId: admin.id,
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'DBMS Laboratory Quiz & Query Optimization Test',
      content: 'A hands-on query tuning test on PostgreSQL will be conducted during your scheduled slot this Thursday. Review execution plans (EXPLAIN ANALYZE).',
      scope: 'section',
      scopeId: sec1.id,
      authorId: f1.id,
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Registrations Open for DevCraft Summit 2026',
      content: 'Calling all developers! Hackathon registrations are officially open. Great cash prizes, cloud credits, and summer internship opportunities await.',
      scope: 'club',
      scopeId: club2.id,
      authorId: cl2.id,
      createdAt: new Date(Date.now() - 86400000 * 4),
    },
  });

  // 16. GCR Mappings for sections
  console.log('Creating Google Classroom mappings...');
  await prisma.gCRSync.create({
    data: {
      sectionId: sec1.id,
      gcrCourseId: 'gcr-cs301-v-a-2026',
      syncStatus: 'linked',
      lastSynced: new Date(),
    },
  });

  await prisma.gCRSync.create({
    data: {
      sectionId: sec3.id,
      gcrCourseId: 'gcr-cs302-v-a-2026',
      syncStatus: 'linked',
      lastSynced: new Date(),
    },
  });

  await prisma.gCRSync.create({
    data: {
      sectionId: sec5.id,
      gcrCourseId: 'gcr-cs401-vii-a-2026',
      syncStatus: 'linked',
      lastSynced: new Date(),
    },
  });

  console.log('--- Seed Completed Successfully! ---');
  console.log('Mock Logins:');
  console.log('Students: abhinav@srm.edu, priya@srm.edu, rohan@srm.edu, sneha@srm.edu, arjun@srm.edu, meera@srm.edu');
  console.log('Faculty: s.iyer@srm.edu, r.mehta@srm.edu, p.nair@srm.edu, k.sharma@srm.edu');
  console.log('Club Leads: riya.cse@srm.edu, karan.code@srm.edu, ananya.design@srm.edu');
  console.log('Admin: admin@srm.edu');
  console.log('Password for all users: campus123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
