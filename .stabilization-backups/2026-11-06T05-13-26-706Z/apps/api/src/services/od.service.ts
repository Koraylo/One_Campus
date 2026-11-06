import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { ODRequestStatus, ODRequestType } from '@koraylo/shared';

export interface CreateODInput {
  eventId?: string;
  sectionIds: string[];
  requestedDate: string;
  reason?: string;
}

export interface CreateMLInput {
  sectionIds: string[];
  requestedDate: string;
  reason?: string;
}

export async function submitODRequest(studentId: string, input: CreateODInput) {
  const { eventId, sectionIds, requestedDate, reason } = input;

  if (!sectionIds || sectionIds.length === 0) {
    throw new AppError('At least one section must be selected for OD request', 400);
  }

  const targetDate = new Date(requestedDate.split('T')[0]);

  // Create an ODRequest entry for each affected section
  const requests = await prisma.$transaction(
    sectionIds.map((sectionId) =>
      prisma.oDRequest.create({
        data: {
          studentId,
          sectionId,
          eventId: eventId || null,
          requestType: ODRequestType.OD,
          requestedDate: targetDate,
          reason,
          status: ODRequestStatus.PENDING,
        },
        include: {
          section: {
            include: {
              course: true,
              faculty: true,
            },
          },
          event: true,
        },
      })
    )
  );

  return requests;
}

export async function submitMLRequest(studentId: string, input: CreateMLInput) {
  const { sectionIds, requestedDate, reason } = input;

  if (!sectionIds || sectionIds.length === 0) {
    throw new AppError('At least one section must be selected for ML request', 400);
  }

  const targetDate = new Date(requestedDate.split('T')[0]);

  const requests = await prisma.$transaction(
    sectionIds.map((sectionId) =>
      prisma.oDRequest.create({
        data: {
          studentId,
          sectionId,
          eventId: null,
          requestType: ODRequestType.ML,
          requestedDate: targetDate,
          reason,
          status: ODRequestStatus.PENDING,
        },
        include: {
          section: {
            include: {
              course: true,
              faculty: true,
            },
          },
        },
      })
    )
  );

  return requests;
}

export async function getPendingRequestsForFaculty(facultyId: string) {
  const requests = await prisma.oDRequest.findMany({
    where: {
      status: ODRequestStatus.PENDING,
      OR: [
        { section: { facultyId } },
        { section: { advisorId: facultyId } },
      ],
    },
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
      section: {
        include: {
          course: true,
          faculty: true,
        },
      },
      event: {
        include: {
          club: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Attach student's current attendance percentage for the section
  const enriched = await Promise.all(
    requests.map(async (req) => {
      const records = await prisma.attendance.findMany({
        where: {
          studentId: req.studentId,
          sectionId: req.sectionId,
        },
      });

      const total = records.length;
      const attended = records.filter(
        (r) => r.status === 'Present' || r.status === 'OD' || r.status === 'ML'
      ).length;
      const currentAttendance = total > 0 ? Math.round((attended / total) * 100) : 100;

      return {
        id: req.id,
        studentId: req.studentId,
        studentName: req.student.name,
        studentEmail: req.student.email,
        sectionId: req.sectionId,
        sectionName: req.section.sectionName,
        courseCode: req.section.course.code,
        courseName: req.section.course.name,
        eventId: req.eventId,
        eventName: req.event?.title || undefined,
        clubName: req.event?.club?.name || undefined,
        requestType: req.requestType,
        requestedDate: req.requestedDate.toISOString().split('T')[0],
        reason: req.reason,
        status: req.status,
        currentAttendance,
        createdAt: req.createdAt.toISOString(),
      };
    })
  );

  return enriched;
}

export async function approveODRequest(requestId: string, facultyId: string) {
  const odRequest = await prisma.oDRequest.findUnique({
    where: { id: requestId },
    include: { section: true },
  });

  if (!odRequest) {
    throw new AppError('OD/ML request not found', 404);
  }

  if (odRequest.section.facultyId !== facultyId && odRequest.section.advisorId !== facultyId) {
    throw new AppError('Forbidden: you are not authorized to approve this request', 403);
  }

  // Transaction: update request to Approved and upsert attendance status
  const [updatedRequest] = await prisma.$transaction([
    prisma.oDRequest.update({
      where: { id: requestId },
      data: {
        status: ODRequestStatus.APPROVED,
        approverId: facultyId,
      },
    }),
    prisma.attendance.upsert({
      where: {
        studentId_sectionId_date: {
          studentId: odRequest.studentId,
          sectionId: odRequest.sectionId,
          date: odRequest.requestedDate,
        },
      },
      create: {
        studentId: odRequest.studentId,
        sectionId: odRequest.sectionId,
        date: odRequest.requestedDate,
        status: odRequest.requestType, // 'OD' or 'ML'
      },
      update: {
        status: odRequest.requestType,
      },
    }),
  ]);

  return updatedRequest;
}

export async function rejectODRequest(requestId: string, facultyId: string) {
  const odRequest = await prisma.oDRequest.findUnique({
    where: { id: requestId },
    include: { section: true },
  });

  if (!odRequest) {
    throw new AppError('OD/ML request not found', 404);
  }

  if (odRequest.section.facultyId !== facultyId && odRequest.section.advisorId !== facultyId) {
    throw new AppError('Forbidden: you are not authorized to reject this request', 403);
  }

  const updatedRequest = await prisma.oDRequest.update({
    where: { id: requestId },
    data: {
      status: ODRequestStatus.REJECTED,
      approverId: facultyId,
    },
  });

  return updatedRequest;
}

export async function getStudentODRequests(studentId: string) {
  const requests = await prisma.oDRequest.findMany({
    where: { studentId },
    include: {
      section: {
        include: {
          course: true,
          faculty: true,
        },
      },
      event: true,
      approver: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return requests.map((req) => ({
    id: req.id,
    studentId: req.studentId,
    sectionId: req.sectionId,
    sectionName: req.section.sectionName,
    courseCode: req.section.course.code,
    courseName: req.section.course.name,
    eventId: req.eventId,
    eventName: req.event?.title || undefined,
    requestType: req.requestType,
    requestedDate: req.requestedDate.toISOString().split('T')[0],
    reason: req.reason,
    status: req.status,
    approverName: req.approver?.name || undefined,
    createdAt: req.createdAt.toISOString(),
  }));
}
