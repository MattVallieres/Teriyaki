const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user info
const userSchema = new Schema({
    username: String,
    password: String,
});

module.exports = {
    Users: mongoose.model('Users', userSchema)
}