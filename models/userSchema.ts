import mongoose from "mongoose";

export interface User {
  firebaseUid: string;
  name: string;
  email: string;
  picture: string;
  role: string;
}

const userSchema = new mongoose.Schema<User>({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  role: { type: String, enum: ["staff", "member", "admin"], default: "member" },
});

export default mongoose.model("User", userSchema);
