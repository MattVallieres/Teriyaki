const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});


// Rating Schema
const ratingSchema = new Schema(
    {
        animeId: String,
        username: String,
        rating: Number,
    },
    {
        // Create a unique compound index on animeId and username fields
        indexes: [{ unique: true, fields: ['animeId', 'username'] }],
    }
);

module.exports = {
    Users: mongoose.model('Users', userSchema),
    Ratings: mongoose.model('Ratings', ratingSchema),
}