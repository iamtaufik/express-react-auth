import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import postRouter from './post.route';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/auth', authRouter);
routes.use('/posts', postRouter);

export default routes;
