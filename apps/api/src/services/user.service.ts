import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { Role, UserProfile } from '@koraylo/shared';

export async function getUserById(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      year: true,
      section: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    department: user.department || undefined,
    year: user.year || undefined,
    section: user.section || undefined,
  };
}
