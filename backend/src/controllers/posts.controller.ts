import { pool } from '@/config/db';
import { AuthenticatedRequest } from '@/types/request';
import { createPostSchema } from '@/validations/posts.validation';
import { Response } from 'express';

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const body = req.body;

    const fields = createPostSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { content } = fields.data;

    const post = await pool.query('INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *', [content, req.user.id]);

    res.status(201).json({
      message: 'Post created successfully',
      success: true,
      data: post.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const posts = await pool.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);

    res.status(200).json({
      message: 'Retrieved all posts',
      success: true,
      data: posts.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const posts = await pool.query(`
      SELECT 
        posts.id AS id, 
        posts.content AS content, 
        users.name AS author, 
        users.isVerived AS "isVerivedUser", 
        posts.created_at AS created_at, 
        posts.updated_at AS updated_at
      FROM posts 
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);

    res.status(200).json({
      message: 'Retrieved all posts',
      success: true,
      data: posts.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
