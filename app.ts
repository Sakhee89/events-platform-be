import express, { Express } from "express";
import apiRouter from "./routes/api-router";
import cors from "cors";
const ENV = process.env.NODE_ENV || "development";
const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

export default app;
