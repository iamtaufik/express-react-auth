import { createUser, getAllUsers, updateUser } from '@/controllers/users.controller';
import authenticated from '@/middlewares/authenticated';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);
userRouter.put('/', authenticated, updateUser);

export default userRouter;
