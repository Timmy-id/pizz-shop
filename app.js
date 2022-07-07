const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const { productsRoute } = require('./features/product/index');
const { categoriesRoute } = require('./features/category/index');
const { ordersRoute } = require('./features/order/index');
const { authRoute } = require('./features/auth/index');
const { usersRoute } = require('./features/user/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const api = process.env.API_URL;

app.use(express.json());
app.use(morgan('dev'));

app.use(`${api}/auth`, authRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/products`, productsRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/orders`, ordersRoute);

app.get(`${api}/welcome`, (req, res) => {
  res.send('Welcome');
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
