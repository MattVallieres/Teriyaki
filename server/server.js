const express = require('express');
const cors = require('cors');
const PORT = 8000;
const app = express();

app.use(express.json());
// Enable CORS
app.use(cors());

const { Signup, Login, UserInfo } = require('./handler/users')
const { addRating, getRating, getAverageRating, updateRating, } = require('./handler/rating')

app.post('/api/signup', Signup);
app.post('/api/login', Login);
app.get('/api/userinfo/:username', UserInfo);

app.get("/anime/:animeId/rating/average", getAverageRating);
app.get("/anime/:animeId/ratings/:username", getRating);
app.post('/anime/:animeId/add-rating', addRating);
app.patch('/anime/:animeId/update-rating', updateRating);



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})