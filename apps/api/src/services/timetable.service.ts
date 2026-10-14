import { prisma } from '../lib/prisma';
import { SLOT_TIMES, TimetableEntry } from '@koraylo/shared';

export async function getUserTimetable(userId: string, role: string): Promise<TimetableEntry[]> {
  let sections: any[] = [];

  if (role === 'faculty') {
    sections = await prisma.classSection.findMany({
      where: { facultyId: userId },
      include: {
        course: true,
        faculty: true,
      },
      orderBy: { slot: 'asc' },
    });
  } else {
    // For students and club leads (who are students)
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        section: {
          include: {
            course: true,
            faculty: true,
          },
        },
      },
    });
    sections = enrollments.map((e) => e.section);
  }

  return sections.map((section) => {
    const slotTime = SLOT_TIMES[section.slot] || { start: '09:00', end: '10:00' };
    return {
      id: section.id,
      courseCode: section.course.code,
      courseName: section.course.name,
      sectionName: section.sectionName,
      slot: section.slot,
      room: section.room,
      facultyName: section.faculty.name,
      startTime: slotTime.start,
      endTime: slotTime.end,
    };
  });
}

export async function getTodayTimetable(userId: string, role: string): Promise<TimetableEntry[]> {
  const allEntries = await getUserTimetable(userId, role);
  if (allEntries.length === 0) return [];

  const dayOfWeek = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // SRM-style slot to day distribution
  const daySlotLetters: Record<number, string[]> = {
    1: ['A', 'B'], // Monday
    2: ['B', 'C'], // Tuesday
    3: ['C', 'D'], // Wednesday
    4: ['D', 'E'], // Thursday
    5: ['E', 'F', 'A'], // Friday
    6: ['A', 'B'], // Saturday (weekend fallback)
    0: ['A', 'C'], // Sunday (weekend fallback)
  };

  const allowedLetters = daySlotLetters[dayOfWeek] || ['A', 'B', 'C'];
  const todayEntries = allEntries.filter((entry) =>
    allowedLetters.some((letter) => entry.slot.startsWith(letter))
  );

  // If today has no matches (e.g. non-matching slot codes), return first entries so UI is populated
  if (todayEntries.length === 0) {
    return allEntries.slice(0, 3);
  }

  return todayEntries;
}
