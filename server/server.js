const express = require('express');
const cors = require('cors');
const PORT = 8000;
const app = express();

app.use(express.json())
// Enable CORS
app.use(cors());

const { Signup, Login, UserInfo } = require('./handler/users')

app.post('/api/signup', Signup);
app.post('/api/login', Login);
app.get('/api/userinfo', UserInfo);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})