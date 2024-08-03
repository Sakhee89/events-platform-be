import { Request, Response } from "express";
import eventSchema, { Event } from "../models/eventSchema";
import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import { extractTokenFromAuthorization } from "../utils/extractTokenFromAuthorization";
import supabaseClient from "../config/supabaseConfig";

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
  const {
    title,
    description,
    date,
    location,
    price,
    theme,
    endDate,
    calendarId,
    eventId,
    attendees,
  } = req.body;

  if (!title || !description || !date || !location || !theme) {
    res.status(400).json({ msg: "Invalid Fields" });
    return;
  }

  const authToken = extractTokenFromAuthorization(req.headers.authorization!);
  console.log("authToken", authToken);

  try {
    const decodeValue = await supabaseClient.auth.getUser(authToken);
    console.log("decodeValue", decodeValue);
    const userId = decodeValue.data.user?.id;

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
      endDate,
      calendarId,
      eventId,
      attendees,
    });

    await newEvent.save();

    res.status(201).send(newEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const event = await eventSchema.findOne({ _id });

    if (!_id) {
      return res.status(400).json({ msg: "Invalid event ID format" });
    }

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
  console.log("updateEvent");
  const { id } = req.params;

  const {
    title,
    description,
    date,
    location,
    price,
    theme,
    endDate,
    calendarId,
    eventId,
  } = req.body;

  if (!title || !description || !date || !location || !theme) {
    res.status(400).json({ msg: "Invalid Fields" });
    return;
  }
  const authToken = extractTokenFromAuthorization(req.headers.authorization!);

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      firebaseUid: userId,
    });

    console.log("user", user);

    if (!user || user.role !== "staff") {
      res.status(403).json({ msg: "User is not authorised" });
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
      endDate,
      calendarId,
      eventId,
    });

    console.log("updatedEvent", updatedEvent);

    res.status(201).send(updatedEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const _id = mongoose.Types.ObjectId.isValid(id);

    if (!_id) {
      res.status(400).json({ msg: `Invalid event ID format` });
      return;
    }
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

export const addAttendeeEvent = async (req: Request, res: Response) => {
  console.log("addAttendeeEvent");
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ msg: "eventId cannot be empty" });
    return;
  }
  const authToken = extractTokenFromAuthorization(req.headers.authorization!);

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      firebaseUid: userId,
    });

    console.log("user", user);

    if (!user) {
      res.status(403).json({ msg: "User is not authorised" });
      return;
    }

    const existingEvent = await eventSchema.findOne(_id);

    console.log("existingEvent", existingEvent);

    if (existingEvent?.attendees.includes(user.email)) {
      res.status(201).send(existingEvent);
      return;
    }
    const updatedEvent = await eventSchema.findByIdAndUpdate(_id, {
      attendees: [...(existingEvent?.attendees || []), user.email],
    });

    console.log("updatedEvent", updatedEvent);

    res.status(201).send(updatedEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
