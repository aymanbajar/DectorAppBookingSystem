import { AdminContext } from "../context/AdminContext";
import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

export default function Sidebar() {
  const { aToken } = useContext(AdminContext);
  const { dToken, unreadNotifications, getUnreadNotifications } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) getUnreadNotifications();
  }, [dToken]);

  const adminLinks = [
    { to: "/admin-dashboard", icon: assets.home_icon, label: "Panel" },
    { to: "/all-appointments", icon: assets.appointment_icon, label: "Randevular" },
    { to: "/add-doctor", icon: assets.add_icon, label: "Doktor Ekle" },
    { to: "/doctor-list", icon: assets.people_icon, label: "Doktorlar" },
    { to: "/patient-list", icon: assets.people_icon, label: "Hastalar" },
    { to: "/admin-center", icon: assets.list_icon, label: "Yönetim" },
  ];

  const doctorLinks = [
    { to: "/doctor-dashboard", icon: assets.home_icon, label: "Panel" },
    { to: "/doctor-appointments", icon: assets.appointment_icon, label: "Randevular" },
    { to: "/doctor-patients", icon: assets.people_icon, label: "Hastalarım" },
    { to: "/doctor-chat", icon: assets.chats_icon || assets.appointment_icon, label: "Mesajlar" },
    { to: "/doctor-notifications", icon: assets.list_icon, label: "Bildirimler" },
    { to: "/doctor-profile", icon: assets.people_icon, label: "Profil" },
  ];

  const links = aToken ? adminLinks : dToken ? doctorLinks : [];

  return (
    <aside className="sticky top-20 min-h-[calc(100vh-5rem)] border-r border-slate-200 bg-white px-2 py-5 md:w-72">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold md:px-5 ${
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`
            }
          >
            <img src={link.icon} alt="" className="h-5 w-5" />
            <span className="hidden min-w-0 flex-1 md:block">{link.label}</span>
            {link.to === "/doctor-notifications" && unreadNotifications > 0 && (
              <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold leading-none text-white">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
