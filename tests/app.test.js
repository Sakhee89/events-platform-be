const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { connectDB, seedData } = require("../db/seedData");
const User = require("../models/user-model");

beforeAll(async () => {
  await connectDB();
  await seedData();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/api/users", () => {
  test("GET: 200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(typeof user.name).toBe("string");
          expect(typeof user.email).toBe("string");
          expect(typeof user.picture).toBe("string");
          expect(typeof user.role).toBe("string");
        });
      });
  });

  test("POST: 201 inserts a new user to the users collection, and returns the created user", () => {
    const newUser = {
      firebaseUid: "testFirebaseUid",
      name: "Test User",
      email: "test.user@example.com",
      picture: "https://example.com/test.jpg",
      role: "member",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then((response) => {
        expect(response.body.user).toHaveProperty("_id");
        expect(response.body.user).toHaveProperty(
          "firebaseUid",
          newUser.firebaseUid
        );
        expect(response.body.user).toHaveProperty("name", newUser.name);
        expect(response.body.user).toHaveProperty("email", newUser.email);
        expect(response.body.user).toHaveProperty("picture", newUser.picture);
        expect(response.body.user).toHaveProperty("role", newUser.role);
        expect(response.body.user).toHaveProperty("__v");
      });
  });

  test("POST: 400 sends an appropriate status and error message when sending an invalid body", () => {
    const newUser = {
      name: "Test User",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Fields");
      });
  });
});

describe("api/events", () => {
  let createdUserId;

  beforeAll(async () => {
    const user = await User.findOne({ firebaseUid: "user1FirebaseUid" });
    createdUserId = user._id;
  });

  test("GET: 200 sends an array of events to the client", () => {
    return request(app)
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

  test("Post: 201 inserts a new event to the events collection, and returns the created event", () => {
    const newEvent = {
      title: "Community Meetup",
      description: "A community gathering to discuss local events.",
      date: new Date(),
      location: "Community Hall",
      price: 10,
      theme: "Community",
      createdBy: createdUserId,
    };

    return request(app)
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

  test("POST: 400 sends an appropriate status and error message when sending an invalid body", () => {
    const newEvent = {
      location: "New Event",
    };

    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Fields");
      });
  });
});
