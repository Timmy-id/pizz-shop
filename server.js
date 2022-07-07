const app = require('./app');
const connectDB = require('./utils/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
