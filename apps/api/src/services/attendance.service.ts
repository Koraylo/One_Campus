import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AttendanceStatus } from '@koraylo/shared';

export interface SectionAttendanceSummary {
  sectionId: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
  facultyName: string;
  slot: string;
  total: number;
  present: number;
  absent: number;
  od: number;
  ml: number;
  percentage: number;
  margin: number; // positive = can miss, negative = needed to attend
}

export interface StudentAttendanceOverview {
  overall: {
    total: number;
    present: number;
    absent: number;
    od: number;
    ml: number;
    percentage: number;
  };
  sections: SectionAttendanceSummary[];
}

export async function getStudentAttendanceSummary(studentId: string): Promise<StudentAttendanceOverview> {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      section: {
        include: {
          course: true,
          faculty: true,
        },
      },
    },
  });

  let totalClasses = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalOD = 0;
  let totalML = 0;

  const sectionSummaries: SectionAttendanceSummary[] = [];

  for (const enrollment of enrollments) {
    const records = await prisma.attendance.findMany({
      where: {
        studentId,
        sectionId: enrollment.sectionId,
      },
    });

    const total = records.length;
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const od = records.filter((r) => r.status === AttendanceStatus.OD).length;
    const ml = records.filter((r) => r.status === AttendanceStatus.ML).length;
    const attended = present + od + ml;

    const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;

    // Calculate margin:
    // If >= 75%: how many classes can be missed: floor((attended - 0.75 * total) / 0.75)
    // If < 75%: classes needed: -ceil((0.75 * total - attended) / 0.25)
    let margin = 0;
    if (total > 0) {
      if (percentage >= 75) {
        margin = Math.floor((attended - 0.75 * total) / 0.75);
      } else {
        margin = -Math.ceil((0.75 * total - attended) / 0.25);
      }
    }

    totalClasses += total;
    totalPresent += present;
    totalAbsent += absent;
    totalOD += od;
    totalML += ml;

    sectionSummaries.push({
      sectionId: enrollment.section.id,
      courseCode: enrollment.section.course.code,
      courseName: enrollment.section.course.name,
      sectionName: enrollment.section.sectionName,
      facultyName: enrollment.section.faculty.name,
      slot: enrollment.section.slot,
      total,
      present,
      absent,
      od,
      ml,
      percentage,
      margin,
    });
  }

  const overallAttended = totalPresent + totalOD + totalML;
  const overallPercentage = totalClasses > 0 ? Math.round((overallAttended / totalClasses) * 100) : 100;

  return {
    overall: {
      total: totalClasses,
      present: totalPresent,
      absent: totalAbsent,
      od: totalOD,
      ml: totalML,
      percentage: overallPercentage,
    },
    sections: sectionSummaries,
  };
}

export async function getSectionAttendanceRecords(sectionId: string, facultyId?: string) {
  const section = await prisma.classSection.findUnique({
    where: { id: sectionId },
    include: { course: true },
  });

  if (!section) {
    throw new AppError('Section not found', 404);
  }

  if (facultyId && section.facultyId !== facultyId) {
    // Check if faculty owns section
    throw new AppError('Unauthorized: you do not teach this section', 403);
  }

  const records = await prisma.attendance.findMany({
    where: { sectionId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          section: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  return {
    section,
    records,
  };
}

export async function markSectionAttendance(
  sectionId: string,
  facultyId: string,
  dateStr: string,
  records: Array<{ studentId: string; status: string }>
) {
  const section = await prisma.classSection.findUnique({
    where: { id: sectionId },
  });

  if (!section) {
    throw new AppError('Section not found', 404);
  }

  if (section.facultyId !== facultyId) {
    throw new AppError('Forbidden: only the faculty assigned to this section can mark attendance', 403);
  }

  const targetDate = new Date(dateStr.split('T')[0]);

  // Bulk upsert each attendance record
  await prisma.$transaction(
    records.map((rec) =>
      prisma.attendance.upsert({
        where: {
          studentId_sectionId_date: {
            studentId: rec.studentId,
            sectionId,
            date: targetDate,
          },
        },
        create: {
          studentId: rec.studentId,
          sectionId,
          date: targetDate,
          status: rec.status,
        },
        update: {
          status: rec.status,
        },
      })
    )
  );

  return { count: records.length, date: targetDate };
}

export async function getSectionStudentsWithAttendance(sectionId: string, dateStr?: string) {
  const section = await prisma.classSection.findUnique({
    where: { id: sectionId },
    include: {
      course: true,
      enrollments: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
              year: true,
              section: true,
            },
          },
        },
      },
    },
  });

  if (!section) {
    throw new AppError('Section not found', 404);
  }

  const targetDate = dateStr ? new Date(dateStr.split('T')[0]) : new Date(new Date().toISOString().split('T')[0]);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      sectionId,
      date: targetDate,
    },
  });

  const attendanceMap = new Map<string, string>();
  attendanceRecords.forEach((att) => {
    attendanceMap.set(att.studentId, att.status);
  });

  const students = section.enrollments.map((enr) => ({
    ...enr.student,
    status: attendanceMap.get(enr.student.id) || null,
  }));

  return {
    section: {
      id: section.id,
      sectionName: section.sectionName,
      courseCode: section.course.code,
      courseName: section.course.name,
      slot: section.slot,
      room: section.room,
    },
    date: targetDate.toISOString().split('T')[0],
    students,
  };
}
