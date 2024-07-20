const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { connectDB, seedData } = require("../db/seedData");
const User = require("../models/user-model");

describe("api/events", () => {
  let createdUserId;

  beforeAll(async () => {
    await connectDB();
    await seedData();
    await User.findOne({ firebaseUid: "user1FirebaseUid" }).then((user) => {
      createdUserId = user._id;
    });
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET: 200 sends an array of events to the client", async () => {
    await request(app)
      .get("/api/events")
      .expect(200)
      .then((response) => {
        expect(response.body.events.length).toBe(5);
        response.body.events.forEach((event) => {
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.date).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.price).toBe("number");
          expect(typeof event.theme).toBe("string");
          expect(typeof event.createdBy).toBe("string");
        });
      });
  });

  test("Post: 201 inserts a new event to the events collection, and returns the created event", async () => {
    const newEvent = {
      title: "Community Meetup",
      description: "A community gathering to discuss local events.",
      date: new Date(),
      location: "Community Hall",
      price: 10,
      theme: "Community",
      createdBy: createdUserId,
    };

    await request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(201)
      .then((response) => {
        expect(response.body.event).toHaveProperty("_id");
        expect(response.body.event).toHaveProperty("title", newEvent.title);
        expect(response.body.event).toHaveProperty(
          "description",
          newEvent.description
        );
        expect(response.body.event).toHaveProperty("date");
        expect(response.body.event).toHaveProperty(
          "location",
          newEvent.location
        );
        expect(response.body.event).toHaveProperty("price", newEvent.price);
        expect(response.body.event).toHaveProperty("theme", newEvent.theme);
        expect(response.body.event).toHaveProperty(
          "createdBy",
          createdUserId.toString()
        );
        expect(response.body.event).toHaveProperty("__v");
      });
  });

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
  });

  test("POST: 404 sends an appropriate status and error message when sending a body when user does not exist", async () => {
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
  });
});
