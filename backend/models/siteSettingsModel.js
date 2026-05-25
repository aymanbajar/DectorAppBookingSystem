import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Dector" },
    heroSubtitle: { type: String, default: "Doktor randevularınızı kolayca yönetin." },
    featuredDoctorIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

const siteSettingsModel = mongoose.models.siteSettings || mongoose.model("siteSettings", siteSettingsSchema);

export default siteSettingsModel;
