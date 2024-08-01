import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  getAllEventByUserId,
  updateEvent,
  deleteEvent,
} from "../controllers/event-controllers";
import middleware from "../middleware";

const eventRouter = express.Router();
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.get("/user/:userId", getAllEventByUserId);
eventRouter.delete("/:id", deleteEvent);

eventRouter.post("/", createEvent).use(middleware.decodeToken);
eventRouter.patch("/:id", updateEvent);

export default eventRouter;
