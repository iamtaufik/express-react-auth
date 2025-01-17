import { createPost, getAllPosts, getMyPosts } from '@/controllers/posts.controller';
import authenticated from '@/middlewares/authenticated';
import { Router } from 'express';

const postRouter = Router();

postRouter.post('/', authenticated, createPost);
postRouter.get('/', authenticated, getAllPosts);
postRouter.get('/my-posts', authenticated, getMyPosts);

export default postRouter;
