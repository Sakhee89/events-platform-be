import express, { Express } from "express";
import apiRouter from "./routes/api-router";
import cors from "cors";
const ENV = process.env.NODE_ENV || "development";
const app: Express = express();

if (ENV === "development") {
  app.use(cors());
} else
  app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = ["*"];
    const origin = req.headers.origin!;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, UPDATE"
    );
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

export default app;
