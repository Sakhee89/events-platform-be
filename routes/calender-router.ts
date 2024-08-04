import express from "express";
import { createToken } from "../controllers/calendar-controllers";

const calenderRouter = express.Router();
calenderRouter.post("/create-token", createToken);

export default calenderRouter;
