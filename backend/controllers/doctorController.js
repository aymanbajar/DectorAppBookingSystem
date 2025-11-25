import doctorModel from "../models/doctorModel.js";
import bycrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
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
    const doctors = await doctorModel.find({}).select("-password -email");
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
    const dashData = {
      earnings,
      appointmentCount: appointments.length,
      patients: paitents.length,
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

// api  to update doctor profile info for doctor profile page
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const {fees, address, available} = req.body;
    await doctorModel.findByIdAndUpdate(docId, {fees, address, available});
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
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
};
