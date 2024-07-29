import eventSchema from "../models/eventSchema";
import userSchema from "../models/userSchema";
import events from "./events";
import users from "./users";

export const seedData = async () => {
  try {
    await userSchema.deleteMany({});
    await eventSchema.deleteMany({});
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

    await eventSchema.insertMany(updatedEvents);

    console.log("Events seeded successfully");
  } catch (error) {
    console.error("Error seeding data", error);
  }
};
