import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from '@/routes';
import { pool } from './config/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to the database');
    release(); // Lepaskan client kembali ke pool
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
// app.use(cors({ credentials: true }));

app.use('/api', routes);

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });

app.get('/', (req: Request, res: Response) => {
  res.json({
    uptime: process.uptime(),
    message: 'OK',
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
