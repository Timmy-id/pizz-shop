const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const { productsRoute } = require('./features/product/index');
const { categoriesRoute } = require('./features/category/index');
const { ordersRoute } = require('./features/order/index');
const { authRoute } = require('./features/auth/index');
const { usersRoute } = require('./features/user/index');
const authorize = require('./helpers/jwtHelpers');
const errorHandler = require('./helpers/errorHandler');

dotenv.config();

const app = express();

const api = process.env.API_URL;

app.use(cors());
app.options('*', cors());

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(authorize());
app.use(
  '/public/uploads',
  express.static(__dirname + '/public/uploads')
);
app.use(errorHandler);

// routes
app.use(`${api}/auth`, authRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/products`, productsRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/orders`, ordersRoute);

app.get(`${api}/welcome`, (req, res) => {
  res.send('Welcome');
});

module.exports = app;
