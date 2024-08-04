import express, { Express } from "express";
import apiRouter from "./routes/api-router";
import cors from "cors";

const app: Express = express();

// const corsOptions = {
//   origin: "http://127.0.0.1:5173/",
//   optionsSuccessStatus: 200,
// };

const options = [
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
];

app.use(options);

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

export default app;
