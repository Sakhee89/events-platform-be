import { User } from "../models/userSchema";

const users: User[] = [
  {
    uid: "user1Uid",
    name: "John Doe",
    email: "john.doe@example.com",
    picture: "https://example.com/john.jpg",
    role: "staff",
  },
  {
    uid: "user2Uid",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    picture: "https://example.com/jane.jpg",
    role: "member",
  },
  {
    uid: "user3Uid",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    picture: "https://example.com/mike.jpg",
    role: "member",
  },
  {
    uid: "user4Uid",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    picture: "https://example.com/emily.jpg",
    role: "staff",
  },
  {
    uid: "user5Uid",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    picture: "https://example.com/sarah.jpg",
    role: "member",
  },
  {
    uid: "user6Uid",
    name: "Tom White",
    email: "tom.white@example.com",
    picture: "https://example.com/tom.jpg",
    role: "member",
  },
];

export default users;
