import validator from "validator";
import bycrpyt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import reviewModel from "../models/reviewModel.js";
import notificationModel from "../models/notificationModel.js";
import doctorPatientRecordModel from "../models/doctorPatientRecordModel.js";
import activityLogModel from "../models/activityLogModel.js";
import specialtyModel from "../models/specialtyModel.js";
import siteSettingsModel from "../models/siteSettingsModel.js";

const logActivity = async (action, targetType = "", targetId = "", details = {}) => {
  try {
    await activityLogModel.create({ action, targetType, targetId, details });
  } catch (error) {
    console.log("Activity log error:", error.message);
  }
};

// api for adding doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log("image", imageFile);
    console.log(req.body, imageFile);
    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // validating email format
    if(!validator.isEmail(email)){

        return res.json({
          success: false,
          message: "please enter a valid email",
        });

    }

    // validaying strong password
    if(password.length < 8){
        return res.json({
          success: false,
          message: "please enter a strong  password",
        });
    }
    // hashing doctor password
    const  salt  = await  bycrpyt.genSalt(10)
    const  hashedPassword =  await bycrpyt.hash(password,salt)

    // upload image to cloudinary
    const  imageUpload = await cloudinary.uploader.upload(`${imageFile.path}`,{resource_type:"image"})
    const imagUrl = imageUpload.secure_url
    const doctorData = {
      name,
      email,
      image: imagUrl,
      password:hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address),
      date:Date.now(),

    };
    const  newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    await logActivity("doctor_created", "doctor", newDoctor._id.toString(), { name, speciality });
    res.json({success:true,message:'Doctor added'})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
const token = jwt.sign(
  { email },        // payload as object
  process.env.JWT_SECRET,

);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const allDoctors =async(req,res) => {
  try{
    const doctors = await doctorModel.find({}).select('-password');
    res.json({success:true,doctors});
  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const allPatients = async (req, res) => {
  try {
    const patients = await userModel.find({}).select("-password").sort({ date: -1 });
    res.json({ success: true, patients });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { docId } = req.params;
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
    } = req.body;
    const imageFile = req.file;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Lütfen geçerli bir e-posta girin" });
      }
      updateData.email = email;
    }
    if (speciality) updateData.speciality = speciality;
    if (degree) updateData.degree = degree;
    if (experience) updateData.experience = experience;
    if (about) updateData.about = about;
    if (fees !== undefined) updateData.fees = fees;
    if (available !== undefined) updateData.available = available === true || available === "true";
    if (address) updateData.address = typeof address === "string" ? JSON.parse(address) : address;
    if (password) {
      if (password.length < 8) {
        return res.json({ success: false, message: "Parola en az 8 karakter olmalıdır" });
      }
      const salt = await bycrpyt.genSalt(10);
      updateData.password = await bycrpyt.hash(password, salt);
    }
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(`${imageFile.path}`, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);
    await logActivity("doctor_updated", "doctor", docId, updateData);
    res.json({ success: true, message: "Doktor bilgileri güncellendi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.params;
    await doctorModel.findByIdAndDelete(docId);
    await appointmentModel.deleteMany({ docId });
    await logActivity("doctor_deleted", "doctor", docId);
    res.json({ success: true, message: "Doktor silindi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { userId } = req.params;
    await userModel.findByIdAndDelete(userId);
    await appointmentModel.deleteMany({ userId });
    await logActivity("patient_deleted", "patient", userId);
    res.json({ success: true, message: "Hasta silindi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, gender, dob, address, medicalRecord, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Lütfen geçerli bir e-posta girin" });
      }
      updateData.email = email;
    }
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (dob !== undefined) updateData.dob = dob;
    if (address) updateData.address = typeof address === "string" ? JSON.parse(address) : address;
    if (medicalRecord) updateData.medicalRecord = typeof medicalRecord === "string" ? JSON.parse(medicalRecord) : medicalRecord;
    if (password) {
      if (password.length < 8) {
        return res.json({ success: false, message: "Parola en az 8 karakter olmalıdır" });
      }
      const salt = await bycrpyt.genSalt(10);
      updateData.password = await bycrpyt.hash(password, salt);
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    await logActivity("patient_updated", "patient", userId, updateData);
    res.json({ success: true, message: "Hasta bilgileri güncellendi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api  to get all  appointments list 
const  appointmentsAdmin = async (req,res) => {
  try{
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments});
  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

 const appointmentCancel = async(req,res) => {
    try{
        const {appointmentId} = req.body;
        
        const appointmentData = await appointmentModel.findById(appointmentId);
        
      

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        const {docId, sloteDate, sloteTime} = appointmentData;
        const docData = await doctorModel.findById(docId);
        let slots_booked = docData.slots_booked;
        slots_booked[sloteDate] = slots_booked[sloteDate].filter(slot => slot !== sloteTime);
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});
        res.json({
            success:true,
            message:"Randevu iptal edildi"
        })

    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}   

//api  to getr dashboard data for admin panel

const adminDashboard = async(req,res) => {
  try{
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const reviews = await reviewModel.find({});
    const completed = appointments.filter((item) => item.isCompleted || item.status === "completed");
    const cancelled = appointments.filter((item) => item.cancelled || ["cancelled", "rejected"].includes(item.status));
    const revenue = completed.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const specialtyCounts = doctors.reduce((acc, doctor) => {
      acc[doctor.speciality] = (acc[doctor.speciality] || 0) + 1;
      return acc;
    }, {});
    const topSpecialty = Object.entries(specialtyCounts).sort((a, b) => b[1] - a[1])[0];
    const dashData = {
      doctors : doctors.length,
      appointments : appointments.length,
      patients:users.length,
      activeDoctors: doctors.filter((doctor) => doctor.available && !doctor.disabled && doctor.approved).length,
      pendingDoctors: doctors.filter((doctor) => !doctor.approved).length,
      disabledUsers: users.filter((user) => user.disabled).length,
      completedAppointments: completed.length,
      cancelledAppointments: cancelled.length,
      revenue,
      averageRating: reviews.length ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1) : 0,
      topSpecialty: topSpecialty ? { name: topSpecialty[0], count: topSpecialty[1] } : null,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData
    });

  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const adminCenter = async (req, res) => {
  try {
    const [specialties, activities, reviews, settings, records, doctors, patients, appointments] = await Promise.all([
      specialtyModel.find({}).sort({ createdAt: -1 }),
      activityLogModel.find({}).sort({ createdAt: -1 }).limit(50),
      reviewModel.find({}).sort({ createdAt: -1 }),
      siteSettingsModel.findOne({}),
      doctorPatientRecordModel.find({}).sort({ updatedAt: -1 }).limit(30),
      doctorModel.find({}).select("-password"),
      userModel.find({}).select("-password"),
      appointmentModel.find({}).sort({ date: -1 }),
    ]);
    res.json({ success: true, specialties, activities, reviews, settings: settings || {}, records, doctors, patients, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addSpecialty = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.json({ success: false, message: "Uzmanlık adı gerekli" });
    const specialty = await specialtyModel.findOneAndUpdate({ name }, { name, active: true }, { new: true, upsert: true });
    await logActivity("specialty_saved", "specialty", specialty._id.toString(), { name });
    res.json({ success: true, message: "Uzmanlık kaydedildi", specialty });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;
    const specialty = await specialtyModel.findByIdAndUpdate(id, { name, active }, { new: true });
    await logActivity("specialty_updated", "specialty", id, { name, active });
    res.json({ success: true, message: "Uzmanlık güncellendi", specialty });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    await specialtyModel.findByIdAndDelete(id);
    await logActivity("specialty_deleted", "specialty", id);
    res.json({ success: true, message: "Uzmanlık silindi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const setDoctorStatus = async (req, res) => {
  try {
    const { docId } = req.params;
    const { approved, disabled } = req.body;
    const updateData = {};
    if (approved !== undefined) updateData.approved = approved;
    if (disabled !== undefined) updateData.disabled = disabled;
    await doctorModel.findByIdAndUpdate(docId, updateData);
    await logActivity("doctor_status_updated", "doctor", docId, updateData);
    res.json({ success: true, message: "Doktor durumu güncellendi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const setPatientStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { disabled } = req.body;
    await userModel.findByIdAndUpdate(userId, { disabled });
    await logActivity("patient_status_updated", "patient", userId, { disabled });
    res.json({ success: true, message: "Hasta durumu güncellendi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await reviewModel.findByIdAndDelete(reviewId);
    await logActivity("review_deleted", "review", reviewId);
    res.json({ success: true, message: "Yorum silindi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const broadcastNotification = async (req, res) => {
  try {
    const { recipientType = "user", title, message, link = "" } = req.body;
    if (!title || !message) return res.json({ success: false, message: "Başlık ve mesaj gerekli" });
    const recipients = recipientType === "doctor" ? await doctorModel.find({}).select("_id") : await userModel.find({}).select("_id");
    if (!["user", "doctor"].includes(recipientType)) return res.json({ success: false, message: "Gecersiz alici tipi" });
    if (!recipients.length) return res.json({ success: false, message: "Alici bulunamadi" });

    const dedupeKey = `broadcast-${recipientType}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const result = await notificationModel.bulkWrite(
      recipients.map((item) => ({
        updateOne: {
          filter: { recipientType, recipientId: item._id.toString(), dedupeKey },
          update: { $setOnInsert: { recipientType, recipientId: item._id.toString(), title, message, link, dedupeKey, read: false } },
          upsert: true,
        },
      })),
      { ordered: false }
    );
    const sentCount = result.upsertedCount || recipients.length;
    await logActivity("notification_broadcast", recipientType, "", { title, count: sentCount });
    res.json({ success: true, message: `${sentCount} kisiye bildirim gonderildi` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateSiteSettings = async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, featuredDoctorIds = [] } = req.body;
    const settings = await siteSettingsModel.findOneAndUpdate({}, { heroTitle, heroSubtitle, featuredDoctorIds }, { new: true, upsert: true });
    await logActivity("site_settings_updated", "settings", settings._id.toString(), { heroTitle });
    res.json({ success: true, message: "Site ayarları güncellendi", settings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { addDoctor, loginAdmin, allDoctors, allPatients, updateDoctor, deleteDoctor, deletePatient, updatePatient, appointmentsAdmin, appointmentCancel, adminDashboard, adminCenter, addSpecialty, updateSpecialty, deleteSpecialty, setDoctorStatus, setPatientStatus, deleteReview, broadcastNotification, updateSiteSettings };

