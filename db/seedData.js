const mongoose = require("mongoose");
const ENV = process.env.NODE_ENV || "development";
const User = require("../models/user-model");
const Event = require("../models/event-model");

const users = require(`./${ENV}-data/users`);
const events = require(`./${ENV}-data/events`);

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

const connectDB = async () => {
  const mongoString = process.env.DATABASE_URL;
  return await mongoose
    .connect(mongoString)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
    });
};

const seedData = async () => {
  await User.deleteMany({})
    .then(() => Event.deleteMany({}))
    .then(() => User.insertMany(users))
    .then((insertedUsers) => {
      console.log("Users seeded successfully");
      const userMap = insertedUsers.reduce((acc, user) => {
        acc[user.firebaseUid] = user._id;
        return acc;
      }, {});

      const updatedEvents = events.map((event) => {
        const userId = userMap[event.createdBy];
        return {
          ...event,
          createdBy: userId,
        };
      });

      return Event.insertMany(updatedEvents);
    })
    .then(() => {
      console.log("Events seeded successfully");
    })
    .catch((error) => {
      console.error("Error seeding data", error);
    });
};

module.exports = {
  connectDB,
  seedData,
};
