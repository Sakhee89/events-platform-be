const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { connectDB, seedData } = require("../db/seedData");

describe("/api/users", () => {
  beforeAll(async () => {
    await connectDB();
    await seedData();
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET: 200 sends an array of users to the client", async () => {
    await request(app)
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

  test("POST: 201 inserts a new user to the users collection, and returns the created user", async () => {
    const newUser = {
      firebaseUid: "testFirebaseUid",
      name: "Test User",
      email: "test.user@example.com",
      picture: "https://example.com/test.jpg",
      role: "member",
    };

    await request(app)
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

  test("POST: 400 sends an appropriate status and error message when sending an invalid body", async () => {
    const newUser = {
      name: "Test User",
    };

    await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Fields");
      });
  });
});
