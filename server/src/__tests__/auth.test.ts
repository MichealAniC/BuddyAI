import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
vi.mock('../config/prisma', () => ({
  default: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock password utilities
vi.mock('../utils/password', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
  comparePassword: vi.fn().mockResolvedValue(true),
}));

// Mock token utility
vi.mock('../utils/token', () => ({
  generateToken: vi.fn().mockReturnValue('mock-jwt-token'),
}));

import { registerUser, loginUser } from '../services/auth.service';
import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/token';

const mockPrisma = vi.mocked(prisma);

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should hash password and create user', async () => {
      // No existing user with this email
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        fullName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashed-password',
        role: 'STUDENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await registerUser({
        fullName: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        role: 'STUDENT',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(
        expect.objectContaining({
          id: 1,
          fullName: 'Alice',
          email: 'alice@example.com',
          role: 'STUDENT',
        })
      );
      // Password hash must not be in returned user
      expect((result.user as any).passwordHash).toBeUndefined();

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'alice@example.com' },
      });
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          fullName: 'Alice',
          email: 'alice@example.com',
          passwordHash: 'hashed-password',
          role: 'STUDENT',
        },
      });
    });

    it('should throw if email is already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 } as any);

      await expect(
        registerUser({
          fullName: 'Bob',
          email: 'taken@example.com',
          password: 'password123',
          role: 'STUDENT',
        })
      ).rejects.toThrow('Email already registered.');
    });
  });

  describe('loginUser', () => {
    it('should return token for valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        fullName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashed-password',
        role: 'STUDENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(comparePassword).mockResolvedValueOnce(true);

      const result = await loginUser('alice@example.com', 'password123');

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('alice@example.com');
      expect((result.user as any).passwordHash).toBeUndefined();
    });

    it('should throw for non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(loginUser('unknown@example.com', 'password123')).rejects.toThrow(
        'Invalid email or password.'
      );
    });

    it('should throw for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        fullName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashed-password',
        role: 'STUDENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(comparePassword).mockResolvedValueOnce(false);

      await expect(loginUser('alice@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid email or password.'
      );
    });
  });
});
