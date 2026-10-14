import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { ClubData } from '@koraylo/shared';

export async function getClubById(clubId: string): Promise<ClubData & { events: any[] }> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      facultyCoordinator: {
        select: { id: true, name: true, email: true },
      },
      clubLead: {
        select: { id: true, name: true, email: true },
      },
      events: {
        orderBy: { date: 'asc' },
      },
    },
  });

  if (!club) {
    throw new AppError('Club not found', 404);
  }

  return {
    id: club.id,
    name: club.name,
    description: club.description || undefined,
    facultyCoordinatorId: club.facultyCoordinatorId,
    facultyCoordinatorName: club.facultyCoordinator.name,
    clubLeadId: club.clubLeadId,
    clubLeadName: club.clubLead.name,
    eventCount: club.events.length,
    events: club.events,
  };
}

export async function getMyClub(userId: string): Promise<ClubData & { events: any[] }> {
  const club = await prisma.club.findFirst({
    where: {
      OR: [{ clubLeadId: userId }, { facultyCoordinatorId: userId }],
    },
    include: {
      facultyCoordinator: {
        select: { id: true, name: true, email: true },
      },
      clubLead: {
        select: { id: true, name: true, email: true },
      },
      events: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!club) {
    throw new AppError('No club found associated with this user', 404);
  }

  return {
    id: club.id,
    name: club.name,
    description: club.description || undefined,
    facultyCoordinatorId: club.facultyCoordinatorId,
    facultyCoordinatorName: club.facultyCoordinator.name,
    clubLeadId: club.clubLeadId,
    clubLeadName: club.clubLead.name,
    eventCount: club.events.length,
    events: club.events,
  };
}

export async function getAllClubs(): Promise<ClubData[]> {
  const clubs = await prisma.club.findMany({
    include: {
      facultyCoordinator: {
        select: { id: true, name: true },
      },
      clubLead: {
        select: { id: true, name: true },
      },
      _count: {
        select: { events: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return clubs.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || undefined,
    facultyCoordinatorId: c.facultyCoordinatorId,
    facultyCoordinatorName: c.facultyCoordinator.name,
    clubLeadId: c.clubLeadId,
    clubLeadName: c.clubLead.name,
    eventCount: c._count.events,
  }));
}
