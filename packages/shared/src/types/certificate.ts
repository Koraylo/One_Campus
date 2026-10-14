export enum CertificateStatus {
  PROPOSED = 'Proposed',
  APPROVED = 'Approved',
  DISTRIBUTED = 'Distributed',
}

export interface CertificateData {
  id: string;
  studentId: string;
  studentName?: string;
  eventId: string;
  eventName?: string;
  title: string;
  status: CertificateStatus;
  proposedById: string;
  proposedByName?: string;
  approvedById?: string;
  createdAt: string;
}
