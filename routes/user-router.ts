import express from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user-controllers";

const userRouter = express.Router();
userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.get("/:id", getUserById);
userRouter.patch("/:userId", updateUser);

export default userRouter;
