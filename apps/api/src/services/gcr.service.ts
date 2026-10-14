import { prisma } from '../lib/prisma';
import { GCRMapping } from '@koraylo/shared';

export interface GCRSectionDetail extends GCRMapping {
  sectionName: string;
  lastSynced?: string;
  courseUrl: string;
}

export async function getUserGCRSections(userId: string, role: string): Promise<GCRSectionDetail[]> {
  let sectionIds: string[] = [];

  if (role === 'faculty') {
    const sections = await prisma.classSection.findMany({
      where: { facultyId: userId },
      select: { id: true },
    });
    sectionIds = sections.map((s) => s.id);
  } else {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      select: { sectionId: true },
    });
    sectionIds = enrollments.map((e) => e.sectionId);
  }

  if (sectionIds.length === 0) {
    return [];
  }

  const syncRecords = await prisma.gCRSync.findMany({
    where: {
      sectionId: { in: sectionIds },
    },
  });

  if (syncRecords.length === 0) {
    return [];
  }

  const sections = await prisma.classSection.findMany({
    where: {
      id: { in: syncRecords.map((s) => s.sectionId) },
    },
    include: {
      course: true,
    },
  });

  const sectionMap = new Map(sections.map((s) => [s.id, s]));

  return syncRecords.map((rec) => {
    const sec = sectionMap.get(rec.sectionId);
    return {
      id: rec.id,
      sectionId: rec.sectionId,
      sectionName: sec ? sec.sectionName : '',
      courseCode: sec?.course.code,
      courseName: sec?.course.name,
      gcrCourseId: rec.gcrCourseId,
      syncStatus: rec.syncStatus,
      lastSynced: rec.lastSynced?.toISOString(),
      courseUrl: `https://classroom.google.com/c/${rec.gcrCourseId}`,
    };
  });
}
