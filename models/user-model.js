const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  role: { type: String, enum: ["staff", "member"], required: true },
});

module.exports = mongoose.model("User", userSchema);
