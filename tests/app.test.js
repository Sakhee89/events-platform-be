const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { connectDB, seedData } = require("../db/seedData");

beforeAll(async () => {
  await connectDB();
  await seedData();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/", () => {
  test("Get: /", () => {
    return request(app)
      .get("/")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("Hello World!");
      });
  });
});

describe("/api/users", () => {
  test("Get: 200 sends an array of users to the client", () => {
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

  test("Post: 201 inserts a new user to the users collection, and returns the created user", () => {
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

  test("Post: 400 sends an appropriate status and error message when sending an invalid body", () => {
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
