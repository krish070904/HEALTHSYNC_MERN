import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, // "symptom" | "medication" | "routineCheck"
  severity: Number,
  message: String,
  status: { type: String, enum: ["pending", "sent", "resolved"], default: "pending" },
  channels: [String], // ["email", "sms", "app"]
}, { timestamps: true });

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
