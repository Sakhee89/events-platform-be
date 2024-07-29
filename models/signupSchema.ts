import mongoose, { ObjectId } from "mongoose";

export type Signup = {
  user: ObjectId;
  event: ObjectId;
};

const signupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
});

export default mongoose.model("Signup", signupSchema);
