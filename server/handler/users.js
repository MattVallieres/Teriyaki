const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { Users } = require('./Schema');

require("dotenv").config();
const { MONGO_URI } = process.env;

// connecting to mongodb
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "TeriyakiDatabase"
});

const UserInfo = async (req, res) => {
    try {
        // Retrieve the username from the request parameters or the authenticated user's username
        const username = req.params.username || req.user.username;

        // Find the user in the database by username, excluding the password field
        const user = await Users.findOne({ username }, { password: 0 });

        if (!user) {
            // User not found
            return res.status(404).json({ message: 'User not found' });
        }

        // If you have a ratings field in your user schema, include it in the response
        const userInfoWithRatings = {
            username: user.username,
            // Include the ratings field, if available
            ratings: user.ratings || [], // Assuming 'ratings' is an array of anime ratings
            // Add other user fields as needed
        };

        // Return the user information including anime ratings
        return res.status(200).json(userInfoWithRatings);
    } catch (error) {
        // If an error occurs during the process, log the error and send an internal server error response
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Post endpoint to signup to the website
const Signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const validationType = {
            // Check if the username or password field is empty
            missingFields: (!username || !password),
            // Check if the username has at least three letters
            mustHaveThreeLetters: username.length < 3,
            // Check if the username uses special characters
            hasSpecialCharacters: /[!@#$%^&*(),.?":{}|<>]/.test(username),
            // Check if the username has spaces
            hasSpaces: username.includes(' '),
            // Check if the username exceeds more than 15 letters
            exceedsMaxLength: username.length > 15,
            // Check password must contain 8 letters and 2 numbers
            passwordRequirements: !(password.match(/[a-zA-Z]/g)?.length >= 8)
        };

        // Check if the username has been taken
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is taken" });
        }

        switch (true) {
            case validationType.missingFields:
                return res.status(400).json({ error: "Username and password are required" });
            case validationType.mustHaveThreeLetters:
                return res.status(400).json({ error: "Username must at least contain 3 letters" })
            case validationType.hasSpecialCharacters:
                return res.status(400).json({ error: "Username cannot contain special characters" });
            case validationType.hasSpaces:
                return res.status(400).json({ error: "Username cannot contain spaces" });
            case validationType.exceedsMaxLength:
                return res.status(400).json({ error: "Username cannot exceed 20 characters" });
            case validationType.passwordRequirements:
                return res.status(400).json({
                    error: "Password must contain at least 8"
                });
            case validationType.existingUser:
                return res.status(400).json({ error: "Username is taken" });
            default:
                // Using bcrypt to has the password in the database
                const hashedPassword = await bcrypt.hash(password, 10);
                // Push the information in the "Users" database
                const user = new Users({ username, password: hashedPassword });
                await user.save();
                console.log("Account successfully created!");
                res.sendStatus(201);
                break;
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.sendStatus(500);
    }
};

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await Users.findOne({ username });

        if (!user) {
            // User not found in the database
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // Invalid password
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Password is correct, user is logged in
        return res.status(200).json({ message: 'Login successful', user: { name: user.username } });
    } catch (error) {
        // If an error occurs during the process, log the error and send an internal server error response
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    Signup,
    Login,
    UserInfo
};