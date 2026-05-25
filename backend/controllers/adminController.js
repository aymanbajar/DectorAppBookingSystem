import validator from "validator";
import bycrpyt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

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
    const dashData = {
      doctors : doctors.length,
      appointments : appointments.length,
      patients:users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData
    });

  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


export { addDoctor, loginAdmin, allDoctors ,appointmentsAdmin,appointmentCancel,adminDashboard};
