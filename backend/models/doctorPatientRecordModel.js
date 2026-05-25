import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    medicine: { type: String, default: "" },
    dosage: { type: String, default: "" },
    duration: { type: String, default: "" },
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const patientFileSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    dueDate: { type: String, default: "" },
    done: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const labRequestSchema = new mongoose.Schema(
  {
    testName: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, default: "requested" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const doctorPatientRecordSchema = new mongoose.Schema(
  {
    docId: { type: String, required: true },
    userId: { type: String, required: true },
    privateNotes: { type: String, default: "" },
    followUpStatus: { type: String, default: "normal" },
    riskLevel: { type: String, default: "low" },
    followUpDate: { type: String, default: "" },
    tags: { type: [String], default: [] },
    treatmentPlan: {
      goals: { type: String, default: "" },
      instructions: { type: String, default: "" },
      status: { type: String, default: "active" },
      nextReviewDate: { type: String, default: "" },
    },
    tasks: { type: [taskSchema], default: [] },
    labRequests: { type: [labRequestSchema], default: [] },
    prescriptions: { type: [prescriptionSchema], default: [] },
    files: { type: [patientFileSchema], default: [] },
  },
  { timestamps: true }
);

doctorPatientRecordSchema.index({ docId: 1, userId: 1 }, { unique: true });

const doctorPatientRecordModel = mongoose.model("doctorPatientRecord", doctorPatientRecordSchema);

export default doctorPatientRecordModel;
