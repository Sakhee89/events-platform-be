const eventsRouter = require("express").Router();

const {
  getEvents,
  createEvent,
  getEventById,
} = require("../controllers/event-controllers");

eventsRouter.get("/", getEvents);

eventsRouter.post("/", createEvent);

eventsRouter.get("/:id", getEventById);

module.exports = eventsRouter;
