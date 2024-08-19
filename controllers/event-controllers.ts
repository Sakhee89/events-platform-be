import { Request, Response } from "express";
import eventSchema, { Event } from "../models/eventSchema";
import mongoose, { SortOrder } from "mongoose";
import userSchema from "../models/userSchema";
import { extractTokenFromAuthorization } from "../utils/extractTokenFromAuthorization";
import supabaseClient from "../config/supabaseConfig";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const {
      date,
      location,
      theme,
      priceType,
      title,
      page = 1,
      limit = 10,
      sortOrder = "newest",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ msg: "Invalid page number" });
    }
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ msg: "Invalid limit number" });
    }

    const filter: Record<string, any> = {};

    if (theme) filter.theme = theme;
    if (date) filter.date = { $gte: new Date(date as string) };
    if (location) filter.location = new RegExp(location as string, "i");
    if (title) filter.title = new RegExp(title as string, "i");
    if (priceType) {
      if (priceType === "free") {
        filter.price = 0;
      } else if (priceType === "paid") {
        filter.price = { $gt: 0 };
      }
    }

    const sortOption: Record<string, SortOrder> =
      sortOrder === "oldest" ? { date: 1 } : { date: -1 };

    const events = await eventSchema
      .find<Event>(filter)
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

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

  try {
    const authToken = extractTokenFromAuthorization(req.headers.authorization!);
    const decodeValue = await supabaseClient.auth.getUser(authToken);

    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      uid: userId,
    });

    if (!user || user.role !== "staff") {
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

    const savedEvent = await newEvent.save();

    res.status(201).send(savedEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export const updateEvent = async (req: Request, res: Response) => {
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

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid event ID format" });
    }

    const _id = new mongoose.Types.ObjectId(id);
    const authToken = extractTokenFromAuthorization(req.headers.authorization!);

    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      uid: userId,
    });

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

    res.status(201).send(updatedEvent);
  } catch (error) {
    console.log(error);
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
    const user = await userSchema.findOne({ uid: userId });

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

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const _id = mongoose.Types.ObjectId.isValid(id);

    if (!_id) {
      res.status(400).json({ msg: `Invalid event ID format` });
      return;
    }

    const authToken = extractTokenFromAuthorization(req.headers.authorization!);

    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      uid: userId,
    });

    if (!user || user.role !== "staff") {
      res.status(403).json({ msg: "User is not authorised" });
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
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ msg: "eventId cannot be empty" });
    return;
  }

  try {
    const authToken = extractTokenFromAuthorization(req.headers.authorization!);
    const _id = new mongoose.Types.ObjectId(id);
    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      uid: userId,
    });

    if (!user) {
      res.status(403).json({ msg: "User is not authorised" });
      return;
    }

    const existingEvent = await eventSchema.findOne(_id);

    if (existingEvent?.attendees.includes(user.email)) {
      res.status(201).send(existingEvent);
      return;
    }
    const updatedEvent = await eventSchema.findByIdAndUpdate(_id, {
      attendees: [...(existingEvent?.attendees || []), user.email],
    });

    res.status(201).send(updatedEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export const getAllEventsWithAttendee = async (req: Request, res: Response) => {
  try {
    const authToken = extractTokenFromAuthorization(req.headers.authorization!);
    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const existingUser = await userSchema.findOne({ uid: userId });

    if (!existingUser) {
      res.status(404).json({ msg: "User id is invalid" });
      return;
    }

    const events = await eventSchema.find({
      attendees: existingUser.email,
      date: {
        $gte: new Date(),
      },
    });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
