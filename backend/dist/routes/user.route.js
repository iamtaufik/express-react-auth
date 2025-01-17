"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("../controllers/users.controller");
const authenticated_1 = __importDefault(require("../middlewares/authenticated"));
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.get('/', users_controller_1.getAllUsers);
userRouter.post('/', users_controller_1.createUser);
userRouter.put('/', authenticated_1.default, users_controller_1.updateUser);
exports.default = userRouter;
