import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const specialtyModel = mongoose.models.specialties || mongoose.model("specialties", specialtySchema);

export default specialtyModel;
