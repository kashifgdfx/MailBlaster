import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    companyName: String,
    companyEmail: String,
    senderName: String,
    senderEmail: String,
    replyTo: String,
    logo: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);