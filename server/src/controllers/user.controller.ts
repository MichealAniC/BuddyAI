import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/user.service';

export async function listStudents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const students = await userService.getStudents();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
}

export async function getStudent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const profile = await userService.getStudentProfile(id);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}
