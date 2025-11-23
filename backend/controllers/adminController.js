import validator from "validator";
import bycrpyt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

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
      res.json({ success: false, message: error.message });
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

export { addDoctor, loginAdmin, allDoctors };