"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    content: zod_1.z.string().min(2, { message: 'Content must be at least 2 characters long' }),
});
