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
        console.log(response.body.users, "users");
        // expect(response.users.length).toBe(3);
      });
  });
});
