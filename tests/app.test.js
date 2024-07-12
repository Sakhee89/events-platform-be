const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config({
  path: `${__dirname}/../.env.development`,
});

beforeEach(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
});

afterEach(async () => {
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
