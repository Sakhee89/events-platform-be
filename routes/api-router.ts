import express from "express";
import userRouter from "./user-router";
import eventRouter from "./event-router";
import paymentRouter from "./payment-router";
import calenderRouter from "./calender-router";

const apiRouter = express.Router();
apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/calendar", calenderRouter);
apiRouter.use("/payment", paymentRouter);

export default apiRouter;
