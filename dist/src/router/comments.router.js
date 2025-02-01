"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controller_1 = require("../controllers/comments.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/:movie_id', comments_controller_1.fetchComments);
router.post('/', authMiddleware_1.verifyToken, comments_controller_1.postComment);
router.post('/reply', authMiddleware_1.verifyToken, comments_controller_1.postReply);
router.get('/replies/:parent_id', comments_controller_1.fetchReplies);
exports.default = router;
