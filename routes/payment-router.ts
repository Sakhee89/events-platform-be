import express from "express";
import { decodeToken } from "../middleware/supabaseAuthLayer";
import { eventPayment } from "../controllers/payment-controllers";

const paymentRouter = express.Router();
paymentRouter.get("/event/:id", eventPayment).use(decodeToken);

export default paymentRouter;
