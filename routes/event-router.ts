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

if (process.env.NODE_ENV !== "development") {
  eventRouter.delete("/:id", deleteEvent).use(decodeToken);
  eventRouter.post("/", createEvent).use(decodeToken);
  eventRouter.patch("/:id", updateEvent).use(decodeToken);
  eventRouter.patch("/attend/:id", addAttendeeEvent).use(decodeToken);
} else {
  eventRouter.delete("/:id", deleteEvent);
  eventRouter.post("/", createEvent);
  eventRouter.patch("/:id", updateEvent);
  eventRouter.patch("/attend/:id", addAttendeeEvent);
}

export default eventRouter;
