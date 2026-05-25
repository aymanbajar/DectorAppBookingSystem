import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorNotifications() {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/notifications`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) setNotifications(data.notifications);
    } catch (error) {
      console.log(error);
      toast.error("Bildirimler alınamadı");
    }
  };

  const markRead = async () => {
    await axios.post(`${backendUrl}/api/doctor/notifications/read`, {}, {
      headers: { Authorization: `Bearer ${dToken}` },
    });
    fetchNotifications();
  };

  useEffect(() => {
    if (dToken) fetchNotifications();
  }, [dToken]);

  return (
    <section className="admin-page">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="admin-title mb-0">Bildirimler</h1>
        <button onClick={markRead} className="admin-button px-5 py-2">Okundu İşaretle</button>
      </div>

      <div className="grid gap-4">
        {notifications.length ? notifications.map((item) => (
          <div key={item._id} className="admin-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              {!item.read && <span className="status-pill bg-cyan-50 text-cyan-700">Yeni</span>}
            </div>
          </div>
        )) : (
          <div className="admin-card p-8 text-center text-slate-500">Henüz bildirim yok.</div>
        )}
      </div>
    </section>
  );
}
