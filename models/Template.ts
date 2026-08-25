import mongoose, { Schema, models, model } from "mongoose";

const TemplateSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Template || model("Template", TemplateSchema);
