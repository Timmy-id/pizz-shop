const mongoose = require('mongoose');

const URI = process.env.DB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDb = async () => {
  const URI = process.env.DB_URI;
  try {
    await mongoose.connect(URI, options);
    console.log('Connected to DB');
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
};

module.exports = connectDb;
