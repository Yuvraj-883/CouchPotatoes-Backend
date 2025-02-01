"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    plot: { type: String, required: true },
    genres: [{ type: String }],
    runtime: { type: Number },
    cast: [{ type: String }],
    num_mflix_comments: { type: Number },
    poster: { type: String },
    title: { type: String, required: true },
    fullplot: { type: String },
    languages: [{ type: String }],
    released: { type: Date },
    directors: [{ type: String }],
    writers: [{ type: String }],
    awards: {
        wins: { type: Number },
        nominations: { type: Number },
        text: { type: String },
    },
    lastupdated: { type: String },
    year: { type: Number },
    imdb: {
        rating: { type: Number },
        votes: { type: Number },
        id: { type: Number },
    },
    countries: [{ type: String }],
    type: { type: String },
    tomatoes: {
        viewer: {
            rating: { type: Number },
            numReviews: { type: Number },
            meter: { type: Number },
        },
        lastUpdated: { type: Date },
    },
    likes: { type: Number, default: 0 }, // Number of likes
    likedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, {
    collection: "movies", // Explicitly specify the collection name
});
movieSchema.index({ title: 'text', plot: 'text', directors: 'text', cast: 'text' }, { weights: { title: 10, plot: 5, cast: 3, directors: 1 } });
exports.default = (0, mongoose_1.model)("Movie", movieSchema);
