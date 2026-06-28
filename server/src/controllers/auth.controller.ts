import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/auth.service';

const VALID_ROLES = ['STUDENT', 'COUNSELLOR'] as const;

export async function register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fullName, email, password, role, gender, age } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ error: 'fullName, email, and password are required.' });
      return;
    }

    const validatedRole = role && VALID_ROLES.includes(role) ? role : 'STUDENT';

    if (validatedRole === 'STUDENT') {
      if (gender === undefined || gender === null || String(gender).trim() === '') {
        res.status(400).json({ error: 'gender is required for student registration.' });
        return;
      }
      if (age === undefined || age === null) {
        res.status(400).json({ error: 'age is required for student registration.' });
        return;
      }
    }

    const validatedAge = age !== undefined && age !== null ? Number(age) : undefined;

    if (validatedAge !== undefined && (!Number.isInteger(validatedAge) || validatedAge < 1 || validatedAge > 120)) {
      res.status(400).json({ error: 'age must be an integer between 1 and 120.' });
      return;
    }

    const result = await authService.registerUser({
      fullName,
      email,
      password,
      role: validatedRole,
      gender:
        validatedRole === 'STUDENT' && gender !== undefined && gender !== null
          ? String(gender).toUpperCase()
          : undefined,
      age: validatedRole === 'STUDENT' ? validatedAge : undefined,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required.' });
      return;
    }

    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const user = await authService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
