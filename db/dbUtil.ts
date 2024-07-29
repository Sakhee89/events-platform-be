import dotenv from "dotenv";
import mongoose from "mongoose";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${ENV}`,
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

export const connectToDatabase = async () => {
  const mongoDBURI = process.env.DATABASE_URL;

  if (!mongoDBURI) {
    throw new Error("mongoDB uri is missing");
  }

  try {
    await mongoose.connect(mongoDBURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
