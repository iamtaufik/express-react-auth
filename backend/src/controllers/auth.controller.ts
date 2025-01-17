import { loginSchema, registerSchema } from '@/validations/auth.validation';
import { pool } from '@/config/db';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/request';

export const register = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const fields = registerSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
      return;
    }
    const { name, email, password } = fields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);

    res.status(201).json({
      message: 'User created successfully',
      success: true,
      data: user.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const fields = loginSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
      return;
    }

    const { email, password } = fields.data;

    const isExistingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (isExistingUser.rows.length === 0) {
      res.status(404).json({ message: 'Invalid email or password' });
      return;
    }

    const user = isExistingUser.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET), { expiresIn: '1m' });

    const refreshToken = jwt.sign({ id: user.id }, String(process.env.JWT_REFRESH_SECRET), { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      message: 'Login successful',
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let decoded: JwtPayload | string;
    try {
      decoded = jwt.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET));
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

    const payload = decoded as { id: string; iat: number; exp: number };

    const token = jwt.sign({ id: payload.id }, String(process.env.JWT_SECRET), { expiresIn: '1m' });

    res.status(200).json({
      message: 'Token refreshed successfully',
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userQuery = await pool.query('SELECT id, name, email, isVerived as "isVerived", created_at, updated_at FROM users WHERE id = $1', [user.id]);

    if (userQuery.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      success: true,
      data: userQuery.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'Logout successful',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
