const apiRouter = require("express").Router();
const usersRouter = require("./user-router");
const eventsRouter = require("./event-router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/events", eventsRouter);

module.exports = apiRouter;
