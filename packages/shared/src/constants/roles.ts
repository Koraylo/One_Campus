import { Role } from '../types/user';

export const ROLE_PORTAL_MAP: Record<Role, string> = {
  [Role.STUDENT]: '/student',
  [Role.FACULTY]: '/faculty',
  [Role.CLUB_LEAD]: '/club',
  [Role.ADMIN]: '/student', // admin doesn't have a portal in v1
};

export const ROLE_DISPLAY_MAP: Record<Role, string> = {
  [Role.STUDENT]: 'Student',
  [Role.FACULTY]: 'Faculty',
  [Role.CLUB_LEAD]: 'Club Member',
  [Role.ADMIN]: 'Admin',
};

export const ROLE_TAGLINE_MAP: Record<Role, string> = {
  [Role.STUDENT]: 'Learn · Connect · Belong',
  [Role.FACULTY]: 'Learn · Teach · Build Together',
  [Role.CLUB_LEAD]: 'Learn · Connect · Belong',
  [Role.ADMIN]: 'Manage · Monitor · Support',
};

export const PORTAL_SUBTITLE_MAP: Record<Role, string> = {
  [Role.STUDENT]: 'Keep learning. Keep growing. 🌱',
  [Role.FACULTY]: 'Teach. Guide. Inspire. 🌱',
  [Role.CLUB_LEAD]: 'Create. Collaborate. Inspire. 🌱',
  [Role.ADMIN]: 'Manage. Monitor. Support.',
};
