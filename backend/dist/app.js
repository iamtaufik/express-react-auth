"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
db_1.pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    }
    else {
        console.log('Connected to the database');
        release(); // Lepaskan client kembali ke pool
    }
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true, origin: process.env.CLIENT_URL }));
// app.use(cors({ credentials: true }));
app.use('/api', routes_1.default);
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });
app.get('/', (req, res) => {
    res.json({
        uptime: process.uptime(),
        message: 'OK',
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
