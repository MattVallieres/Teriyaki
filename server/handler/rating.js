const { Ratings } = require('./Schema');

// Get the rating for that anime and the users who have rated it
const getRating = async (req, res) => {
    try {
        const { animeId, username } = req.params;
        const rating = await Ratings.findOne({ animeId, username });

        if (!rating) {
            return res.status(404).json({ error: 'Rating not found.' });
        }

        return res.json(rating);
    } catch (error) {
        console.error('Error occurred while fetching rating:', error);
        return res.sendStatus(500);
    }
};

// Add Rating when user rates the anime
const addRating = async (req, res) => {
    try {
        const { animeId } = req.params;
        const { rating, username } = req.body;

        // Check if the rating is within the valid range (1-5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }

        // Check if the user has already rated the anime
        const existingRating = await Ratings.findOne({ animeId, username });
        if (existingRating) {
            return res.status(400).json({ error: "User has already rated the anime" });
        }

        // Create a new rating instance
        const newRating = new Ratings({ animeId, username, rating });

        // Save the rating to the database
        await newRating.save();

        // Return a success response
        res.sendStatus(200);
    } catch (error) {
        console.error("Error occurred while adding rating:", error);
        res.sendStatus(500);
    }
};

// Update the rating when the user changes their rating
const updateRating = async (req, res) => {
    try {
        const { animeId } = req.params;
        const { username, rating } = req.body;

        // Verify if the username matches
        const ratingToUpdate = await Ratings.findOne({
            animeId,
            username,
        });

        if (!ratingToUpdate) {
            return res.status(404).json({ error: 'Rating not found.' });
        }

        // Update the rating value
        ratingToUpdate.rating = rating;

        // Save the updated rating
        await ratingToUpdate.save();

        return res.json(ratingToUpdate);
    } catch (error) {
        console.error('Error occurred while updating rating:', error);
        return res.sendStatus(500);
    }
};

const getAverageRating = async (req, res) => {
    try {
        const { animeId } = req.params;

        // Calculate the average rating using the aggregation framework in Mongoose
        const result = await Ratings.aggregate([
            { $match: { animeId: animeId } },
            { $group: { _id: "$animeId", averageRating: { $avg: "$rating" } } }
        ]);

        // Extract the average rating from the result or set it to "No rating"
        const averageRating = result.length > 0 ? result[0].averageRating : "No rating";

        // Return the average rating
        res.status(200).json({ averageRating });
    } catch (error) {
        console.error("Error occurred while calculating average rating:", error);
        res.sendStatus(500);
    }
};

export default {
    addRating,
    getRating,
    getAverageRating,
    updateRating,
};