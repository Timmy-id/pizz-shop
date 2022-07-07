const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const api = process.env.API_URL;

app.use(express.json());
app.use(morgan('dev'));

app.get(`${api}/welcome`, (req, res) => {
  res.send('Welcome');
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
