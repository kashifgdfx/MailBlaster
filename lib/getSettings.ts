import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function getSettings() {
  await connectDB();
  return await Settings.findOne().lean();
}
