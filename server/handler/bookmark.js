const { Bookmark } = require('./Schema');

const getAllBookmarks = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        res.json({ bookmarks: (await Bookmark.distinct('animeId', { username })).map(animeId => ({ AnimeId: animeId })) });
    } catch (error) {
        console.error('Error occurred while getting bookmarks:', error);
        res.sendStatus(500);
    }
};

const getBookmark = async (req, res) => {
    try {
        const { animeId, username } = req.params;

        // Check if the user is authenticated
        if (!username) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the bookmark
        const bookmark = await Bookmark.findOne({ animeId, username });

        if (!bookmark) {
            // Bookmark not found
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        // Return the bookmark
        res.json(bookmark);
    } catch (error) {
        console.error('Error occurred while getting bookmark:', error);
        res.sendStatus(500);
    }
};


const addBookmark = async (req, res) => {
    try {
        const { animeId, username } = req.params;

        // Check if the user is authenticated (based on the provided username)
        if (!username) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Create a new bookmark instance
        const newBookmark = new Bookmark({
            animeId,
            username,
        });

        // Save the bookmark to the database
        const savedBookmark = await newBookmark.save();

        // Log the saved bookmark for debugging
        console.log('Bookmark saved:', savedBookmark);

        // Return a success response
        res.sendStatus(200);
    } catch (error) {
        console.error('Error occurred while adding bookmark:', error);
        res.sendStatus(500);
    }
};

const removeBookmark = async (req, res) => {
    try {
        const { animeId, username } = req.params;

        // Check if the user is authenticated
        if (!username) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find and remove the bookmark
        const result = await Bookmark.deleteOne({ animeId, username });

        if (result.deletedCount === 0) {
            // Bookmark not found
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        // Return a success response
        return res.sendStatus(200);
    } catch (error) {
        console.error('Error occurred while removing bookmark:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addBookmark,
    removeBookmark,
    getBookmark,
    getAllBookmarks,
};