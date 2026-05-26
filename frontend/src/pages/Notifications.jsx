import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function Notifications() {
  const { backendUrl, token, getUnreadNotifications } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setNotifications(data.notifications);
        getUnreadNotifications();
      }
    } catch (error) {
      console.log(error);
      toast.error("Bildirimler alınamadı");
    }
  };

  const markRead = async () => {
    await axios.post(`${backendUrl}/api/user/notifications/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
    getUnreadNotifications();
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  return (
    <section className="py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Bildirimler</p>
          <h1 className="section-title mt-2">Hesap bildirimleri</h1>
        </div>
        <button onClick={markRead} className="btn-secondary">Okundu İşaretle</button>
      </div>

      <div className="grid gap-4">
        {notifications.length ? notifications.map((item) => (
          <button key={item._id} onClick={() => item.link && navigate(item.link)} className="surface-card p-5 text-left hover:border-cyan-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              {!item.read && <span className="status-pill bg-cyan-50 text-cyan-700">Yeni</span>}
            </div>
          </button>
        )) : (
          <div className="surface-card p-8 text-center text-slate-500">Henüz bildirim yok.</div>
        )}
      </div>
    </section>
  );
}
