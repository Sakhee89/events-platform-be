import mongoose from "mongoose";
import eventSchema from "../models/eventSchema";
import userSchema from "../models/userSchema";
import signupSchema from "../models/signupSchema";
import events from "./events";
import users from "./users";
import signups from "./signups";

export const seedData = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    console.log("Existing data cleared");

    const insertedUsers = await userSchema.insertMany(users);

    console.log("Users seeded successfully");

    const userMap = insertedUsers.reduce(
      (acc: Record<string, string>, user) => {
        acc[user.firebaseUid] = user._id.toString();
        return acc;
      },
      {}
    );

    const updatedEvents = events.map((event) => {
      const userId = userMap[event.createdBy];
      return {
        ...event,
        createdBy: userId,
      };
    });
    const insertedEvents = await eventSchema.insertMany(updatedEvents);
    console.log("Events seeded successfully");

    const eventMap = insertedEvents.reduce(
      (acc: Record<string, string>, event) => {
        const uniqueKey = `${event.title}-${event.date.toISOString()}`;
        acc[uniqueKey] = event._id.toString();
        return acc;
      },
      {}
    );

    const mappedSignups = signups.map((signup) => {
      const uniqueKey = `${signup.event.title}-${new Date(
        signup.event.date
      ).toISOString()}`;
      return {
        user: userMap[signup.user],
        event: eventMap[uniqueKey],
      };
    });

    await signupSchema.insertMany(mappedSignups);
    console.log("Signups seeded successfully");
  } catch (error) {
    console.error("Error seeding data", error);
  }
};
