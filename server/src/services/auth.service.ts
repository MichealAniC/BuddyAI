import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/token';

export async function registerUser(fullName: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error: Error & { statusCode?: number } = new Error('Email already registered.');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: 'STUDENT',
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: userWithoutPassword };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error: Error & { statusCode?: number } = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    const error: Error & { statusCode?: number } = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const { passwordHash: _, ...userWithoutPassword } = user;

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: userWithoutPassword };
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error: Error & { statusCode?: number } = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
