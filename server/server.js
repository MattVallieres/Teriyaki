const express = require('express');
const cors = require('cors');
const PORT = 8000;
const app = express();

app.use(express.json());
// Enable CORS
app.use(cors());

const { Signup, Login, UserInfo } = require('./handler/users')
const { addRating, getRating, getAverageRating, updateRating, } = require('./handler/rating')
const { addBookmark, removeBookmark, getBookmark, getAllBookmarks } = require('./handler/bookmark')

// User API endpoints
app.post('/api/signup', Signup);
app.post('/api/login', Login);
app.get('/api/userinfo/:username', UserInfo);

// Rating API endpoints
app.get("/anime/:animeId/rating/average", getAverageRating);
app.get("/anime/:animeId/ratings/:username", getRating);
app.post('/anime/:animeId/add-rating', addRating);
app.patch('/anime/:animeId/update-rating', updateRating);

// Bookmark API endpoints
app.get("/anime/:username/bookmarks", getAllBookmarks);
app.get('/anime/:animeId/bookmark/:username', getBookmark);
app.post('/anime/:animeId/bookmark/:username', addBookmark);
app.delete('/anime/:animeId/bookmark/:username', removeBookmark);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})