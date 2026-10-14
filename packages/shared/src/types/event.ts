export enum EventStatus {
  PENDING_APPROVAL = 'Pending Approval',
  UPCOMING = 'Upcoming',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected',
}

export interface EventData {
  id: string;
  clubId: string;
  clubName?: string;
  title: string;
  description?: string;
  date: string;
  venue?: string;
  status: EventStatus;
  registrationCount?: number;
  attendedCount?: number;
  createdById: string;
  approvedById?: string;
}

export interface ClubData {
  id: string;
  name: string;
  description?: string;
  facultyCoordinatorId: string;
  facultyCoordinatorName?: string;
  clubLeadId: string;
  clubLeadName?: string;
  memberCount?: number;
  eventCount?: number;
}

export interface EventRegistrationData {
  id: string;
  eventId: string;
  studentId: string;
  studentName?: string;
  attended: boolean;
}
