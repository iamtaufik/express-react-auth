"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const db_1 = require("../config/db");
const users_validation_1 = require("../validations/users.validation");
const bcrypt = __importStar(require("bcrypt"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.pool.query('SELECT * FROM users');
        res.status(200).json({
            message: 'Retrieved all users',
            success: true,
            data: users.rows,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const fields = users_validation_1.createUserSchema.safeParse(body);
        if (!fields.success) {
            res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
            return;
        }
        const { name, email, password } = fields.data;
        const hashedPassword = yield bcrypt.hash(password, 10);
        const user = yield db_1.pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);
        res.status(201).json({
            message: 'User created successfully',
            success: true,
            data: user.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const body = req.body;
        const fields = users_validation_1.updateUserSchema.safeParse(body);
        if (!fields.success) {
            res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
            return;
        }
        const { password } = fields.data;
        const hashedPassword = yield bcrypt.hash(password, 10);
        const updatedUser = yield db_1.pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING id, name, email', [hashedPassword, user.id]);
        res.status(200).json({
            message: 'User updated successfully',
            success: true,
            data: updatedUser.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateUser = updateUser;
