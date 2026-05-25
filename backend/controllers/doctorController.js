import doctorModel from "../models/doctorModel.js";
import bycrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import doctorPatientRecordModel from "../models/doctorPatientRecordModel.js";
import { v2 as cloudinary } from "cloudinary";
import { createNotification } from "./notificationController.js";
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({
      success: true,
      message: "Doktor uygunluğu başarıyla değiştirildi",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ approved: { $ne: false }, disabled: { $ne: true } }).select("-password -email");
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({
        success: false,
        message: "Geçersiz e-posta veya şifre",
      });
    }
    const isMatch = await bycrpyt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Geçersiz e-posta veya şifre",
      });
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//api  to  get doctor appointments for  doctor panel

const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// api to  mark appointmet compoleted for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) 
      {
        await appointmentModel.findByIdAndUpdate(appointmentId, {
          isCompleted: true,
          status: "completed",
        });
        await createNotification({
          recipientType: "user",
          recipientId: appointmentData.userId,
          title: "Randevu tamamlandı",
          message: `${appointmentData.docData.name} ile randevunuz tamamlandı. Dilerseniz doktoru değerlendirebilirsiniz.`,
          link: "/my-appointments"
        });
        return res.json({
          success: true,
          message: "Randevu başarıyla tamamlandı",
        });
      }else{
        return res.json({
          success: false,
          message: "Randevu  tamamlanamadı",
        });
      }
    } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) 
      {
        await appointmentModel.findByIdAndUpdate(appointmentId, {
          cancelled: true,
          status: "cancelled",
        });
        await createNotification({
          recipientType: "user",
          recipientId: appointmentData.userId,
          title: "Randevu iptal edildi",
          message: `${appointmentData.docData.name} randevunuzu iptal etti.`,
          link: "/my-appointments"
        });
        return res.json({
          success: true,
          message: "Randevu başarıyla iptal edildi",
        });
      }else{
        return res.json({
          success: false,
            message: "iptal edilemedi",
        });
      }
    } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const appointmentConfirm = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { status: "confirmed" });
      await createNotification({
        recipientType: "user",
        recipientId: appointmentData.userId,
        title: "Randevunuz onaylandı",
        message: `${appointmentData.docData.name} randevunuzu onayladı.`,
        link: "/my-appointments"
      });
      return res.json({ success: true, message: "Randevu onaylandı" });
    }
    return res.json({ success: false, message: "Randevu onaylanamadı" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentReject = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { status: "rejected", cancelled: true });
      const docData = await doctorModel.findById(docId);
      if (docData?.slots_booked?.[appointmentData.sloteDate]) {
        docData.slots_booked[appointmentData.sloteDate] = docData.slots_booked[appointmentData.sloteDate].filter((slot) => slot !== appointmentData.sloteTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked: docData.slots_booked });
      }
      await createNotification({
        recipientType: "user",
        recipientId: appointmentData.userId,
        title: "Randevu isteğiniz reddedildi",
        message: `${appointmentData.docData.name} randevu isteğinizi reddetti.`,
        link: "/my-appointments"
      });
      return res.json({ success: true, message: "Randevu reddedildi" });
    }
    return res.json({ success: false, message: "Randevu reddedilemedi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//api to  get data for doctor dashboard
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0;
    appointments.map((item) => {
      if(item.isCompleted || item.payment){
        earnings += item.amount;
      }
    });
    let paitents =[];
    appointments.map((item) => {
      if(!paitents.includes(item.userId)){
        paitents.push(item.userId);
      }
    });
    const today = new Date();
    const inTwoDays = new Date();
    inTwoDays.setDate(today.getDate() + 2);
    const parseSlotDate = (slotDate = "") => {
      const [day, month, year] = slotDate.split("-").map(Number);
      return new Date(year, month - 1, day);
    };
    const upcomingAppointments = appointments
      .filter((item) => ["pending", "confirmed"].includes(item.status) && !item.cancelled)
      .filter((item) => {
        const slotDate = parseSlotDate(item.sloteDate);
        return slotDate >= today && slotDate <= inTwoDays;
      })
      .sort((a, b) => parseSlotDate(a.sloteDate) - parseSlotDate(b.sloteDate))
      .slice(0, 5);
    const completed = appointments.filter((item) => item.isCompleted || item.status === "completed").length;
    const cancelled = appointments.filter((item) => item.cancelled || item.status === "cancelled" || item.status === "rejected").length;
    const pending = appointments.filter((item) => item.status === "pending").length;
    const dailyLoad = appointments.reduce((acc, item) => {
      acc[item.sloteDate] = (acc[item.sloteDate] || 0) + 1;
      return acc;
    }, {});
    const busiestDay = Object.entries(dailyLoad).sort((a, b) => b[1] - a[1])[0];

    const dashData = {
      earnings,
      appointmentCount: appointments.length,
      appointments: appointments.length,
      patients: paitents.length,
      completed,
      cancelled,
      pending,
      busiestDay: busiestDay ? { date: busiestDay[0], count: busiestDay[1] } : null,
      upcomingAppointments,
      latestAppointments: appointments.reverse().slice(0,5),
    };
    res.json({
      success: true,
      dashData,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
}

//api  to get docInfo for doctor profile page
const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const profileData = await doctorModel.findById(docId).select("-password");
    if (!profileData) {
      return res.json({
        success: false,
        message: "Doktor bulunamadı",
      });
    }
    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const doctorPatients = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });
    const patientsMap = new Map();

    appointments.forEach((appointment) => {
      const current = patientsMap.get(appointment.userId) || {
        userId: appointment.userId,
        userData: appointment.userData,
        appointmentCount: 0,
        latestAppointment: appointment,
      };
      current.appointmentCount += 1;
      if (appointment.date > current.latestAppointment.date) current.latestAppointment = appointment;
      patientsMap.set(appointment.userId, current);
    });

    res.json({ success: true, patients: Array.from(patientsMap.values()) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorPatientDetails = async (req, res) => {
  try {
    const docId = req.docId;
    const { userId } = req.params;
    const appointments = await appointmentModel.find({ docId, userId }).sort({ date: -1 });
    if (!appointments.length) {
      return res.json({ success: false, message: "Hasta bulunamadı" });
    }
    if (doctor.disabled || !doctor.approved) {
      return res.json({
        success: false,
        message: "Hesabınız şu anda aktif değil",
      });
    }
    const patient = await userModel.findById(userId).select("-password");
    const record = await doctorPatientRecordModel.findOneAndUpdate(
      { docId, userId },
      { $setOnInsert: { docId, userId } },
      { new: true, upsert: true }
    );
    res.json({ success: true, patient, appointments, record });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updatePatientRecord = async (req, res) => {
  try {
    const docId = req.docId;
    const { userId } = req.params;
    const {
      privateNotes = "",
      followUpStatus = "normal",
      riskLevel = "low",
      followUpDate = "",
      tags = [],
      treatmentPlan = {},
      tasks = [],
      labRequests = [],
    } = req.body;
    const hasAppointment = await appointmentModel.exists({ docId, userId });
    if (!hasAppointment) return res.json({ success: false, message: "Hasta bulunamadı" });
    const record = await doctorPatientRecordModel.findOneAndUpdate(
      { docId, userId },
      {
        docId,
        userId,
        privateNotes,
        followUpStatus,
        riskLevel,
        followUpDate,
        tags,
        treatmentPlan,
        tasks,
        labRequests,
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: "Hasta notları güncellendi", record });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addPrescription = async (req, res) => {
  try {
    const docId = req.docId;
    const { userId } = req.params;
    const { medicine = "", dosage = "", duration = "", notes = "" } = req.body;
    if (!medicine || !dosage || !duration) {
      return res.json({ success: false, message: "İlaç, doz ve süre zorunludur" });
    }
    const hasAppointment = await appointmentModel.exists({ docId, userId });
    if (!hasAppointment) return res.json({ success: false, message: "Hasta bulunamadı" });
    const record = await doctorPatientRecordModel.findOneAndUpdate(
      { docId, userId },
      { $setOnInsert: { docId, userId }, $push: { prescriptions: { medicine, dosage, duration, notes } } },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: "Reçete eklendi", record });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const uploadPatientFile = async (req, res) => {
  try {
    const docId = req.docId;
    const { userId } = req.params;
    const { title = "" } = req.body;
    const file = req.file;
    if (!file) return res.json({ success: false, message: "Dosya seçilmedi" });
    const hasAppointment = await appointmentModel.exists({ docId, userId });
    if (!hasAppointment) return res.json({ success: false, message: "Hasta bulunamadı" });
    const upload = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
    const record = await doctorPatientRecordModel.findOneAndUpdate(
      { docId, userId },
      {
        $setOnInsert: { docId, userId },
        $push: {
          files: {
            title: title || file.originalname,
            fileUrl: upload.secure_url,
            fileType: file.mimetype,
          },
        },
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: "Dosya eklendi", record });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.params;
    const { status } = req.body;
    if (!["pending", "confirmed", "completed", "follow_up", "cancelled"].includes(status)) {
      return res.json({ success: false, message: "Geçersiz durum" });
    }
    const appointment = await appointmentModel.findOne({ _id: appointmentId, docId });
    if (!appointment) return res.json({ success: false, message: "Randevu bulunamadı" });
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      status,
      isCompleted: status === "completed",
      cancelled: status === "cancelled",
    });
    res.json({ success: true, message: "Randevu durumu güncellendi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api  to update doctor profile info for doctor profile page
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { name, email, speciality, degree, experience, about, fees, address, available, password, workSchedule, blockedDays, prescriptionTemplates } = req.body;
    const imageFile = req.file;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (speciality) updateData.speciality = speciality;
    if (degree) updateData.degree = degree;
    if (experience) updateData.experience = experience;
    if (about) updateData.about = about;
    if (fees !== undefined) updateData.fees = fees;
    if (available !== undefined) updateData.available = available === true || available === "true";
    if (address) updateData.address = typeof address === "string" ? JSON.parse(address) : address;
    if (workSchedule) updateData.workSchedule = typeof workSchedule === "string" ? JSON.parse(workSchedule) : workSchedule;
    if (blockedDays) updateData.blockedDays = typeof blockedDays === "string" ? JSON.parse(blockedDays) : blockedDays;
    if (prescriptionTemplates) updateData.prescriptionTemplates = typeof prescriptionTemplates === "string" ? JSON.parse(prescriptionTemplates) : prescriptionTemplates;
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }
    if (password) {
      if (password.length < 8) {
        return res.json({ success: false, message: "Parola en az 8 karakter olmalıdır" });
      }
      const salt = await bycrpyt.genSalt(10);
      updateData.password = await bycrpyt.hash(password, salt);
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);
    res.json({
      success: true,
      message: "Doktor bilgileri başarıyla güncellendi",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
    appointmentCancel,
    appointmentConfirm,
    appointmentReject,
    doctorDashboard,
    doctorProfile,
    doctorPatients,
    doctorPatientDetails,
    updatePatientRecord,
    addPrescription,
    uploadPatientFile,
    updateAppointmentStatus,
    updateDoctorProfile
};
