import { Role } from '@prisma/client';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: number; // id user trong database
    email: string;
    role: Role;
  };
}
