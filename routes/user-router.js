const usersRouter = require("express").Router();

const {
  getUsers,
  createUser,
  getUserByEmail,
} = require("../controllers/user-controllers");

usersRouter.get("/", getUsers);

usersRouter.post("/", createUser);

usersRouter.get("/:email", getUserByEmail);

module.exports = usersRouter;
