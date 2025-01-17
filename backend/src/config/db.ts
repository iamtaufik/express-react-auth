import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  database: process.env.DATABASE_NAME,
  user: String(process.env.DATABASE_USER),
  password: String(process.env.DATABASE_PASSWORD),
  host: process.env.DATABASE_HOST,
  port: 5432,
  ssl: true
});
