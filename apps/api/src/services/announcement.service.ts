import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AnnouncementData } from '@koraylo/shared';

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  scope: string;
  scopeId?: string;
}

export async function getUserAnnouncements(userId: string, role: string): Promise<AnnouncementData[]> {
  const whereConditions: any[] = [{ scope: 'system' }];

  if (role === 'admin') {
    // Admin sees all
    const all = await prisma.announcement.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return all.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      scope: a.scope,
      scopeId: a.scopeId || undefined,
      authorId: a.authorId,
      authorName: a.author.name,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  if (role === 'faculty') {
    // Faculty's sections and clubs
    const sections = await prisma.classSection.findMany({
      where: { facultyId: userId },
      select: { id: true },
    });
    const sectionIds = sections.map((s) => s.id);

    const clubs = await prisma.club.findMany({
      where: { facultyCoordinatorId: userId },
      select: { id: true },
    });
    const clubIds = clubs.map((c) => c.id);

    if (sectionIds.length > 0) {
      whereConditions.push({ scope: 'section', scopeId: { in: sectionIds } });
    }
    if (clubIds.length > 0) {
      whereConditions.push({ scope: 'club', scopeId: { in: clubIds } });
    }
  } else {
    // Student & club_lead
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      select: { sectionId: true },
    });
    const sectionIds = enrollments.map((e) => e.sectionId);

    const clubs = await prisma.club.findMany({
      where: {
        OR: [
          { clubLeadId: userId },
          { events: { some: { registrations: { some: { studentId: userId } } } } },
        ],
      },
      select: { id: true },
    });
    const clubIds = clubs.map((c) => c.id);

    if (sectionIds.length > 0) {
      whereConditions.push({ scope: 'section', scopeId: { in: sectionIds } });
    }
    if (clubIds.length > 0) {
      whereConditions.push({ scope: 'club', scopeId: { in: clubIds } });
    }
  }

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: whereConditions,
    },
    include: {
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    scope: a.scope,
    scopeId: a.scopeId || undefined,
    authorId: a.authorId,
    authorName: a.author.name,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function createAnnouncement(
  authorId: string,
  input: CreateAnnouncementInput
): Promise<AnnouncementData> {
  const { title, content, scope, scopeId } = input;

  if (!title || !content || !scope) {
    throw new AppError('Title, content, and scope are required', 400);
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      scope,
      scopeId: scopeId || null,
      authorId,
    },
    include: {
      author: { select: { name: true } },
    },
  });

  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    scope: announcement.scope,
    scopeId: announcement.scopeId || undefined,
    authorId: announcement.authorId,
    authorName: announcement.author.name,
    createdAt: announcement.createdAt.toISOString(),
  };
}
