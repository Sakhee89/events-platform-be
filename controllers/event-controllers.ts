import { Request, Response } from "express";
import eventSchema, { Event } from "../models/eventSchema";
import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import { extractTokenFromAuthorization } from "../utils/extractTokenFromAuthorization";
import admin from "../config/firebaseConfig";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { startDate, location, theme, priceType, title } = req.query;

    const filter: Record<string, any> = {};

    if (theme) filter.theme = theme;
    if (startDate) filter.date = { $gt: new Date(startDate as string) };
    if (location) filter.location = new RegExp(location as string, "i");
    if (title) filter.title = new RegExp(title as string, "i");
    if (priceType) {
      if (priceType === "free") {
        filter.price = 0;
      } else if (priceType === "paid") {
        filter.price = { $gt: 0 };
      }
    }

    const events = await eventSchema.find<Event>(filter);

    res.status(200).send({ events: events });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date, location, price, theme } = req.body;

  if (!title || !description || !date || !location || !theme) {
    res.status(400).json({ msg: "Invalid Fields" });
    return;
  }

  const authToken = extractTokenFromAuthorization(req.headers.authorization!);

  try {
    const decodeValue = await admin.auth().verifyIdToken(authToken);
    console.log(decodeValue);
    const userId = decodeValue.uid;

    const user = await userSchema.findOne({
      firebaseUid: userId,
    });

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    const newEvent = new eventSchema({
      title,
      description,
      date,
      location,
      price,
      theme,
      createdBy: user._id,
    });

    await newEvent.save();

    res.status(201).send({ newEvent: newEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);

  if (!_id) {
    return res.status(400).json({ msg: "Invalid event ID format" });
  }

  try {
    const event = await eventSchema.findOne({ _id });

    if (!event) {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    res.status(200).json({ event: event });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const getAllEventByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await userSchema.findOne({ firebaseUid: userId });

    if (!user) {
      res.status(400).json({ msg: "Invalid user id" });
      return;
    }

    const events = await eventSchema.find({ createdBy: user?._id });
    res.status(200).json({ events: events });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);
  console.log(_id);

  const { title, description, date, location, price, theme } = req.body;

  if (!title || !description || !date || !location || !theme) {
    res.status(400).json({ msg: "Invalid Fields" });
    return;
  }
  const authToken = extractTokenFromAuthorization(req.headers.authorization!);

  try {
    const decodeValue = await admin.auth().verifyIdToken(authToken);
    const userId = decodeValue.uid;

    const event = await eventSchema.findById(_id);
    const user = await userSchema.findOne({
      firebaseUid: userId,
    });

    if (!event || !user || user.role !== "staff") {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    const updatedEvent = await eventSchema.findByIdAndUpdate(_id, {
      title,
      description,
      date,
      location,
      price,
      theme,
      createdBy: user._id,
    });

    res.status(200).json({ msg: "Event updated successfully", updatedEvent });
  } catch (error) {
    console.error("Error updating event", error);
    res.status(500).json("Internal Server Error");
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: `Invalid event ID format` });
    return;
  }

  try {
    const deletedEvent = await eventSchema.findByIdAndDelete(id);

    if (!deletedEvent) {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
