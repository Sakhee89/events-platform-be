import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  getAllEventByUserId,
  updateEvent,
  deleteEvent,
} from "../controllers/event-controllers";

const eventRouter = express.Router();
eventRouter.get("/", getEvents);
eventRouter.post("/", createEvent);
eventRouter.get("/:id", getEventById);
eventRouter.patch("/:id", updateEvent);
eventRouter.get("/user/:userId", getAllEventByUserId);
eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
