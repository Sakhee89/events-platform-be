import mongoose, { ObjectId } from "mongoose";

export type Event = {
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  theme: string;
  createdBy: ObjectId;
};

const eventSchema = new mongoose.Schema<Event>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, default: 0 },
  theme: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Event", eventSchema);
