export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  OD = 'OD',
  ML = 'ML',
}

export enum ODRequestType {
  OD = 'OD',
  ML = 'ML',
}

export enum ODRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sectionId: string;
  date: string;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  od: number;
  ml: number;
  percentage: number;
}

export interface ODRequestData {
  id: string;
  studentId: string;
  sectionId: string;
  eventId?: string;
  requestType: ODRequestType;
  requestedDate: string;
  reason?: string;
  status: ODRequestStatus;
  studentName?: string;
  courseName?: string;
  eventName?: string;
  currentAttendance?: number;
}
