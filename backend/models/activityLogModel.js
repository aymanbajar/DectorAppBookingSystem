import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: String, default: "admin" },
    action: { type: String, required: true },
    targetType: { type: String, default: "" },
    targetId: { type: String, default: "" },
    details: { type: Object, default: {} },
  },
  { timestamps: true }
);

const activityLogModel = mongoose.models.activityLogs || mongoose.model("activityLogs", activityLogSchema);

export default activityLogModel;
