type EventReference = {
  title: string;
  date: string;
};

type Signup = {
  user: string; //
  event: EventReference;
};

const signups: Signup[] = [
  {
    user: "user1FirebaseUid",
    event: { title: "Community Yoga Class", date: "2024-07-10T10:00:00Z" },
  },
  {
    user: "user2FirebaseUid",
    event: { title: "Book Club Meeting", date: "2024-07-15T18:00:00Z" },
  },
  {
    user: "user3FirebaseUid",
    event: { title: "Art Workshop", date: "2024-07-20T14:00:00Z" },
  },
];

export default signups;
