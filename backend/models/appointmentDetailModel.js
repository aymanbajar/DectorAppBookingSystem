import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    medicine: { type: String, default: "" },
    dosage: { type: String, default: "" },
    duration: { type: String, default: "" },
    notes: { type: String, default: "" },
    instructions: { type: String, default: "" },
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

const fileSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    fileType: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const appointmentDetailSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    visitReason: { type: String, default: "" },
    healthRecord: { type: Object, default: {} },
    followUpStatus: { type: String, default: "normal" },
    followUpDate: { type: String, default: "" },
    treatmentPlan: {
      goals: { type: String, default: "" },
      instructions: { type: String, default: "" },
      status: { type: String, default: "active" },
      nextReviewDate: { type: String, default: "" },
    },
    tasks: { type: [taskSchema], default: [] },
    doctorNotes: { type: String, default: "" },
    prescriptions: { type: [prescriptionSchema], default: [] },
    labRequests: { type: [labRequestSchema], default: [] },
    diagnosis: { type: String, default: "" },
    risk: { type: String, default: "low" },
    status: { type: String, default: "draft" },
    files: { type: [fileSchema], default: [] },
  },
  { timestamps: true }
);

const appointmentDetailModel =
  mongoose.models.appointmentDetails || mongoose.model("appointmentDetails", appointmentDetailSchema);

export default appointmentDetailModel;
