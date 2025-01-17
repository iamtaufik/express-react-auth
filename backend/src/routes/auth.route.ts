import { login, logout, me, refresh, register } from '@/controllers/auth.controller';
import authenticated from '@/middlewares/authenticated';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/refresh-token', refresh);
authRouter.get('/me', authenticated, me);
authRouter.delete('/logout', authenticated, logout);

export default authRouter;
