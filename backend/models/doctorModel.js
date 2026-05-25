import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    approved: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    workSchedule: {
      type: [
        {
          day: { type: String, default: "" },
          enabled: { type: Boolean, default: false },
          start: { type: String, default: "09:00" },
          end: { type: String, default: "17:00" },
        },
      ],
      default: [],
    },
    blockedDays: { type: [String], default: [] },
    prescriptionTemplates: {
      type: [
        {
          name: { type: String, default: "" },
          medicine: { type: String, default: "" },
          dosage: { type: String, default: "" },
          duration: { type: String, default: "" },
          notes: { type: String, default: "" },
        },
      ],
      default: [],
    },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} }
  },
  { minimize: false }
);

const doctorModel = mongoose.model("doctor", doctorSchema);

export default doctorModel;
