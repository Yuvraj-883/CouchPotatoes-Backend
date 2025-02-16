"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    movie_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Movie', required: true },
    isParent: { type: Boolean, default: true },
    parent_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' },
    isReplied: { type: Boolean, default: false }
}, { timestamps: true });
const Comment = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = Comment;
