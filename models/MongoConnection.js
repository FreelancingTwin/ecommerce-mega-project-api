const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const dbURI = process.env.DB_URI;

const mongoose = require('mongoose')

const initDB = () => {
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(result => console.log('db connected'))
  .catch(err => console.log(err));
}

module.exports = initDB;