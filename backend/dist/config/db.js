"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    database: process.env.DATABASE_NAME,
    user: String(process.env.DATABASE_USER),
    password: String(process.env.DATABASE_PASSWORD),
    host: process.env.DATABASE_HOST,
    port: 5432,
    ssl: true
});
