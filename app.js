// require("dotenv").config();

const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

module.exports = app;
