"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticated = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
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
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.default = authenticated;
