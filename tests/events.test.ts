import mongoose from "mongoose";
import app from "../app";
import dotenv from "dotenv";
import { seedData, stopServer } from "./seedTestData";
import request from "supertest";
import userSchema from "../models/userSchema";
import eventSchema from "../models/eventSchema";
import { Event } from "../models/eventSchema";
import supabaseClient from "../config/supabaseConfig";
import { extractTokenFromAuthorization } from "../utils/extractTokenFromAuthorization";
import { mocked } from "jest-mock";
import { User } from "@supabase/supabase-js";

const ENV = process.env.NODE_ENV || "development";

jest.mock("../utils/extractTokenFromAuthorization");
const mockextractTokenFromAuthorization = mocked(
  extractTokenFromAuthorization
).mockReturnValue("");

jest.mock("../config/supabaseConfig");

dotenv.config({
  path: `.env.${ENV}`,
});

type EventTestData = Omit<Event, "createdBy"> & { createdBy: string };

beforeAll(async () => {
  await seedData();
});

afterAll(async () => {
  await stopServer();
});

describe("/api/events", () => {
  beforeEach(async () => {
    const mocksupabaseClient = mocked(
      supabaseClient
    ).auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "user1Uid",
        } as User,
      },
      error: null,
    });
  });

  test("should GET: 200 and sends an array of events to the client", async () => {
    await request(app)
      .get("/api/events")
      .expect(200)
      .then((response) => {
        response.body.events.forEach((event: EventTestData) => {
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.date).toBe("string");
          expect(typeof event.endDate).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.price).toBe("number");
          expect(typeof event.theme).toBe("string");
          expect(typeof event.createdBy).toBe("string");
          expect(typeof event.calendarId).toBe("string");
          expect(typeof event.attendees).toBe("object");
        });
      });
  }, 60000);

  test("should GET: 200 and sends an array of events to the client", async () => {
    await request(app)
      .get("/api/events")
      .expect(200)
      .then((response) => {
        response.body.events.forEach((event: EventTestData) => {
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.date).toBe("string");
          expect(typeof event.endDate).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.price).toBe("number");
          expect(typeof event.theme).toBe("string");
          expect(typeof event.createdBy).toBe("string");
          expect(typeof event.calendarId).toBe("string");
          expect(typeof event.attendees).toBe("object");
        });
      });
  }, 60000);

  test("should GET: 200 and return events with a date after the specified startDate", async () => {
    const startDate = new Date();

    const response = await request(app)
      .get("/api/events")
      .query({ date: startDate.toISOString() })
      .expect(200);
    response.body.events.forEach((event: EventTestData) => {
      const eventDate = new Date(event.date).getTime();
      const startDateTime = startDate.getTime();

      expect(eventDate).toBeGreaterThanOrEqual(startDateTime);
    });
  });

  test("should GET: 200 and return events with the specified theme", async () => {
    const theme = "Community";
    const response = await request(app)
      .get("/api/events")
      .query({ theme })
      .expect(200);

    response.body.events.forEach((event: EventTestData) => {
      expect(event.theme).toBe(theme);
    });
  });

  test("should GET: 200 and return events matching the specified location", async () => {
    const location = "Community Hall";
    const response = await request(app)
      .get("/api/events")
      .query({ location })
      .expect(200);

    response.body.events.forEach((event: EventTestData) => {
      expect(event.location.toLowerCase()).toContain(location.toLowerCase());
    });
  });

  test("should GET: 200 and return free events when priceType is set to 'free'", async () => {
    const priceType = "free";
    const response = await request(app)
      .get("/api/events")
      .query({ priceType })
      .expect(200);

    response.body.events.forEach((event: EventTestData) => {
      expect(event.price).toBe(0);
    });
  });

  test("should GET: 200 and return paid events when priceType is set to 'paid'", async () => {
    const priceType = "paid";
    const response = await request(app)
      .get("/api/events")
      .query({ priceType })
      .expect(200);

    response.body.events.forEach((event: EventTestData) => {
      expect(event.price).toBeGreaterThan(0);
    });
  });

  test("should GET: 200 and return events with titles matching the specified title", async () => {
    const title = "Community Meetup";
    const response = await request(app)
      .get("/api/events")
      .query({ title })
      .expect(200);

    response.body.events.forEach((event: EventTestData) => {
      expect(event.title.toLowerCase()).toContain(title.toLowerCase());
    });
  });

  test("should GET: 200 and return an empty array if no events match the filters", async () => {
    const response = await request(app)
      .get("/api/events")
      .query({ title: "NonExistentEventTitle" })
      .expect(200);

    expect(response.body.events).toEqual([]);
  });

  test("should POST: 201 and inserts a new event to the events collection, and returns the created event", async () => {
    const user = await userSchema.findOne({ uid: "user1Uid" });
    if (!user) {
      throw new Error("User not found");
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);

    const newEvent = {
      title: "Community Meetup",
      description: "A community gathering to discuss local events.",
      date: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: "Community Hall",
      price: 10,
      theme: "Community",
      calendarId: "cal-1234",
      createdBy: user._id.toString(),
    };

    await request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("title", newEvent.title);
        expect(response.body).toHaveProperty(
          "description",
          newEvent.description
        );
        expect(response.body).toHaveProperty("date");
        expect(response.body).toHaveProperty("endDate");
        expect(response.body).toHaveProperty("location", newEvent.location);
        expect(response.body).toHaveProperty("price", newEvent.price);
        expect(response.body).toHaveProperty("theme", newEvent.theme);
        expect(response.body).toHaveProperty("createdBy", user._id.toString());
        expect(response.body).toHaveProperty("calendarId", newEvent.calendarId);
        expect(response.body).toHaveProperty("attendees");
        expect(response.body).toHaveProperty("__v");
      });
  }, 60000);

  test("POST: 400 sends an appropriate status and error message when sending an invalid body", async () => {
    const newEvent = {
      location: "New Event",
    };

    await request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Fields");
      });
  }, 60000);
});

describe("/api/events/:id", () => {
  let eventId: string;
  let userId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      const user = await userSchema.findOne({
        uid: "user4Uid",
      });
      if (!user) {
        throw new Error("User not found");
      }

      userId = user._id;

      const event = new eventSchema({
        title: "Sample Event",
        description: "Description of the sample event",
        date: new Date("2024-07-20T14:00:00Z"),
        location: "Event Location",
        price: 50,
        theme: "Sample Theme",
        createdBy: userId,
      });

      const savedEvent = await event.save();
      eventId = savedEvent._id.toString();
    } catch (error) {
      console.error("Error in beforeAll: ", error);
    }
  }, 60000);

  test("should GET: 200 and sends an event object to the client", async () => {
    const newUser = new userSchema({
      uid: "user8Uid",
      name: "Emily Davis",
      email: "emily.davis1@example.com",
      picture: "https://example.com/emily.jpg",
      role: "staff",
    });

    const savedUser = await newUser.save();

    const newEvent = new eventSchema({
      title: "Art Workshop",
      description: "Learn to paint with watercolors. Supplies provided.",
      date: new Date("2024-07-20T14:00:00Z"),
      location: "Art Studio, Building B",
      price: 25,
      theme: "Arts & Crafts",
      createdBy: savedUser._id,
    });

    const savedEvent = await newEvent.save();
    const createdEventId = savedEvent._id.toString();

    await request(app)
      .get(`/api/events/${createdEventId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.event).toHaveProperty("_id", createdEventId);
        expect(response.body.event).toHaveProperty("title");
        expect(response.body.event).toHaveProperty("description");
        expect(response.body.event).toHaveProperty("date");
        expect(response.body.event).toHaveProperty("location");
        expect(response.body.event).toHaveProperty("price");
        expect(response.body.event).toHaveProperty("theme");
        expect(response.body.event).toHaveProperty("createdBy");
      });
  }, 60000);

  test("should GET: 404 when querying a non-existent event ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .get(`/api/events/${nonExistentId}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Event not found");
      });
  }, 60000);

  test("should GET: 400 when providing an invalid event ID format", async () => {
    await request(app)
      .get(`/api/events/invalidEventId`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid event ID format");
      });
  }, 60000);

  test("should PUT: 200 and update the event details", async () => {
    let eventId: string | undefined;

    try {
      const event = await eventSchema.findOne({
        title: "Existing Event Title",
      });
      if (event) {
        eventId = event._id.toString();
      }
    } catch (error) {
      console.error("Error fetching event", error);
    }

    if (eventId) {
      const updateFields = {
        title: "Updated Event Title",
        description: "Updated Event Description",
      };

      await request(app)
        .put(`/api/events/${eventId}`)
        .send(updateFields)
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toBe("Event updated successfully");
          expect(response.body.event.title).toBe("Updated Event Title");
          expect(response.body.event.description).toBe(
            "Updated Event Description"
          );
        });
    }
  }, 60000);

  test("should PUT: 400 and return an error for invalid update data", async () => {
    let eventId: string | undefined;

    try {
      const event = await eventSchema.findOne({
        title: "Existing Event Title",
      });
      if (event) {
        eventId = event._id.toString();
      }
    } catch (error) {
      console.error("Error fetching event", error);
    }

    if (eventId) {
      await request(app)
        .put(`/api/events/${eventId}`)
        .send({ invalidField: "Invalid Data" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid update data");
        });
    }
  }, 60000);

  test("should DELETE: 200 and remove the event from the database", async () => {
    await request(app)
      .delete(`/api/events/${eventId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("Event deleted successfully");
      });

    const deletedEvent = await eventSchema.findById({ _id: eventId });
    expect(deletedEvent).toBeNull();
  }, 60000);

  test("should DELETE: 404 and return appropriate error message when event id does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/events/${nonExistentId}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Event not found");
      });
  }, 60000);

  test("should DELETE: 404 and return appropriate error message when not valid event id", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/events/notValidId`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid event ID format");
      });
  }, 60000);
});

describe("/api/events/user/:userId", () => {
  test("should GET: 200 and return events for a valid user ID", async () => {
    let userId: string | undefined;
    try {
      const user = await userSchema.findOne({
        email: "emily.davis@example.com",
      });
      if (user) {
        userId = user.uid;
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }

    if (userId) {
      await request(app)
        .get(`/api/events/user/${userId}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.events)).toBe(true);
          response.body.events.forEach((event: any) => {
            expect(event).toHaveProperty("_id");
            expect(event).toHaveProperty("title");
            expect(event).toHaveProperty("description");
            expect(event).toHaveProperty("date");
            expect(event).toHaveProperty("createdBy");
          });
        });
    }
  }, 60000);

  test("should GET: 400 and send an error message for an invalid user ID", async () => {
    await request(app)
      .get("/api/events/user/invalidUserId")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid user id");
      });
  }, 60000);

  test("should GET: 200 and return an empty array if no events found for valid user ID", async () => {
    let newUserId: string | undefined;

    try {
      const newUser = new userSchema({
        uid: "testUidNoEvents",
        name: "Test User No Events",
        email: "test.noevents@example.com",
        picture: "https://example.com/test.jpg",
        role: "member",
      });
      const savedUser = await newUser.save();
      newUserId = savedUser.uid;
    } catch (error) {
      console.error("Error creating user", error);
    }
    if (newUserId) {
      await request(app)
        .get(`/api/events/user/${newUserId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.events).toEqual([]);
        });
    }
  }, 60000);
});
