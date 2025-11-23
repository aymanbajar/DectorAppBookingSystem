import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
// api to  register user
export const registerUser = async (req, res) => {
    try{
        const {name,email,password} = req.body;

        // checking for all details
        if(!name || !email || !password){
            return res.json({
                success:false,
                message:"Eksik bilgiler"
            })
        }
        if(!validator.isEmail(email)){ 
            return res.json({
                success:false,
                message:"Lütfen geçerli bir e-posta girin"
            })
        }
        if(password.length < 8){
            return res.json({
                success:false,
                message:"Parola en az 8 karakter olmalıdır"
            })
        }

        //hashing user password
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // creating user
        const userData = {name,email,password:hashedPassword};
        const newUser = new userModel(userData);
        await newUser.save();
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)

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
//apui  for user login
export const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"Kullanıcı bulunamadı"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(isPasswordMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            return res.json({
                success:true,
                token
            })
        }else{
            return res.json({
                success:false,
                message:"Parola yanlış"
            })
        }


    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}
//api  get user info
export const getProfile = async (req,res) => {
    try{
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');
        res.json({
            success:true,
            user:userData
        });
    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

// api  to update user profile
export const updateProfile = async (req,res) => {
    try{
        const {name, phone, address, dob, gender} = req.body;
        const imageFile = req.file;
        const userId = req.userId;
        
        console.log("Received data:", {name, phone, address, dob, gender});
        console.log("Image file:", imageFile);
        console.log("User ID:", userId);
        
        if(!phone || !address || !dob || !gender){
            return res.json({
                success:false,
                message:"Tüm alanları doldurun"
            });
        }
        
        const updateData = {
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        };
        
        if(name) {
            updateData.name = name;
        }
        
        await userModel.findByIdAndUpdate(userId, updateData);
        if(imageFile){
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageUrl});
        }
        res.json({
            success:true,
            message:"Profil başarıyla güncellendi"
        });

    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }


}

//api to book appointment
export const bookAppointment  =async(req,res) => {
    try{
        const {docId, slotDate, slotTime} = req.body;
        const userId = req.userId;
        
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({
                success:false,
                message:"Doktor şu anda müsait değil"
            })
        }
        let slots_booked = docData.slots_booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({
                    success:false,
                    message:"Bu zaman aralığı zaten rezerve edilmiş"
                })
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked;
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            sloteDate: slotDate,
            sloteTime: slotTime,
            date:Date.now(),
        }
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({
            success:true,
            message:"Randevu başarıyla alındı"
        });

    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}
// api  to get  user appointements for frontend my-appointments page

export const  listAppointment = async(req,res) => {
    try{
        const {userId} = req.body;
        const appointments = await appointmentModel.find({userId});
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
