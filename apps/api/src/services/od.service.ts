import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { ODRequestStatus, ODRequestType, EventStatus } from '@koraylo/shared';

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

async function validateStudentRequest(studentId: string, sectionIds: string[], requestedDate: string, eventId?: string) {
  if (!Array.isArray(sectionIds) || sectionIds.length === 0 || sectionIds.length > 20) {
    throw new AppError('Select between 1 and 20 enrolled sections', 400);
  }
  if (sectionIds.some((id) => typeof id !== 'string' || !id) || new Set(sectionIds).size !== sectionIds.length) {
    throw new AppError('Section IDs must be valid and unique', 400);
  }
  const dateOnly = typeof requestedDate === 'string' ? requestedDate.split('T')[0] : '';
  const targetDate = new Date(dateOnly + 'T00:00:00.000Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly) || Number.isNaN(targetDate.getTime()) || targetDate.toISOString().slice(0, 10) !== dateOnly) {
    throw new AppError('A valid requested date (YYYY-MM-DD) is required', 400);
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId, sectionId: { in: sectionIds } },
    select: { sectionId: true },
  });
  if (enrollments.length !== sectionIds.length) {
    throw new AppError('Requests can only be submitted for sections in which you are enrolled', 403);
  }

  if (eventId) {
    const [event, registration] = await Promise.all([
      prisma.event.findUnique({ where: { id: eventId }, select: { status: true } }),
      prisma.eventRegistration.findUnique({ where: { eventId_studentId: { eventId, studentId } } }),
    ]);
    if (!event || ![EventStatus.ONGOING, EventStatus.COMPLETED].includes(event.status as EventStatus) || !registration?.attended) {
      throw new AppError('OD for an event requires an approved event and an attendance record for you', 400);
    }
  }

  return targetDate;
}

export async function submitODRequest(studentId: string, input: CreateODInput) {
  const { eventId, sectionIds, requestedDate, reason } = input;

  const targetDate = await validateStudentRequest(studentId, sectionIds, requestedDate, eventId);

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

  const targetDate = await validateStudentRequest(studentId, sectionIds, requestedDate);

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
  const reviewer = await prisma.user.findUnique({ where: { id: facultyId }, select: { role: true } });
  const where: any = { status: ODRequestStatus.PENDING };
  if (reviewer?.role !== 'admin') {
    where.OR = [
      { requestType: ODRequestType.OD, section: { facultyId } },
      { requestType: ODRequestType.ML, section: { advisorId: facultyId } },
    ];
  }
  const requests = await prisma.oDRequest.findMany({
    where,
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
      const currentAttendance = total > 0 ? Math.round((attended / total) * 100) : 0;

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

  const reviewer = await prisma.user.findUnique({ where: { id: facultyId }, select: { role: true } });
  const isAdmin = reviewer?.role === 'admin';
  const isAssignedReviewer = odRequest.requestType === ODRequestType.OD
    ? odRequest.section.facultyId === facultyId
    : odRequest.section.advisorId === facultyId;
  if (!isAssignedReviewer && !isAdmin) {
    throw new AppError('Forbidden: OD is approved by the section faculty and ML by the faculty advisor', 403);
  }
  if (odRequest.status !== ODRequestStatus.PENDING) {
    throw new AppError('This request has already been reviewed', 409);
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

  const reviewer = await prisma.user.findUnique({ where: { id: facultyId }, select: { role: true } });
  const isAdmin = reviewer?.role === 'admin';
  const isAssignedReviewer = odRequest.requestType === ODRequestType.OD
    ? odRequest.section.facultyId === facultyId
    : odRequest.section.advisorId === facultyId;
  if (!isAssignedReviewer && !isAdmin) {
    throw new AppError('Forbidden: OD is approved by the section faculty and ML by the faculty advisor', 403);
  }
  if (odRequest.status !== ODRequestStatus.PENDING) {
    throw new AppError('This request has already been reviewed', 409);
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
