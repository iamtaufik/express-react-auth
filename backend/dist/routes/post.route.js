"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_controller_1 = require("../controllers/posts.controller");
const authenticated_1 = __importDefault(require("../middlewares/authenticated"));
const express_1 = require("express");
const postRouter = (0, express_1.Router)();
postRouter.post('/', authenticated_1.default, posts_controller_1.createPost);
postRouter.get('/', authenticated_1.default, posts_controller_1.getAllPosts);
postRouter.get('/my-posts', authenticated_1.default, posts_controller_1.getMyPosts);
exports.default = postRouter;
