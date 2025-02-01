"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    try {
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body = Object.assign(Object.assign({}, req.body), { user: Object.assign({}, decoded) });
        next();
    }
    catch (err) {
        console.log("Error while verifying token:", err);
        res.status(404).json({ error: err.message });
    }
};
exports.verifyToken = verifyToken;
