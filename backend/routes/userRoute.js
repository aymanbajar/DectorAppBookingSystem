import express from 'express';
import {registerUser,loginUser,getProfile,updateProfile,updateMedicalRecord,changePassword,bookAppointment,listAppointment,listPatientPrescriptions,cancelAppointment,paymentRazorpay,verifyRazorpay} from '../controllers/userController.js';
import { getUserChat, getUserChats, sendUserMessage } from '../controllers/chatController.js';
import { addReview } from '../controllers/reviewController.js';
import { getUserNotifications, getUserUnreadNotificationCount, markUserNotificationsRead } from '../controllers/notificationController.js';
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js';
const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile',authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/update-medical-record', authUser, updateMedicalRecord);
userRouter.post('/change-password', authUser, changePassword);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.get('/prescriptions', authUser, listPatientPrescriptions);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verifyRazorpay', authUser, verifyRazorpay);
userRouter.post('/review', authUser, addReview);
userRouter.get('/notifications', authUser, getUserNotifications);
userRouter.get('/notifications/unread-count', authUser, getUserUnreadNotificationCount);
userRouter.post('/notifications/read', authUser, markUserNotificationsRead);
userRouter.get('/chats', authUser, getUserChats);
userRouter.get('/chat/:docId', authUser, getUserChat);
userRouter.post('/chat/:docId', authUser, sendUserMessage);

export default userRouter;
