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
