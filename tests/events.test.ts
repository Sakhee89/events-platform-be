import mongoose from "mongoose";
import app from "../app";
import dotenv from "dotenv";
import { seedData } from "./seedTestData";
import request from "supertest";
import userSchema from "../models/userSchema";
import eventSchema from "../models/eventSchema";
import { Event } from "../models/eventSchema";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${ENV}`,
});

type EventTestData = Omit<Event, "createdBy"> & { createdBy: string };

describe("/api/events", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  }, 60000);

  beforeEach(async () => {
    await seedData();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  }, 60000);

  test("should GET: 200 and sends an array of events to the client", async () => {
    await request(app)
      .get("/api/events")
      .expect(200)
      .then((response) => {
        expect(response.body.events.length).toBe(5);
        response.body.events.forEach((event: EventTestData) => {
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.startDate).toBe("string");
          expect(typeof event.endDate).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.price).toBe("number");
          expect(typeof event.theme).toBe("string");
          expect(typeof event.createdBy).toBe("string");
        });
      });
  }, 60000);

  test("should POST: 201 and inserts a new event to the events collection, and returns the created event", async () => {
    const user = await userSchema.findOne({ firebaseUid: "user1FirebaseUid" });
    if (!user) {
      throw new Error("User not found");
    }

    const newEvent = {
      title: "Community Meetup",
      description: "A community gathering to discuss local events.",
      date: new Date(),
      location: "Community Hall",
      price: 10,
      theme: "Community",
      createdBy: user._id.toString(),
    };

    await request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(201)
      .then((response) => {
        expect(response.body.newEvent).toHaveProperty("_id");
        expect(response.body.newEvent).toHaveProperty("title", newEvent.title);
        expect(response.body.newEvent).toHaveProperty(
          "description",
          newEvent.description
        );
        expect(response.body.newEvent).toHaveProperty("date");
        expect(response.body.newEvent).toHaveProperty(
          "location",
          newEvent.location
        );
        expect(response.body.newEvent).toHaveProperty("price", newEvent.price);
        expect(response.body.newEvent).toHaveProperty("theme", newEvent.theme);
        expect(response.body.newEvent).toHaveProperty(
          "createdBy",
          user._id.toString()
        );
        expect(response.body.newEvent).toHaveProperty("__v");
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

  test("POST: 404 sends an appropriate status and error message when sending an invalid body", async () => {
    const newEvent = {
      title: "Community Meetup",
      description: "A community gathering to discuss local events.",
      date: new Date(),
      location: "Community Hall",
      price: 10,
      theme: "Community",
      createdBy: new mongoose.Types.ObjectId(),
    };

    await request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found");
      });
  }, 60000);
});

describe("/api/events/:id", () => {
  let eventId: string;
  let userId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL!);
      await seedData();

      const user = await userSchema.findOne({
        firebaseUid: "user4FirebaseUid",
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

  afterAll(async () => {
    try {
      // await eventSchema.deleteMany({});
      // await userSchema.deleteMany({});
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error in afterAll: ", error);
    }
  }, 60000);

  test("should GET: 200 and sends an event object to the client", async () => {
    const newUser = new userSchema({
      firebaseUid: "user6FirebaseUid",
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
});

describe("/api/events/user/:userId", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  }, 60000);

  beforeEach(async () => {
    await seedData();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  }, 60000);

  test("should GET: 200 and return events for a valid user ID", async () => {
    let userId: string | undefined;
    try {
      const user = await userSchema.findOne({
        email: "emily.davis@example.com",
      });
      if (user) {
        userId = user.firebaseUid;
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
        firebaseUid: "testFirebaseUidNoEvents",
        name: "Test User No Events",
        email: "test.noevents@example.com",
        picture: "https://example.com/test.jpg",
        role: "member",
      });
      const savedUser = await newUser.save();
      newUserId = savedUser.firebaseUid;
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

  test("should PATCH: 200 and update the event details", async () => {
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
        .patch(`/api/events/${eventId}`)
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

  test("should PATCH: 404 and return an error for non-existent event", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .patch(`/api/events/${nonExistentId}`)
      .send({ title: "Updated Title" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Event not found");
      });
  }, 60000);

  test("should PATCH: 400 and return an error for invalid update data", async () => {
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
        .patch(`/api/events/${eventId}`)
        .send({ invalidField: "Invalid Data" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid update data");
        });
    }
  }, 60000);
});
