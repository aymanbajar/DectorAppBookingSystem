import express from 'express';
import { doctorList,loginDoctor ,appointmentsDoctor,appointmentCancel,appointmentComplete,appointmentConfirm,appointmentReject,doctorDashboard,  doctorProfile, doctorPatients, doctorPatientDetails, updatePatientRecord, addPrescription, uploadPatientFile, updateAppointmentStatus, getDoctorAppointmentDetails, updateDoctorAppointmentDetails, getDoctorPrescriptions, updateDoctorPrescription,
    updateDoctorProfile} from '../controllers/doctorController.js';
import authDoctor  from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';
import { getDoctorChat, getDoctorChats, sendDoctorMessage } from '../controllers/chatController.js';
import { getDoctorReviews } from '../controllers/reviewController.js';
import { getDoctorNotifications, getDoctorUnreadNotificationCount, markDoctorNotificationsRead } from '../controllers/notificationController.js';
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
doctorRouter.get('/patients', authDoctor, doctorPatients);
doctorRouter.get('/patient/:userId', authDoctor, doctorPatientDetails);
doctorRouter.post('/patient/:userId/record', authDoctor, updatePatientRecord);
doctorRouter.post('/patient/:userId/prescription', authDoctor, addPrescription);
doctorRouter.post('/patient/:userId/file', authDoctor, upload.single('file'), uploadPatientFile);
doctorRouter.post('/appointment/:appointmentId/status', authDoctor, updateAppointmentStatus);
doctorRouter.get('/appointments/:appointmentId', authDoctor, getDoctorAppointmentDetails);
doctorRouter.put('/appointments/:appointmentId/details', authDoctor, updateDoctorAppointmentDetails);
doctorRouter.get('/prescriptions', authDoctor, getDoctorPrescriptions);
doctorRouter.put('/prescriptions/:prescriptionId', authDoctor, updateDoctorPrescription);
doctorRouter.post('/update-profile', authDoctor, upload.single('image'), updateDoctorProfile);
doctorRouter.get('/notifications', authDoctor, getDoctorNotifications);
doctorRouter.get('/notifications/unread-count', authDoctor, getDoctorUnreadNotificationCount);
doctorRouter.post('/notifications/read', authDoctor, markDoctorNotificationsRead);
doctorRouter.get('/chats', authDoctor, getDoctorChats);
doctorRouter.get('/chat/:userId', authDoctor, getDoctorChat);
doctorRouter.post('/chat/:userId', authDoctor, sendDoctorMessage);

export default doctorRouter;
