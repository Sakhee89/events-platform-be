// require("dotenv").config();

const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello World!" });
});

module.exports = app;
