import express from "express";
import userRouter from "./user-router";
import eventRouter from "./event-router";

const apiRouter = express.Router();
apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventRouter);

export default apiRouter;
