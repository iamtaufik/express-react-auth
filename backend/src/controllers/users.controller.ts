import { pool } from '@/config/db';
import { createUserSchema, updateUserSchema } from '@/validations/users.validation';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '@/types/request';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await pool.query('SELECT * FROM users');

    res.status(200).json({
      message: 'Retrieved all users',
      success: true,
      data: users.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const fields = createUserSchema.safeParse(body);

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

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const body = req.body;

    const fields = updateUserSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
      return;
    }

    const { password } = fields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING id, name, email', [hashedPassword, user.id]);

    res.status(200).json({
      message: 'User updated successfully',
      success: true,
      data: updatedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
