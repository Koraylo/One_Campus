import { prisma } from '../lib/prisma';
import { SLOT_TIMES, TimetableEntry } from '@koraylo/shared';

export async function getUserTimetable(userId: string, role: string): Promise<TimetableEntry[]> {
  let sections: any[] = [];

  if (role === 'faculty') {
    sections = await prisma.classSection.findMany({
      where: { facultyId: userId },
      include: { course: true, faculty: true },
      orderBy: { slot: 'asc' },
    });
  } else {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      include: { section: { include: { course: true, faculty: true } } },
    });
    sections = enrollments.map((enrollment) => enrollment.section);
  }

  return sections.map((section) => {
    const slotTime = SLOT_TIMES[section.slot];
    return {
      id: section.id,
      courseCode: section.course.code,
      courseName: section.course.name,
      sectionName: section.sectionName,
      slot: section.slot,
      room: section.room,
      facultyName: section.faculty.name,
      // Unknown slots remain visibly unknown instead of being shown as 09:00–10:00.
      startTime: slotTime?.start || '—',
      endTime: slotTime?.end || '—',
    };
  });
}

export async function getTodayTimetable(userId: string, role: string): Promise<TimetableEntry[]> {
  const allEntries = await getUserTimetable(userId, role);
  if (allEntries.length === 0) return [];

  const dayOfWeek = new Date().getDay();
  const daySlotLetters: Record<number, string[]> = {
    1: ['A', 'B'],
    2: ['B', 'C'],
    3: ['C', 'D'],
    4: ['D', 'E'],
    5: ['E', 'F', 'A'],
    6: ['A', 'B'],
    0: ['A', 'C'],
  };
  const allowedLetters = daySlotLetters[dayOfWeek] || [];

  // Do not fabricate today's classes when there is no matching slot.
  return allEntries.filter((entry) => allowedLetters.some((letter) => entry.slot.startsWith(letter)));
}
