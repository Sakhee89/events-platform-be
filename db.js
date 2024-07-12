const mongoose = require("mongoose");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/.env.${ENV}`,
});

const connectDB = () => {
  const mongoString = process.env.DATABASE_URL;
  mongoose
    .connect(mongoString)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
    });

  return mongoose.connection;
};

module.exports = connectDB;
