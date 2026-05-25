import express from 'express';
import { doctorList,loginDoctor ,appointmentsDoctor,appointmentCancel,appointmentComplete,appointmentConfirm,appointmentReject,doctorDashboard,  doctorProfile,
    updateDoctorProfile} from '../controllers/doctorController.js';
import authDoctor  from '../middlewares/authDoctor.js';
import { getDoctorChat, getDoctorChats, sendDoctorMessage } from '../controllers/chatController.js';
import { getDoctorReviews } from '../controllers/reviewController.js';
import { getDoctorNotifications, markDoctorNotificationsRead } from '../controllers/notificationController.js';
const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.get('/reviews/:docId', getDoctorReviews);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor,appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/confirm-appointment', authDoctor, appointmentConfirm);
doctorRouter.post('/reject-appointment', authDoctor, appointmentReject);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.get('/notifications', authDoctor, getDoctorNotifications);
doctorRouter.post('/notifications/read', authDoctor, markDoctorNotificationsRead);
doctorRouter.get('/chats', authDoctor, getDoctorChats);
doctorRouter.get('/chat/:userId', authDoctor, getDoctorChat);
doctorRouter.post('/chat/:userId', authDoctor, sendDoctorMessage);

export default doctorRouter;
