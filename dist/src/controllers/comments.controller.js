"use strict";
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
exports.fetchReplies = exports.postReply = exports.postComment = exports.fetchComments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = __importDefault(require("../models/comments"));
const fetchComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movie_id } = req.params;
        // Convert movie_id to ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(movie_id)) {
            res.status(400).json({ success: false, message: "Invalid movie ID" });
            return;
        }
        const objectId = new mongoose_1.default.Types.ObjectId(movie_id);
        // Fetch comments
        // const commentsList = await comments.find({ movie_id: objectId });
        const commentsList = yield comments_1.default.aggregate([
            {
                $match: { movie_id: objectId }
            },
            {
                $match: { isParent: true }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        // console.log("Comments",commentsList);
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: {
                movie_id,
                comments: commentsList,
            },
        });
    }
    catch (err) {
        console.error("Error while fetching comments:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.fetchComments = fetchComments;
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    const movie_id = req.body.movie_id;
    const text = req.body.text;
    const name = user.name;
    try {
        const newComment = new comments_1.default({
            name,
            email: user.email,
            text,
            movie_id,
        });
        yield newComment.save();
        res.status(201).json({
            success: true,
            message: "Comment posted successfully",
            data: newComment,
        });
    }
    catch (err) {
        console.log("Error while posting comment:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.postComment = postComment;
const postReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    const movie_id = req.body.movie_id;
    const text = req.body.text;
    const name = user.name;
    const parent_id = req.body.comment_id;
    try {
        const newComment = new comments_1.default({
            name,
            email: user.email,
            text,
            movie_id,
            parent_id,
            isParent: false
        });
        yield comments_1.default.updateOne({ _id: parent_id }, { $set: { isReplied: true } });
        yield newComment.save();
        console.log(newComment._id);
        res.status(201).json({
            success: true,
            message: "Comment posted successfully",
            data: newComment,
        });
    }
    catch (err) {
        console.log("Error while posting comment:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.postReply = postReply;
const fetchReplies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent_id } = req.params;
    // console.log(parent_id);
    try {
        const replies = yield comments_1.default.aggregate([
            {
                $match: { parent_id: new mongoose_1.default.Types.ObjectId(parent_id) }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        console.log(replies);
        res.status(200).json({
            success: true,
            message: "Replies fetched successfully",
            data: replies
        });
    }
    catch (err) {
        console.log("Error while fetching replies:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.fetchReplies = fetchReplies;
