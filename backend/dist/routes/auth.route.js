"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const authenticated_1 = __importDefault(require("../middlewares/authenticated"));
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', auth_controller_1.register);
authRouter.post('/login', auth_controller_1.login);
authRouter.get('/refresh-token', auth_controller_1.refresh);
authRouter.get('/me', authenticated_1.default, auth_controller_1.me);
authRouter.delete('/logout', authenticated_1.default, auth_controller_1.logout);
exports.default = authRouter;
