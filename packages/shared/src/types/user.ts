export enum Role {
  STUDENT = 'student',
  FACULTY = 'faculty',
  CLUB_LEAD = 'club_lead',
  ADMIN = 'admin',
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  year?: number;
  section?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  message: string;
}
