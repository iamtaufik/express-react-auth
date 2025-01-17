import { AuthenticatedRequest } from '@/types/request';
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const authenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let decoded: JwtPayload | string;
    try {
      decoded = jwt.verify(token, String(process.env.JWT_SECRET));
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Unauthorized: Token has expired' });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
      }
      res.status(500).json({ message: 'Internal server error during token verification' });
      return;
    }

    req.user = decoded as { id: string; iat: number; exp: number };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default authenticated;
