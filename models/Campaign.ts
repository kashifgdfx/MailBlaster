// models/Campaign.ts

import mongoose, { Schema, model } from "mongoose";

const CampaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    senderEmail: {
      type: String,
      required: true,
    },

    targetSegment: {
      type: String,
      default: "all",
    },

    content: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "queued", "sending", "sent", "failed"],
      default: "draft",
    },

    totalRecipients: {
      type: Number,
      default: 0,
    },

    sentCount: {
      type: Number,
      default: 0,
    },

    bounceCount: {
      type: Number,
      default: 0,
    },

    openCount: {
      type: Number,
      default: 0,
    },

    lastProcessed: {
      type: Number,
      default: 0,
    },

    queuedAt: {
      type: Date,
      default: null,
    },

    sentAt: {
      type: Date,
      default: null,
    },

    failedEmails: [
      {
        email: String,
        reason: String,
        date: Date,
      },
    ],

    processedBounceIds: {
      type: [String],
      default: [],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Campaign) {
  delete mongoose.models.Campaign;
}

const CampaignModel = model("Campaign", CampaignSchema);

if (!CampaignModel.schema.path("isDeleted")) {
  CampaignModel.schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });
}

export default CampaignModel;