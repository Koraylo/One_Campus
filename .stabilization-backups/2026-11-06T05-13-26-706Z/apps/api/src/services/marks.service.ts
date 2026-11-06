import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { MarkData } from '@koraylo/shared';

export interface MarkRecordInput {
  studentId: string;
  marks: number;
  maxMarks: number;
}

export interface UploadMarksInput {
  sectionId: string;
  examType: string;
  records: MarkRecordInput[];
}

export async function getStudentMarks(studentId: string): Promise<MarkData[]> {
  const marks = await prisma.mark.findMany({
    where: { studentId },
    include: {
      course: true,
      student: { select: { name: true } },
    },
    orderBy: [{ course: { code: 'asc' } }, { examType: 'asc' }],
  });

  return marks.map((m) => ({
    id: m.id,
    studentId: m.studentId,
    studentName: m.student.name,
    courseId: m.courseId,
    courseCode: m.course.code,
    courseName: m.course.name,
    examType: m.examType,
    marks: m.marks,
    maxMarks: m.maxMarks,
  }));
}

export async function getSectionMarks(sectionId: string, facultyId?: string) {
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

  if (facultyId && section.facultyId !== facultyId) {
    const faculty = await prisma.user.findUnique({ where: { id: facultyId } });
    if (faculty?.role !== 'admin') {
      throw new AppError('Forbidden: you do not teach this section', 403);
    }
  }

  const studentIds = section.enrollments.map((e) => e.student.id);

  const marks = await prisma.mark.findMany({
    where: {
      courseId: section.courseId,
      studentId: { in: studentIds },
    },
  });

  // Group marks by student
  const studentMarksMap = new Map<string, any[]>();
  marks.forEach((m) => {
    const list = studentMarksMap.get(m.studentId) || [];
    list.push({
      id: m.id,
      examType: m.examType,
      marks: m.marks,
      maxMarks: m.maxMarks,
    });
    studentMarksMap.set(m.studentId, list);
  });

  const students = section.enrollments.map((e) => ({
    ...e.student,
    marks: studentMarksMap.get(e.student.id) || [],
  }));

  return {
    section: {
      id: section.id,
      sectionName: section.sectionName,
      courseId: section.course.id,
      courseCode: section.course.code,
      courseName: section.course.name,
    },
    students,
  };
}

export async function uploadSectionMarks(
  facultyId: string,
  input: UploadMarksInput
) {
  const { sectionId, examType, records } = input;

  const section = await prisma.classSection.findUnique({
    where: { id: sectionId },
  });

  if (!section) {
    throw new AppError('Section not found', 404);
  }

  const faculty = await prisma.user.findUnique({ where: { id: facultyId } });
  if (section.facultyId !== facultyId && faculty?.role !== 'admin') {
    throw new AppError('Forbidden: only the assigned faculty can upload marks for this section', 403);
  }

  if (!examType || !Array.isArray(records) || records.length === 0) {
    throw new AppError('Invalid marks payload: examType and records array are required', 400);
  }

  await prisma.$transaction(
    records.map((rec) =>
      prisma.mark.upsert({
        where: {
          studentId_courseId_examType: {
            studentId: rec.studentId,
            courseId: section.courseId,
            examType,
          },
        },
        create: {
          studentId: rec.studentId,
          courseId: section.courseId,
          examType,
          marks: Number(rec.marks),
          maxMarks: Number(rec.maxMarks),
        },
        update: {
          marks: Number(rec.marks),
          maxMarks: Number(rec.maxMarks),
        },
      })
    )
  );

  return { count: records.length, examType, courseId: section.courseId };
}
