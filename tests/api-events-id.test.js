const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { connectDB, seedData } = require("../db/seedData");
const Event = require("../models/event-model");

describe("/api/events/:id", () => {
  beforeAll(async () => {
    await connectDB();
    await seedData();
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let event;

  beforeEach(async () => {
    await Event.findOne().then((foundEvent) => {
      event = foundEvent;
      console.log(event._id.toString());
    });
  });

  test("GET: 200 sends an event object to the client", async () => {
    await request(app)
      .get(`/api/events/${event._id.toString()}`)
      .expect(200)
      .then((response) => {
        expect(response.body.event).toHaveProperty("_id", event._id.toString());
        expect(response.body.event).toHaveProperty("title");
        expect(response.body.event).toHaveProperty("description");
        expect(response.body.event).toHaveProperty("date");
        expect(response.body.event).toHaveProperty("location");
        expect(response.body.event).toHaveProperty("price");
        expect(response.body.event).toHaveProperty("theme");
        expect(response.body.event).toHaveProperty("createdBy");
      });
  });
});
