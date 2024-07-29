import app from "../app";
import dotenv from "dotenv";
import { seedData } from "./seedTestData";
import request from "supertest";
import userSchema, { User } from "../models/userSchema";
import mongoose from "mongoose";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${ENV}`,
});

describe("/api/users", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  }, 30000);

  beforeEach(async () => {
    await seedData();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  }, 30000);

  test("should GET: 200 and sends an array of users to the client", async () => {
    await request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user: User) => {
          expect(typeof user.name).toBe("string");
          expect(typeof user.email).toBe("string");
          expect(typeof user.picture).toBe("string");
          expect(typeof user.role).toBe("string");
        });
      });
  }, 30000);

  test("should POST: 201 and inserts a new user to the users collection, and returns the created user", async () => {
    const newUser = {
      firebaseUid: "testFirebaseUid",
      name: "Test User",
      email: "test.user@example.com",
      picture: "https://example.com/test.jpg",
      role: "member",
    };

    await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then((response) => {
        expect(response.body.newUser).toEqual({
          ...newUser,
          __v: expect.any(Number),
          _id: expect.any(String),
        });
      });
  }, 30000);

  test("should POST: 400 and sends an appropriate status and error message when sending an invalid body", async () => {
    const newUser = {
      name: "Test User",
      email: "test.user@example.com",
      picture: "https://example.com/test.jpg",
    };

    await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid fields");
      });
  }, 30000);
});

describe("/api/users/:id", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  }, 30000);

  beforeEach(async () => {
    await seedData();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  }, 30000);

  test("should GET: 200 and sends a user object to the client", async () => {
    await request(app)
      .get(`/api/users/user4FirebaseUid`)
      .expect(200)
      .then((response) => {
        expect(response.body.user).toHaveProperty("_id");
        expect(response.body.user).toHaveProperty("firebaseUid");
        expect(response.body.user).toHaveProperty("name");
        expect(response.body.user).toHaveProperty("email");
        expect(response.body.user).toHaveProperty("picture");
        expect(response.body.user).toHaveProperty("role");
      });
  }, 30000);

  test("GET: 404 sends an appropriate status and error message when user ID is not found", async () => {
    await request(app)
      .get(`/api/users/nonexistentFirebaseUid`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found");
      });
  }, 30000);

  test("should PATCH: 200 and update the user's role", async () => {
    let userId: string | undefined;

    try {
      const user = await userSchema.findOne({
        email: "emily.davis@example.com",
      });
      if (user) {
        userId = user.firebaseUid;
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }

    if (userId) {
      await request(app)
        .patch(`/api/users/${userId}`)
        .send({ role: "staff" })
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toBe("Role updated successfully");
          expect(response.body.user.role).toBe("staff");
        });
    }
  }, 30000);

  test("should PATCH: 400 and return an error for invalid role", async () => {
    let userId: string | undefined;

    try {
      const user = await userSchema.findOne({
        email: "emily.davis@example.com",
      });
      if (user) {
        userId = user.firebaseUid;
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }

    if (userId) {
      await request(app)
        .patch(`/api/users/${userId}`)
        .send({ role: "invalidRole" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid role");
        });
    }
  }, 30000);

  test("should PATCH: 404 and return an error for non-existent user", async () => {
    await request(app)
      .patch("/api/users/nonExistentUserId")
      .send({ role: "staff" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found");
      });
  }, 30000);
});
