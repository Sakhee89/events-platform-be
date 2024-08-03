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
userRouter.post("/", createUser).use(decodeToken);

export default userRouter;
