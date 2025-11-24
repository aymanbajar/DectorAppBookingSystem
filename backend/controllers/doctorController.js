import doctorModel from "../models/doctorModel.js";
import bycrpyt from "bcrypt";
import jwt from "jsonwebtoken"; 
import appointmentModel from "../models/appointmentModel.js";
const changeAvailablity = async (req, res) => {
    try{
    const {docId} = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
    res.json({
        success:true,
        message:"Doktor uygunluğu başarıyla değiştirildi"
    })
    }catch(error){
     console.log(error);
     res.json({
        success:false,
        message:error.message
     })   
    }
}
const doctorList = async (req, res) => {
    try{
    const doctors = await doctorModel.find({}).select('-password -email');
    res.json({
        success:true,
        doctors
    })
    }catch(error){
     console.log(error);
     res.json({
        success:false,
        message:error.message
     })   
    }

}

// api for doctor login
const loginDoctor = async (req, res) => {
    try{
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if(!doctor){
        return res.json({success:false,message:"Geçersiz e-posta veya şifre"});
    }
    const isMatch = await bycrpyt.compare(password, doctor.password);
    if(!isMatch){
        return res.json({success:false,message:"Geçersiz e-posta veya şifre"});
    }
    const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);
    res.json({
        success:true,
        token
    })

    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

//api  to  get doctor appointments for  doctor panel

const appointmentsDoctor = async (req,res) => {
    try{
        const {docId} = req.body;
        const appointments = await appointmentModel.find({docId})
        res.json({
            success:true,
            appointments
        })

    }catch(error){
        console.log(error);
    res.json({
        success:false,
        message:error.message
     }) 
    }
}

export { changeAvailablity, doctorList ,loginDoctor, appointmentsDoctor    };