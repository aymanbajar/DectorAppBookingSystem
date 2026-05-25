import appointmentModel from "../models/appointmentModel.js";
import chatModel from "../models/chatModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import { createNotification } from "./notificationController.js";

const ensureUserDoctorAppointment = async (userId, docId) => {
  return appointmentModel.findOne({ userId, docId });
};

const getOrCreateChat = async (userId, docId) => {
  let chat = await chatModel.findOne({ userId, docId });
  if (chat) return chat;

  const appointment = await ensureUserDoctorAppointment(userId, docId);
  if (!appointment) return null;

  const userData = await userModel.findById(userId).select("-password");
  const docData = await doctorModel.findById(docId).select("-password");

  chat = await chatModel.create({
    userId,
    docId,
    userData,
    docData,
    messages: [],
  });

  return chat;
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await chatModel.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getUserChat = async (req, res) => {
  try {
    const chat = await getOrCreateChat(req.userId, req.params.docId);
    if (!chat) return res.json({ success: false, message: "Bu doktorla aktif randevunuz bulunamadı" });
    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const sendUserMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.json({ success: false, message: "Mesaj boş olamaz" });

    const chat = await getOrCreateChat(req.userId, req.params.docId);
    if (!chat) return res.json({ success: false, message: "Bu doktorla aktif randevunuz bulunamadı" });

    chat.messages.push({ senderType: "user", text: text.trim() });
    chat.lastMessage = text.trim();
    await chat.save();
    const lastMessage = chat.messages[chat.messages.length - 1];
    await createNotification({
      recipientType: "doctor",
      recipientId: req.params.docId,
      title: "Yeni hasta mesajı",
      message: `${chat.userData.name}: ${text.trim().slice(0, 80)}`,
      link: "/doctor-chat",
      dedupeKey: `chat-message-${lastMessage._id}`,
    });

    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorChats = async (req, res) => {
  try {
    const chats = await chatModel.find({ docId: req.docId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorChat = async (req, res) => {
  try {
    const chat = await getOrCreateChat(req.params.userId, req.docId);
    if (!chat) return res.json({ success: false, message: "Bu hasta ile aktif randevunuz bulunamadı" });
    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const sendDoctorMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.json({ success: false, message: "Mesaj boş olamaz" });

    const chat = await getOrCreateChat(req.params.userId, req.docId);
    if (!chat) return res.json({ success: false, message: "Bu hasta ile aktif randevunuz bulunamadı" });

    chat.messages.push({ senderType: "doctor", text: text.trim() });
    chat.lastMessage = text.trim();
    await chat.save();
    const lastMessage = chat.messages[chat.messages.length - 1];
    await createNotification({
      recipientType: "user",
      recipientId: req.params.userId,
      title: "Doktorunuzdan yeni mesaj",
      message: `${chat.docData.name}: ${text.trim().slice(0, 80)}`,
      link: `/chat/${req.docId}`,
      dedupeKey: `chat-message-${lastMessage._id}`,
    });

    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
