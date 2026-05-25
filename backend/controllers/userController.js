import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import razorpay from 'razorpay';
import { createNotification } from './notificationController.js';
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
        if(user.disabled){
            return res.json({
                success:false,
                message:"Hesabınız devre dışı bırakıldı"
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
        const {docId, slotDate, slotTime, visitReason = ""} = req.body;
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
            visitReason,
            date:Date.now(),
            status:"pending",
        }
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        await createNotification({
            recipientType:"user",
            recipientId:userId,
            title:"Randevu isteği alındı",
            message:`${docData.name} için randevu isteğiniz doktor onayı bekliyor.`,
            link:"/my-appointments"
        });
        await createNotification({
            recipientType:"doctor",
            recipientId:docId,
            title:"Yeni randevu isteği",
            message:`${userData.name} sizden randevu talep etti.`,
            link:"/doctor-appointments"
        });
        res.json({
            success:true,
            message:"Randevu isteği alındı, doktor onayı bekleniyor"
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
        const userId = req.userId;
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

// api  to  cancel  appointment
export const cancelAppointment = async(req,res) => {
    try{
        const {appointmentId} = req.body;
        const userId = req.userId;
        
        const appointmentData = await appointmentModel.findById(appointmentId);
        
        if(!appointmentData){
            return res.json({   
                success:false,
                message:"Randevu bulunamadı"
            })
        }
        
        if(appointmentData.userId !== userId){
            return res.json({   
                success:false,
                message:"Randevu bulunamadı"
            })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        const {docId, sloteDate, sloteTime} = appointmentData;
        const docData = await doctorModel.findById(docId);
        let slots_booked = docData.slots_booked;
        slots_booked[sloteDate] = slots_booked[sloteDate].filter(slot => slot !== sloteTime);
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});
        await createNotification({
            recipientType:"doctor",
            recipientId:docId,
            title:"Randevu iptal edildi",
            message:`${appointmentData.userData.name} randevusunu iptal etti.`,
            link:"/doctor-appointments"
        });
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

export const updateMedicalRecord = async (req, res) => {
    try {
        const userId = req.userId;
        const { allergies = "", medications = "", chronicDiseases = "", bloodType = "", notes = "" } = req.body;
        await userModel.findByIdAndUpdate(userId, {
            medicalRecord: { allergies, medications, chronicDiseases, bloodType, notes }
        });
        res.json({ success:true, message:"Sağlık bilgileri güncellendi" });
    } catch (error) {
        console.log(error);
        res.json({ success:false, message:error.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.json({ success:false, message:"Tüm alanları doldurun" });
        }
        if (newPassword.length < 8) {
            return res.json({ success:false, message:"Yeni parola en az 8 karakter olmalıdır" });
        }
        const user = await userModel.findById(userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success:false, message:"Mevcut parola yanlış" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success:true, message:"Parola başarıyla güncellendi" });
    } catch (error) {
        console.log(error);
        res.json({ success:false, message:error.message });
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// api to create razorpay 
export const paymentRazorpay = async (req, res) => {
try{
        const{appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if(!appointmentData || appointmentData.cancelled){
        return res.json({
            success:false,
            message:"Randevu bulunamadı"
        })
    }

    const options = {
        amount : appointmentData.amount * 100,
        currency : process.env.CURRENCY,
        receipt : `receipt_order_${appointmentId}`
    }

    const order = await razorpayInstance.orders.create(options);
    res.json({
        success:true,
        order
    })

}catch(error){
    console.log(error);
    res.json({
        success:false,
        message:error.message
    })  
}

};

//api  to verify payment of razorpay
export const verifyRazorpay = async(req,res) => {
    try{
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === 'paid'){
            const appointmentId = orderInfo.receipt.replace("receipt_order_", "");
            await appointmentModel.findByIdAndUpdate(appointmentId,{payment:true});
             res.json({
                success:true,
                message:"Ödeme başarılı"
            })
        }else{
            res.json({
                success:false,
                message:"Ödeme başarısız"
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
