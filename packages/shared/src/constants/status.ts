export { AttendanceStatus, ODRequestType, ODRequestStatus } from '../types/attendance';
export { EventStatus } from '../types/event';
export { CertificateStatus } from '../types/certificate';
export { ChannelType } from '../types/channel';

// Slot time mapping (SRM-style time slots)
export const SLOT_TIMES: Record<string, { start: string; end: string }> = {
  'A1': { start: '08:00', end: '08:50' },
  'A2': { start: '08:50', end: '09:40' },
  'B1': { start: '09:45', end: '10:35' },
  'B2': { start: '10:35', end: '11:25' },
  'C1': { start: '11:30', end: '12:20' },
  'C2': { start: '12:20', end: '13:10' },
  'D1': { start: '14:00', end: '14:50' },
  'D2': { start: '14:50', end: '15:40' },
  'E1': { start: '15:00', end: '15:50' },
  'E2': { start: '15:50', end: '16:40' },
  'F1': { start: '16:45', end: '17:35' },
  'F2': { start: '17:35', end: '18:25' },
};

export const ATTENDANCE_THRESHOLD = 75; // minimum attendance percentage
