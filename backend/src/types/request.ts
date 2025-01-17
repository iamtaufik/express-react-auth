import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    iat: number;
    exp: number;
  };
}
