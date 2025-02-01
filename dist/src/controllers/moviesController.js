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
exports.likeUnlikeMovie = exports.fetchTopRated = exports.fetchGenres = exports.fetchMovieById = exports.fetchMovies = void 0;
const movies_1 = __importDefault(require("../models/movies"));
const users_1 = __importDefault(require("../models/users"));
const fetchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 9 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    const { genres } = req.query;
    let genresFilter = [];
    if (genres) {
        genresFilter = genres.split(',');
    }
    const matchedQueries = genresFilter.length > 0 ? { genres: { $in: genresFilter } } : {};
    try {
        let movies;
        if (genresFilter.length > 0) {
            movies = yield movies_1.default.aggregate([
                {
                    $match: matchedQueries
                },
                {
                    $addFields: {
                        popularity: {
                            $avg: ['$awards.wins', '$awards.nominations', '$imdb.rating', '$imdb.votes', '$tomatoes.viewer.rating', '$tomatoes.viewer.numReviews']
                        }
                    }
                },
                {
                    $sort: { popularity: -1 }
                },
                {
                    $skip: (pageNumber - 1) * pageSizeNumber
                },
                {
                    $limit: pageSizeNumber,
                },
            ]);
            console.log(movies);
        }
        else {
            movies = yield movies_1.default.aggregate([
                {
                    $addFields: {
                        popularity: {
                            $avg: ['$awards.wins', '$awards.nominations', '$imdb.rating', '$imdb.votes', '$tomatoes.viewer.rating', '$tomatoes.viewer.numReviews']
                        }
                    }
                },
                {
                    $sort: { popularity: -1 }
                },
                {
                    $skip: (pageNumber - 1) * pageSizeNumber
                }, {
                    $limit: pageSizeNumber
                }
            ]);
        }
        const totalMovies = yield movies_1.default.countDocuments(matchedQueries);
        const totalPages = Math.ceil(totalMovies / pageSizeNumber);
        res.send({ movies,
            totalMovies,
            totalPages,
            currentPage: pageNumber
        });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
});
exports.fetchMovies = fetchMovies;
const fetchMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const movieDetails = yield movies_1.default.findById(id);
        if (!movieDetails) {
            res.status(404).send({ error: "Movie not found" });
        }
        res.send(movieDetails);
    }
    catch (error) {
        res.status(500).send({ error: "Couldn't find the movie" });
        console.log(error);
    }
});
exports.fetchMovieById = fetchMovieById;
const fetchGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = yield movies_1.default.aggregate([
            { $unwind: "$genres" }, // Ensure genres is an array
            {
                $group: {
                    _id: null, // No need for _id grouping
                    genres: { $addToSet: "$genres" }, // Get unique genres
                },
            },
            {
                $project: {
                    _id: 0, // Exclude _id from the result
                    genres: 1, // Include genres array in the result
                },
            },
        ]);
        if (genres && genres.length > 0) {
            res.status(200).send(genres[0].genres); // Send genres array directly
        }
        else {
            res.status(200).send([]); // Return an empty array if no genres are found
        }
    }
    catch (err) {
        console.log("Error fetching genres", err); // Log the error
        res.status(500).send({ error: "An error occurred while fetching genres" }); // Send error response
    }
});
exports.fetchGenres = fetchGenres;
const fetchTopRated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, size = 12 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);
    const totalMovies = 500;
    try {
        const movies = yield movies_1.default.aggregate([
            {
                $match: {
                    "imdb.rating": { $ne: "" } // Filter out movies with an empty rating
                }
            },
            {
                $sort: { "imdb.rating": -1 }, // Correctly reference the rating field
            },
            {
                $limit: totalMovies
            },
            {
                $skip: (pageNumber - 1) * pageSize
            },
            {
                $limit: pageSize, // Optionally limit the number of top-rated movies to a specific count (e.g., 10)
            },
        ]);
        const totalPages = Math.ceil(totalMovies / pageSize);
        res.status(200).send({
            movies, pageNumber, totalMovies, totalPages
        }); // Return the top-rated movies
    }
    catch (err) {
        console.log("Error fetching top-rated movies:", err);
        res.status(500).send({ error: "An error occurred while fetching top-rated movies" });
    }
});
exports.fetchTopRated = fetchTopRated;
const likeUnlikeMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // movie ID
    const { user } = req.body; // user info from the authenticated request
    try {
        console.log("Like function called", user.email);
        // Fetch the movie and the user
        const movie = yield movies_1.default.findById(id);
        const likedByUser = yield users_1.default.findOne({ email: user.email });
        // Check if both movie and user exist
        if (!movie || !likedByUser) {
            res.status(404).send({ error: "Movie or User not found" });
            return;
        }
        // Check if the user already liked this movie
        const alreadyLiked = movie.likedBy.includes(likedByUser._id);
        if (alreadyLiked) {
            // User is unliking the movie
            movie.likes -= 1;
            // Remove user from the likedBy array
            movie.likedBy = movie.likedBy.filter((userId) => userId.toString() !== likedByUser._id.toString());
            // Update the user's likedMovies list
            likedByUser.likedMovies = likedByUser.likedMovies.filter((movieId) => { var _a; return movieId.toString() !== ((_a = movie._id) === null || _a === void 0 ? void 0 : _a.toString()); });
        }
        else {
            // User is liking the movie
            movie.likes += 1;
            // Add user to the likedBy array
            movie.likedBy.push(likedByUser._id);
            // Update the user's likedMovies list
            likedByUser.likedMovies.push(movie._id);
        }
        // Save the changes to the movie and user
        yield movie.save();
        yield likedByUser.save();
        res.status(200).send({
            message: `Movie ${alreadyLiked ? "unliked" : "liked"} successfully`,
            likes: movie.likes,
        });
    }
    catch (err) {
        console.log("Like function called", user.email);
        console.error("Error while liking the movie:", err);
        res.status(500).send({ error: "An error occurred while liking the movie" });
    }
});
exports.likeUnlikeMovie = likeUnlikeMovie;
