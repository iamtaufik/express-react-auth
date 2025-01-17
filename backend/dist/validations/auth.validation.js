"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, { message: 'Name must be at least 2 characters long' }).max(255),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(255)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    confirmPassword: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(255)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
