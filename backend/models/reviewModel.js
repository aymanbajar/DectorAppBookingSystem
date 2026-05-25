import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    docId: { type: String, required: true, index: true },
    appointmentId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const reviewModel = mongoose.models.reviews || mongoose.model("reviews", reviewSchema);

export default reviewModel;
