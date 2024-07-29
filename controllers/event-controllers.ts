import { Request, Response } from "express";
import eventSchema, { Event } from "../models/eventSchema";
import mongoose from "mongoose";
import userSchema from "../models/userSchema";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventSchema.find<Event>();

    res.status(200).send({ events: events });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date, location, price, theme, createdBy } =
    req.body;

  if (!title || !description || !date || !location || !theme || !createdBy) {
    res.status(400).json({ msg: "Invalid Fields" });
    return;
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(createdBy as string);
    const user = await userSchema.findById(userObjectId);

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
      createdBy: userObjectId,
    });

    await newEvent.save();

    res.status(201).send({ newEvent: newEvent });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid event ID format" });
  }

  try {
    const _id = new mongoose.Types.ObjectId(id);
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
  const updateFields = req.body;

  try {
    const event = await eventSchema.findById(id);

    if (!event) {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    Object.keys(updateFields).forEach((key) => {
      (event as any)[key] = updateFields[key];
    });

    await event.save();

    res.status(200).json({ msg: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event", error);
    res.status(500).json({ msg: "Internal Server Error" });
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
