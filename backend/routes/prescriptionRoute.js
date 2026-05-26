import express from "express";
import authDoctor from "../middlewares/authDoctor.js";
import authUser from "../middlewares/authUser.js";
import {
  createPrescription,
  getPrescriptionsByAppointment,
  getPrescriptionsByDoctor,
  getPrescriptionsByPatient,
} from "../controllers/prescriptionController.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post("/", authDoctor, createPrescription);
prescriptionRouter.get("/appointment/:appointmentId", getPrescriptionsByAppointment);
prescriptionRouter.get("/patient/:patientId", authUser, getPrescriptionsByPatient);
prescriptionRouter.get("/doctor/:doctorId", authDoctor, getPrescriptionsByDoctor);

export default prescriptionRouter;
