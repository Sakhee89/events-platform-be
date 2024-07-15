const usersRouter = require("express").Router();

const { getUsers, createUser } = require("../controllers/user-controllers");

usersRouter.get("/", getUsers);

usersRouter.post("/", createUser);

module.exports = usersRouter;
