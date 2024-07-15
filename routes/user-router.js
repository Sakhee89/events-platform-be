const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/user-controllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
