import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { EventStatus, EventData } from '@koraylo/shared';

export interface CreateEventInput {
  clubId: string;
  title: string;
  description?: string;
  date: string;
  venue?: string;
}

export async function getEvents(filters: {
  status?: string;
  clubId?: string;
  studentId?: string;
}): Promise<Array<EventData & { isRegistered?: boolean }>> {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.clubId) {
    where.clubId = filters.clubId;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      club: { select: { id: true, name: true } },
      _count: {
        select: {
          registrations: true,
        },
      },
      registrations: filters.studentId
        ? {
            where: { studentId: filters.studentId },
            select: { id: true, attended: true },
          }
        : false,
    },
    orderBy: { date: 'asc' },
  });

  return events.map((event) => {
    const isRegistered = filters.studentId ? (event.registrations as any[]).length > 0 : undefined;
    return {
      id: event.id,
      clubId: event.clubId,
      clubName: event.club.name,
      title: event.title,
      description: event.description || undefined,
      date: event.date.toISOString().split('T')[0],
      venue: event.venue || undefined,
      status: event.status as EventStatus,
      registrationCount: event._count.registrations,
      createdById: event.createdById,
      approvedById: event.approvedById || undefined,
      isRegistered,
    };
  });
}

export async function getEventById(eventId: string, studentId?: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      club: {
        include: {
          facultyCoordinator: { select: { id: true, name: true } },
          clubLead: { select: { id: true, name: true } },
        },
      },
      createdBy: { select: { id: true, name: true, email: true } },
      approvedBy: { select: { id: true, name: true, email: true } },
      _count: {
        select: {
          registrations: true,
        },
      },
      registrations: studentId
        ? {
            where: { studentId },
            select: { id: true, attended: true },
          }
        : false,
    },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const attendedCount = await prisma.eventRegistration.count({
    where: { eventId, attended: true },
  });

  const isRegistered = studentId ? (event.registrations as any[]).length > 0 : false;
  const userAttended = studentId && isRegistered ? (event.registrations as any[])[0]?.attended : false;

  return {
    id: event.id,
    clubId: event.clubId,
    clubName: event.club.name,
    title: event.title,
    description: event.description || undefined,
    date: event.date.toISOString().split('T')[0],
    venue: event.venue || undefined,
    status: event.status,
    registrationCount: event._count.registrations,
    attendedCount,
    createdById: event.createdById,
    createdByName: event.createdBy.name,
    approvedById: event.approvedById || undefined,
    approvedByName: event.approvedBy?.name || undefined,
    isRegistered,
    userAttended,
    createdAt: event.createdAt.toISOString(),
  };
}

export async function createEvent(userId: string, input: CreateEventInput) {
  const { clubId, title, description, date, venue } = input;

  const club = await prisma.club.findUnique({
    where: { id: clubId },
  });

  if (!club) {
    throw new AppError('Club not found', 404);
  }

  // Check if user is club lead or coordinator or admin
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (club.clubLeadId !== userId && club.facultyCoordinatorId !== userId && user?.role !== 'admin') {
    throw new AppError('Forbidden: you must be the club lead or coordinator to create events for this club', 403);
  }

  const targetDate = new Date(date.split('T')[0]);

  const newEvent = await prisma.event.create({
    data: {
      clubId,
      title,
      description,
      date: targetDate,
      venue,
      status: EventStatus.PENDING_APPROVAL,
      createdById: userId,
    },
    include: {
      club: true,
    },
  });

  return newEvent;
}

export async function approveEvent(eventId: string, facultyId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: facultyId } });
  if (event.club.facultyCoordinatorId !== facultyId && user?.role !== 'admin') {
    throw new AppError('Forbidden: only the faculty coordinator of this club can approve events', 403);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      status: EventStatus.UPCOMING,
      approvedById: facultyId,
    },
    include: { club: true },
  });

  return updatedEvent;
}

export async function rejectEvent(eventId: string, facultyId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: facultyId } });
  if (event.club.facultyCoordinatorId !== facultyId && user?.role !== 'admin') {
    throw new AppError('Forbidden: only the faculty coordinator of this club can reject events', 403);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      status: EventStatus.REJECTED,
      approvedById: facultyId,
    },
    include: { club: true },
  });

  return updatedEvent;
}

export async function registerForEvent(eventId: string, studentId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  if (event.status === EventStatus.CANCELLED || event.status === EventStatus.REJECTED) {
    throw new AppError(`Cannot register for an event that is ${event.status}`, 400);
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: {
      eventId_studentId: {
        eventId,
        studentId,
      },
    },
  });

  if (existing) {
    throw new AppError('You are already registered for this event', 400);
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      eventId,
      studentId,
      attended: false,
    },
    include: {
      event: true,
      student: { select: { id: true, name: true, email: true } },
    },
  });

  return registration;
}

export async function getEventRegistrations(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
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
    orderBy: { createdAt: 'desc' },
  });

  return {
    event: {
      id: event.id,
      title: event.title,
      clubName: event.club.name,
      date: event.date.toISOString().split('T')[0],
      venue: event.venue,
      status: event.status,
    },
    registrations: registrations.map((r) => ({
      id: r.id,
      studentId: r.student.id,
      studentName: r.student.name,
      studentEmail: r.student.email,
      department: r.student.department,
      year: r.student.year,
      section: r.student.section,
      attended: r.attended,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function markEventAttendance(
  eventId: string,
  userId: string,
  registrationIds: string[]
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (event.club.clubLeadId !== userId && event.club.facultyCoordinatorId !== userId && user?.role !== 'admin') {
    throw new AppError('Forbidden: you must be the club lead or coordinator to mark event attendance', 403);
  }

  // Update attendance for the specified registrations
  await prisma.eventRegistration.updateMany({
    where: {
      id: { in: registrationIds },
      eventId,
    },
    data: {
      attended: true,
    },
  });

  return { success: true, count: registrationIds.length };
}

export async function updateEventStatus(eventId: string, userId: string, status: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (event.club.clubLeadId !== userId && event.club.facultyCoordinatorId !== userId && user?.role !== 'admin') {
    throw new AppError('Forbidden: you must be the club lead or coordinator to update event status', 403);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: { status },
  });

  return updatedEvent;
}
