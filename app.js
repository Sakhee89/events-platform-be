require("dotenv").config();

const express = require("express");
const connectDB = require("./db");
const eventRoutes = require("./routes/event-routes");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api", eventRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello World!" });
});

module.exports = app;
