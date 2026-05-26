import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const authHeaders = { Authorization: `Bearer ${dToken}` };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: authHeaders });
      data.success ? setAppointments(data.appointments) : toast.error("Randevular alınamadı");
    } catch (error) {
      console.log(error);
      toast.error("Randevular alınamadı");
    }
  };

  const postAppointmentAction = async (endpoint, appointmentId, successFallback) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/${endpoint}`, { appointmentId }, { headers: authHeaders });
      if (data.success) {
        toast.success(data.message || successFallback);
        getAppointments();
      } else {
        toast.error(data.message || "İşlem tamamlanamadı");
      }
    } catch (error) {
      console.log(error);
      toast.error("İşlem tamamlanamadı");
    }
  };

  const completeAppointment = (appointmentId) => postAppointmentAction("complete-appointment", appointmentId, "Randevu tamamlandı");
  const cancelAppointment = (appointmentId) => postAppointmentAction("cancel-appointment", appointmentId, "Randevu iptal edildi");
  const confirmAppointment = (appointmentId) => postAppointmentAction("confirm-appointment", appointmentId, "Randevu onaylandı");
  const rejectAppointment = (appointmentId) => postAppointmentAction("reject-appointment", appointmentId, "Randevu reddedildi");

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/appointment/${appointmentId}/status`, { status }, { headers: authHeaders });
      if (data.success) {
        toast.success(data.message || "Randevu durumu güncellendi");
        getAppointments();
      } else {
        toast.error(data.message || "Durum güncellenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Durum güncellenemedi");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: authHeaders });
      data.success ? setDashData(data.dashData) : toast.error("Panel verileri alınamadı");
    } catch (error) {
      toast.error("Panel verileri alınamadı");
      console.log(error);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: authHeaders });
      data.success ? setProfileData(data.profileData) : toast.error("Profil verileri alınamadı");
    } catch (error) {
      toast.error("Profil verileri alınamadı");
      console.log(error);
    }
  };

  const getUnreadNotifications = async () => {
    if (!dToken) {
      setUnreadNotifications(0);
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/notifications/unread-count`, { headers: authHeaders });
      if (data.success) setUnreadNotifications(data.count || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    backendUrl,
    dToken,
    setDToken,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    confirmAppointment,
    rejectAppointment,
    updateAppointmentStatus,
    dashData,
    getDashData,
    setDashData,
    getProfileData,
    profileData,
    setProfileData,
    unreadNotifications,
    setUnreadNotifications,
    getUnreadNotifications,
  };

  useEffect(() => {
    if (!dToken) {
      setUnreadNotifications(0);
      return undefined;
    }

    getUnreadNotifications();
    const intervalId = setInterval(getUnreadNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [dToken]);

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;

