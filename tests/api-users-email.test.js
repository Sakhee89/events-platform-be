const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { connectDB, seedData } = require("../db/seedData");

describe("/api/users/:email", () => {
  beforeAll(async () => {
    await connectDB();
    await seedData();
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET: 200 sends a user object to the client", async () => {
    await request(app)
      .get("/api/users/emily.davis@example.com")
      .expect(200)
      .then((response) => {
        expect(response.body.user).toHaveProperty("_id");
        expect(response.body.user).toHaveProperty("firebaseUid");
        expect(response.body.user).toHaveProperty("name");
        expect(response.body.user).toHaveProperty("email");
        expect(response.body.user).toHaveProperty("picture");
        expect(response.body.user).toHaveProperty("role");
      });
  });

  test("GET: 400 sends an appropriate status and error message when given an invalid email", async () => {
    await request(app)
      .get("/api/users/invalidEmail")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid email format");
      });
  });

  test("GET: 404 sends an appropriate status and error message when user email is not found", async () => {
    await request(app)
      .get("/api/users/no.email@example.com")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found");
      });
  });
});
