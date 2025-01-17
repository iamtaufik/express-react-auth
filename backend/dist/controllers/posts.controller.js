"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.getMyPosts = exports.createPost = void 0;
const db_1 = require("../config/db");
const posts_validation_1 = require("../validations/posts.validation");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const body = req.body;
        const fields = posts_validation_1.createPostSchema.safeParse(body);
        if (!fields.success) {
            res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
            return;
        }
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { content } = fields.data;
        const post = yield db_1.pool.query('INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *', [content, req.user.id]);
        res.status(201).json({
            message: 'Post created successfully',
            success: true,
            data: post.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createPost = createPost;
const getMyPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const posts = yield db_1.pool.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);
        res.status(200).json({
            message: 'Retrieved all posts',
            success: true,
            data: posts.rows,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getMyPosts = getMyPosts;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield db_1.pool.query(`
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllPosts = getAllPosts;
