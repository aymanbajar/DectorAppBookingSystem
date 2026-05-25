import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ["user", "doctor"], required: true },
    recipientId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: "" },
    dedupeKey: { type: String, index: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientType: 1, recipientId: 1, dedupeKey: 1 }, { unique: true, sparse: true });

const notificationModel = mongoose.models.notifications || mongoose.model("notifications", notificationSchema);

export default notificationModel;
