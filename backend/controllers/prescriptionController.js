import appointmentModel from "../models/appointmentModel.js";
import appointmentDetailModel from "../models/appointmentDetailModel.js";

const flattenPrescriptions = async (details) => {
  const appointmentIds = details.map((detail) => detail.appointmentId);
  const appointments = await appointmentModel.find({ _id: { $in: appointmentIds } });
  const appointmentMap = new Map(appointments.map((appointment) => [appointment._id.toString(), appointment]));

  return details.flatMap((detail) => {
    const appointment = appointmentMap.get(detail.appointmentId);
    return (detail.prescriptions || []).map((prescription) => ({
      ...prescription.toObject(),
      prescriptionId: prescription._id,
      appointmentId: detail.appointmentId,
      patientId: detail.patientId,
      doctorId: detail.doctorId,
      patientData: appointment?.userData,
      doctorData: appointment?.docData,
      appointmentDate: appointment?.sloteDate,
      appointmentTime: appointment?.sloteTime,
    }));
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createPrescription = async (req, res) => {
  try {
    const doctorId = req.docId;
    const { appointmentId, medicine = "", dosage = "", duration = "", notes = "", instructions = "" } = req.body;
    if (!appointmentId || !medicine) return res.json({ success: false, message: "Randevu ve ilac gerekli" });

    const appointment = await appointmentModel.findOne({ _id: appointmentId, docId: doctorId });
    if (!appointment) return res.json({ success: false, message: "Randevu bulunamadi" });

    const detail = await appointmentDetailModel.findOneAndUpdate(
      { appointmentId },
      {
        $setOnInsert: {
          appointmentId,
          patientId: appointment.userId,
          doctorId,
          visitReason: appointment.visitReason || "",
          healthRecord: appointment.userData?.medicalRecord || {},
        },
        $push: { prescriptions: { medicine, dosage, duration, notes, instructions } },
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "Recete eklendi", detail });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getPrescriptionsByAppointment = async (req, res) => {
  try {
    const detail = await appointmentDetailModel.findOne({ appointmentId: req.params.appointmentId });
    res.json({ success: true, prescriptions: detail?.prescriptions || [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const patientId = req.userId || req.params.patientId;
    const details = await appointmentDetailModel.find({ patientId, "prescriptions.0": { $exists: true } });
    const prescriptions = await flattenPrescriptions(details);
    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const doctorId = req.docId || req.params.doctorId;
    const details = await appointmentDetailModel.find({ doctorId, "prescriptions.0": { $exists: true } });
    const prescriptions = await flattenPrescriptions(details);
    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
