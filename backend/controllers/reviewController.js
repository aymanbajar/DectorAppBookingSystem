import appointmentModel from "../models/appointmentModel.js";
import reviewModel from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId, rating, comment } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.userId !== userId) {
      return res.json({ success: false, message: "Randevu bulunamadı" });
    }
    if (!appointment.isCompleted) {
      return res.json({ success: false, message: "Yalnızca tamamlanan randevular değerlendirilebilir" });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5 || !comment?.trim()) {
      return res.json({ success: false, message: "Puan ve yorum gereklidir" });
    }

    const review = await reviewModel.findOneAndUpdate(
      { appointmentId },
      {
        userId,
        docId: appointment.docId,
        appointmentId,
        userName: appointment.userData.name,
        rating: Number(rating),
        comment: comment.trim(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await appointmentModel.findByIdAndUpdate(appointmentId, { reviewed: true });
    res.json({ success: true, review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ docId: req.params.docId }).sort({ createdAt: -1 });
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    res.json({ success: true, reviews, averageRating, totalReviews: reviews.length });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
