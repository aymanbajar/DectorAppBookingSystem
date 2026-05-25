import express from "express";
import { addDoctor, loginAdmin, allDoctors, allPatients, updateDoctor, deleteDoctor, deletePatient, updatePatient, appointmentsAdmin, appointmentCancel, adminDashboard, adminCenter, addSpecialty, updateSpecialty, deleteSpecialty, setDoctorStatus, setPatientStatus, deleteReview, broadcastNotification, updateSiteSettings } from "../controllers/adminController.js"; 
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// adminRouter.post("/add-doctor", authAdmin,upload.single("image"), addDoctor);

adminRouter.post("/add-doctor",authAdmin,upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/patients", authAdmin, allPatients);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.post("/update-doctor/:docId", authAdmin, upload.single("image"), updateDoctor);
adminRouter.post("/update-patient/:userId", authAdmin, updatePatient);
adminRouter.delete("/doctor/:docId", authAdmin, deleteDoctor);
adminRouter.delete("/patient/:userId", authAdmin, deletePatient);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.get("/center", authAdmin, adminCenter);
adminRouter.post("/specialty", authAdmin, addSpecialty);
adminRouter.post("/specialty/:id", authAdmin, updateSpecialty);
adminRouter.delete("/specialty/:id", authAdmin, deleteSpecialty);
adminRouter.post("/doctor-status/:docId", authAdmin, setDoctorStatus);
adminRouter.post("/patient-status/:userId", authAdmin, setPatientStatus);
adminRouter.delete("/review/:reviewId", authAdmin, deleteReview);
adminRouter.post("/broadcast", authAdmin, broadcastNotification);
adminRouter.post("/site-settings", authAdmin, updateSiteSettings);

export default adminRouter;
