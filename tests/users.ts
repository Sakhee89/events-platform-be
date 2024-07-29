import { User } from "../models/userSchema";

const users: User[] = [
  {
    firebaseUid: "user1FirebaseUid",
    name: "John Doe",
    email: "john.doe@example.com",
    picture: "https://example.com/john.jpg",
    role: "staff",
  },
  {
    firebaseUid: "user2FirebaseUid",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    picture: "https://example.com/jane.jpg",
    role: "member",
  },
  {
    firebaseUid: "user3FirebaseUid",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    picture: "https://example.com/mike.jpg",
    role: "member",
  },
  {
    firebaseUid: "user4FirebaseUid",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    picture: "https://example.com/emily.jpg",
    role: "staff",
  },
];

export default users;
