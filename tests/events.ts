import { Event } from "../models/eventSchema";

type EventTestData = Omit<Event, "createdBy"> & { createdBy: string };

const events: EventTestData[] = [
  {
    title: "Community Yoga Class",
    description: "A relaxing yoga session for all levels. Bring your own mat!",
    date: new Date("2024-07-10T10:00:00Z"),
    location: "Community Center, Room 1",
    price: 10,
    theme: "Health & Wellness",
    createdBy: "user1FirebaseUid",
    attendees: [],
  },
  {
    title: "Book Club Meeting",
    description: "Discussing the latest best-seller. All are welcome!",
    date: new Date("2024-07-15T18:00:00Z"),
    location: "Library, Conference Room",
    price: 0,
    theme: "Literature",
    createdBy: "user2FirebaseUid",
    attendees: [],
  },
  {
    title: "Art Workshop",
    description: "Learn to paint with watercolors. Supplies provided.",
    date: new Date("2024-07-20T14:00:00Z"),
    location: "Art Studio, Building B",
    price: 25,
    theme: "Arts & Crafts",
    createdBy: "user1FirebaseUid",
    attendees: [],
  },
  {
    title: "Cooking Class",
    description: "Master the basics of Italian cuisine.",
    date: new Date("2024-07-22T16:00:00Z"),
    location: "Community Kitchen",
    price: 30,
    theme: "Food & Drink",
    createdBy: "user3FirebaseUid",
    attendees: [],
  },
  {
    title: "Running Club",
    description: "Join us for a morning run through the park.",
    date: new Date("2024-07-25T07:00:00Z"),
    location: "City Park, Main Entrance",
    price: 0,
    theme: "Sports & Fitness",
    createdBy: "user4FirebaseUid",
    attendees: [],
  },
  {
    title: "Photography Workshop",
    description: "Learn the art of photography with practical sessions.",
    date: new Date("2024-08-05T10:00:00Z"),
    location: "Studio A",
    price: 40,
    theme: "Arts & Crafts",
    createdBy: "user5FirebaseUid",
    attendees: [],
  },
  {
    title: "Chess Tournament",
    description: "Challenge your skills in a chess tournament.",
    date: new Date("2024-08-12T09:00:00Z"),
    location: "Community Hall",
    price: 15,
    theme: "Games & Competitions",
    createdBy: "user6FirebaseUid",
    attendees: [],
  },
];

export default events;
