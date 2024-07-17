const eventsRouter = require("express").Router();

const { getEvents, createEvent } = require("../controllers/event-controllers");

eventsRouter.get("/", getEvents);

eventsRouter.post("/", createEvent);

module.exports = eventsRouter;
