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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.refresh = exports.login = exports.register = void 0;
const auth_validation_1 = require("../validations/auth.validation");
const db_1 = require("../config/db");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const fields = auth_validation_1.registerSchema.safeParse(body);
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const fields = auth_validation_1.loginSchema.safeParse(body);
        if (!fields.success) {
            res.status(400).json({ errors: fields.error.errors.map((error) => ({ path: error.path[0], message: error.message })) });
            return;
        }
        const { email, password } = fields.data;
        const isExistingUser = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (isExistingUser.rows.length === 0) {
            res.status(404).json({ message: 'Invalid email or password' });
            return;
        }
        const user = isExistingUser.rows[0];
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, String(process.env.JWT_SECRET), { expiresIn: '1m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, String(process.env.JWT_REFRESH_SECRET), { expiresIn: '7d' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            message: 'Login successful',
            success: true,
            data: {
                token,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET));
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ message: 'Unauthorized: Token has expired' });
                return;
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ message: 'Unauthorized: Invalid token' });
                return;
            }
            res.status(500).json({ message: 'Internal server error during token verification' });
            return;
        }
        const payload = decoded;
        const token = jsonwebtoken_1.default.sign({ id: payload.id }, String(process.env.JWT_SECRET), { expiresIn: '1m' });
        res.status(200).json({
            message: 'Token refreshed successfully',
            success: true,
            data: {
                token,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.refresh = refresh;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userQuery = yield db_1.pool.query('SELECT id, name, email, isVerived as "isVerived", created_at, updated_at FROM users WHERE id = $1', [user.id]);
        if (userQuery.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            message: 'User retrieved successfully',
            success: true,
            data: userQuery.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.me = me;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: 'Logout successful',
            success: true,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.logout = logout;
