import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  getAllEventByUserId,
  updateEvent,
  deleteEvent,
  addAttendeeEvent,
  getAllEventsWithAttendee,
} from "../controllers/event-controllers";
import { decodeToken } from "../middleware/supabaseAuthLayer";

const eventRouter = express.Router();
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.get("/user/:userId", getAllEventByUserId);

if (process.env.NODE_ENV !== "development") {
  eventRouter.delete("/:id", deleteEvent).use(decodeToken);
  eventRouter.post("/", createEvent).use(decodeToken);
  eventRouter.put("/:id", updateEvent).use(decodeToken);
  eventRouter.patch("/attend/:id", addAttendeeEvent).use(decodeToken);
  eventRouter.get("/by/attendee", getAllEventsWithAttendee).use(decodeToken);
} else {
  eventRouter.delete("/:id", deleteEvent);
  eventRouter.post("/", createEvent);
  eventRouter.put("/:id", updateEvent);
  eventRouter.patch("/attend/:id", addAttendeeEvent);
  eventRouter.get("/by/attendee", getAllEventsWithAttendee);
}

export default eventRouter;
