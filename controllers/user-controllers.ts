import { Request, Response } from "express";
import userSchema, { User } from "../models/userSchema";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userSchema.find<User>();

    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { firebaseUid, name, email, picture, role } = req.body;

  if (!firebaseUid || !name || !email) {
    res.status(400).json({ msg: "Invalid fields" });
    return;
  }

  try {
    const existingUser = await userSchema.findOne({ firebaseUid });

    if (existingUser) {
      res.status(201).json({ msg: "User already exist" });
      return;
    }

    const newUser = new userSchema({
      firebaseUid,
      name,
      email,
      picture,
      role,
    });

    await newUser.save();

    res.status(201).json({ newUser: newUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userSchema.findOne({ firebaseUid: id });

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json("Internal Server Error");
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["staff", "member"].includes(role)) {
    res.status(400).json({ msg: "Invalid role" });
    return;
  }

  try {
    const user = await userSchema.findOne({ firebaseUid: id });

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    user.role = role;
    const updatedUser = await user.save();

    res.status(200).json({
      msg: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
