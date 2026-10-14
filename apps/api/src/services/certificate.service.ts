import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { CertificateStatus, CertificateData } from '@koraylo/shared';

export interface ProposeCertificateInput {
  studentId: string;
  eventId: string;
  title: string;
}

export async function proposeCertificate(
  userId: string,
  input: ProposeCertificateInput
): Promise<CertificateData> {
  const { studentId, eventId, title } = input;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const cert = await prisma.certificate.create({
    data: {
      studentId,
      eventId,
      title,
      status: CertificateStatus.PROPOSED,
      proposedById: userId,
    },
    include: {
      student: { select: { id: true, name: true } },
      event: { select: { id: true, title: true } },
      proposedBy: { select: { id: true, name: true } },
    },
  });

  return {
    id: cert.id,
    studentId: cert.studentId,
    studentName: cert.student.name,
    eventId: cert.eventId,
    eventName: cert.event.title,
    title: cert.title,
    status: cert.status as CertificateStatus,
    proposedById: cert.proposedById,
    proposedByName: cert.proposedBy.name,
    createdAt: cert.createdAt.toISOString(),
  };
}

export async function getPendingCertificatesForFaculty(facultyId: string) {
  const user = await prisma.user.findUnique({ where: { id: facultyId } });
  const isAdmin = user?.role === 'admin';

  const certificates = await prisma.certificate.findMany({
    where: {
      status: CertificateStatus.PROPOSED,
      ...(isAdmin
        ? {}
        : {
            event: {
              club: {
                facultyCoordinatorId: facultyId,
              },
            },
          }),
    },
    include: {
      student: { select: { id: true, name: true, email: true, department: true } },
      event: {
        include: {
          club: { select: { id: true, name: true } },
        },
      },
      proposedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return certificates.map((c) => ({
    id: c.id,
    studentId: c.studentId,
    studentName: c.student.name,
    studentEmail: c.student.email,
    department: c.student.department,
    eventId: c.eventId,
    eventName: c.event.title,
    clubName: c.event.club.name,
    title: c.title,
    status: c.status,
    proposedById: c.proposedById,
    proposedByName: c.proposedBy.name,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function approveCertificate(certificateId: string, facultyId: string) {
  const cert = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      event: { include: { club: true } },
    },
  });

  if (!cert) {
    throw new AppError('Certificate not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: facultyId } });
  if (cert.event.club.facultyCoordinatorId !== facultyId && user?.role !== 'admin') {
    throw new AppError('Forbidden: only the club faculty coordinator can approve this certificate', 403);
  }

  const updated = await prisma.certificate.update({
    where: { id: certificateId },
    data: {
      status: CertificateStatus.APPROVED,
      approvedById: facultyId,
    },
    include: {
      student: { select: { name: true } },
      event: { select: { title: true } },
      approvedBy: { select: { name: true } },
    },
  });

  return updated;
}

export async function distributeCertificate(certificateId: string, userId: string) {
  const cert = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      event: { include: { club: true } },
    },
  });

  if (!cert) {
    throw new AppError('Certificate not found', 404);
  }

  if (cert.status !== CertificateStatus.APPROVED) {
    throw new AppError(`Cannot distribute certificate with status '${cert.status}'. It must be Approved first.`, 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isAuthorized =
    cert.event.club.clubLeadId === userId ||
    cert.event.club.facultyCoordinatorId === userId ||
    user?.role === 'admin';

  if (!isAuthorized) {
    throw new AppError('Forbidden: you are not authorized to distribute this certificate', 403);
  }

  const updated = await prisma.certificate.update({
    where: { id: certificateId },
    data: {
      status: CertificateStatus.DISTRIBUTED,
    },
  });

  return updated;
}

export async function getStudentCertificates(studentId: string): Promise<CertificateData[]> {
  const certs = await prisma.certificate.findMany({
    where: {
      studentId,
      status: { in: [CertificateStatus.APPROVED, CertificateStatus.DISTRIBUTED] },
    },
    include: {
      student: { select: { name: true } },
      event: { select: { title: true } },
      proposedBy: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return certs.map((c) => ({
    id: c.id,
    studentId: c.studentId,
    studentName: c.student.name,
    eventId: c.eventId,
    eventName: c.event.title,
    title: c.title,
    status: c.status as CertificateStatus,
    proposedById: c.proposedById,
    proposedByName: c.proposedBy.name,
    approvedById: c.approvedById || undefined,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function getClubCertificates(userId: string) {
  const certs = await prisma.certificate.findMany({
    where: {
      OR: [
        { proposedById: userId },
        { event: { club: { clubLeadId: userId } } },
        { event: { club: { facultyCoordinatorId: userId } } },
      ],
    },
    include: {
      student: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, title: true } },
      proposedBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return certs.map((c) => ({
    id: c.id,
    studentId: c.studentId,
    studentName: c.student.name,
    studentEmail: c.student.email,
    eventId: c.eventId,
    eventName: c.event.title,
    title: c.title,
    status: c.status,
    proposedById: c.proposedById,
    proposedByName: c.proposedBy.name,
    approvedById: c.approvedById || undefined,
    approvedByName: c.approvedBy?.name || undefined,
    createdAt: c.createdAt.toISOString(),
  }));
}
