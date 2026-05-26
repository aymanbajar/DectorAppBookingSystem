import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "â‚º";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [userData, setUserData] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const clearSession = () => {
    localStorage.removeItem("token");
    setToken(false);
    setUserData(false);
    setUnreadNotifications(0);
  };

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error("Doktorlar alÄ±namadÄ±");
      }
    } catch (error) {
      console.log(error);
      toast.error("Doktorlar alÄ±namadÄ±");
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        if (data.message?.toLowerCase().includes("token")) {
          clearSession();
          return;
        }
        toast.error("KullanÄ±cÄ± bilgileri alÄ±namadÄ±");
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        clearSession();
        return;
      }
      toast.error("KullanÄ±cÄ± bilgileri alÄ±namadÄ±");
    }
  };

  const getUnreadNotifications = async () => {
    if (!token) {
      setUnreadNotifications(0);
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUnreadNotifications(data.count || 0);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) clearSession();
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    unreadNotifications,
    setUnreadNotifications,
    getUnreadNotifications,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
      getUnreadNotifications();
    } else {
      setUserData(false);
      setUnreadNotifications(0);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    const intervalId = setInterval(getUnreadNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [token]);

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
