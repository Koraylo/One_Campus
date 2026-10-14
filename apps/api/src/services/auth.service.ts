import { prisma } from '../lib/prisma';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { Role, UserProfile } from '@koraylo/shared';

export async function loginUser(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const userProfile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    department: user.department || undefined,
    year: user.year || undefined,
    section: user.section || undefined,
  };

  const token = generateToken({
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  return { user: userProfile, token };
}

export async function getUserProfileById(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
