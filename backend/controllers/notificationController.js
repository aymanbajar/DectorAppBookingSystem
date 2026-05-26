import notificationModel from "../models/notificationModel.js";
import appointmentModel from "../models/appointmentModel.js";

export const createNotification = async ({ recipientType, recipientId, title, message, link = "", dedupeKey }) => {
  try {
    if (dedupeKey) {
      const existing = await notificationModel.findOne({ recipientType, recipientId, dedupeKey });
      if (existing) return;
    }
    const notificationData = { recipientType, recipientId, title, message, link };
    if (dedupeKey) notificationData.dedupeKey = dedupeKey;
    await notificationModel.create(notificationData);
  } catch (error) {
    console.log("Notification error:", error.message);
  }
};

const parseAppointmentDate = (slotDate, slotTime) => {
  const [day, month, year] = String(slotDate).split("-").map(Number);
  const time = String(slotTime || "00:00").trim();
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let hour = match ? Number(match[1]) : 0;
  const minute = match ? Number(match[2]) : 0;
  const meridiem = match?.[3]?.toUpperCase();
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

const createUpcomingAppointmentNotifications = async (userId) => {
  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const appointments = await appointmentModel.find({
    userId,
    status: "confirmed",
    cancelled: false,
    isCompleted: false,
  });

  for (const appointment of appointments) {
    const appointmentDate = parseAppointmentDate(appointment.sloteDate, appointment.sloteTime);
    if (appointmentDate > now && appointmentDate <= oneDayFromNow) {
      await createNotification({
        recipientType: "user",
        recipientId: userId,
        title: "Randevunuz yaklaşıyor",
        message: `${appointment.docData.name} ile randevunuz ${appointment.sloteDate} ${appointment.sloteTime} tarihinde.`,
        link: "/my-appointments",
        dedupeKey: `appointment-reminder-${appointment._id}`,
      });
    }
  }
};

const createAppointmentStatusNotifications = async (userId) => {
  const appointments = await appointmentModel.find({ userId });
  for (const appointment of appointments) {
    if (appointment.status === "confirmed") {
      await createNotification({
        recipientType: "user",
        recipientId: userId,
        title: "Randevunuz onaylandı",
        message: `${appointment.docData.name} randevunuzu onayladı.`,
        link: "/my-appointments",
        dedupeKey: `appointment-confirmed-${appointment._id}`,
      });
    }
    if (appointment.status === "rejected") {
      await createNotification({
        recipientType: "user",
        recipientId: userId,
        title: "Randevu isteğiniz reddedildi",
        message: `${appointment.docData.name} randevu isteğinizi reddetti.`,
        link: "/my-appointments",
        dedupeKey: `appointment-rejected-${appointment._id}`,
      });
    }
    if (appointment.isCompleted || appointment.status === "completed") {
      await createNotification({
        recipientType: "user",
        recipientId: userId,
        title: "Randevu tamamlandı",
        message: `${appointment.docData.name} ile randevunuz tamamlandı. Dilerseniz doktoru değerlendirebilirsiniz.`,
        link: "/my-appointments",
        dedupeKey: `appointment-completed-${appointment._id}`,
      });
    }
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    await createAppointmentStatusNotifications(req.userId);
    await createUpcomingAppointmentNotifications(req.userId);
    const notifications = await notificationModel.find({ recipientType: "user", recipientId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getUserUnreadNotificationCount = async (req, res) => {
  try {
    await createAppointmentStatusNotifications(req.userId);
    await createUpcomingAppointmentNotifications(req.userId);
    const count = await notificationModel.countDocuments({ recipientType: "user", recipientId: req.userId, read: false });
    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const markUserNotificationsRead = async (req, res) => {
  try {
    await notificationModel.updateMany({ recipientType: "user", recipientId: req.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({ recipientType: "doctor", recipientId: req.docId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorUnreadNotificationCount = async (req, res) => {
  try {
    const count = await notificationModel.countDocuments({ recipientType: "doctor", recipientId: req.docId, read: false });
    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const markDoctorNotificationsRead = async (req, res) => {
  try {
    await notificationModel.updateMany({ recipientType: "doctor", recipientId: req.docId, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
