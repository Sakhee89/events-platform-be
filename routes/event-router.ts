import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  getAllEventByUserId,
  updateEvent,
  deleteEvent,
  addAttendeeEvent,
} from "../controllers/event-controllers";
import { decodeToken } from "../middleware/supabaseAuthLayer";

const eventRouter = express.Router();
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.get("/user/:userId", getAllEventByUserId);

eventRouter.delete("/:id", deleteEvent).use(decodeToken);
eventRouter.post("/", createEvent).use(decodeToken);
eventRouter.patch("/:id", updateEvent).use(decodeToken);
eventRouter.patch("/attend/:id", addAttendeeEvent).use(decodeToken);

export default eventRouter;
