import express from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user-controllers";
import { decodeToken } from "../middleware/supabaseAuthLayer";

const userRouter = express.Router();
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", updateUser);
if (process.env.NODE_ENV !== "development") {
  userRouter.post("/", createUser).use(decodeToken);
} else {
  userRouter.post("/", createUser);
}

export default userRouter;
