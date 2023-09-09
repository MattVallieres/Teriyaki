const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Bookmark Schema
const bookmarkSchema = new Schema({
    animeId: String,
    username: String,
  });

// user info
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    ratings: [
        {
            animeId: String,
            rating: Number,
        },
    ],
    bookmarks: [bookmarkSchema],
});

// Rating Schema
const ratingSchema = new Schema(
    {
        animeId: String,
        username: String,
        rating: Number,
    },
    {
        indexes: [{ unique: true, fields: ['animeId', 'username'] }],
    }
);

module.exports = {
    Users: mongoose.model('Users', userSchema),
    Ratings: mongoose.model('Ratings', ratingSchema),
    Bookmark: mongoose.model('Bookmarks', bookmarkSchema),
}