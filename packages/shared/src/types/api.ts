export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface MarkData {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  examType: string;
  marks: number;
  maxMarks: number;
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  sectionName: string;
  slot: string;
  room: string;
  facultyName: string;
  startTime?: string;
  endTime?: string;
}

export interface GCRMapping {
  id: string;
  sectionId: string;
  courseCode?: string;
  courseName?: string;
  gcrCourseId: string;
  syncStatus: string;
}

export interface DashboardStats {
  label: string;
  value: number | string;
  icon?: string;
  href?: string;
}
