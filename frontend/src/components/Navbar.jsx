import { NavLink, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import profileLogo from "../assets/profileLogo.png";
import { assets } from "../assets/assets_frontend/assets.js";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";

const links = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/doctors", label: "Doktorlar" },
  { to: "/favorites", label: "Favoriler" },
  { to: "/compare", label: "Karşılaştır" },
  { to: "/recent", label: "Son Bakılanlar" },
  { to: "/about", label: "Hakkımızda" },
  { to: "/contact", label: "İletişim" },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData, unreadNotifications } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const menuItemClass = "w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50 hover:text-slate-950";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <button type="button" className="flex items-center gap-3" onClick={() => navigate("/")} aria-label="Ana sayfaya git">
          <img src={logoImage} alt="Dector logo" className="h-14 w-14 object-contain" />
          <span className="hidden text-lg font-bold text-slate-950 sm:block">Dector</span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm xl:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>{link.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {token && userData ? (
            <div className="group relative flex cursor-pointer items-center gap-2">
              <img className="h-11 w-11 rounded-full border border-slate-200 object-cover" src={userData.image || profileLogo} alt="Profil" />
              <img className="w-3 opacity-60" src={assets.dropdown_icon} alt="" />
              <div className="absolute right-0 top-10 hidden pt-4 group-hover:block">
                <div className="min-w-60 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-600 shadow-xl shadow-slate-900/10">
                  <button onClick={() => navigate("/my-profile")} className={menuItemClass}>Profilim</button>
                  <button onClick={() => navigate("/my-appointments")} className={menuItemClass}>Randevularım</button>
                  <button onClick={() => navigate("/my-prescriptions")} className={menuItemClass}>Recetelerim</button>
                  <button onClick={() => navigate("/medical-record")} className={menuItemClass}>Sağlık kaydı</button>
                  <button onClick={() => navigate("/notifications")} className={`${menuItemClass} flex items-center justify-between gap-3`}>
                    <span>Bildirimler</span>
                    <NotificationBadge count={unreadNotifications} />
                  </button>
                  <button onClick={() => setDarkMode((prev) => !prev)} className={menuItemClass}>Tema: {darkMode ? "Light" : "Dark"}</button>
                  <button onClick={logout} className="w-full rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50">Çıkış yap</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="btn-primary hidden md:inline-flex">Giriş Yap</button>
          )}

          <button type="button" onClick={() => setShowMenu(true)} className="rounded-full border border-slate-200 p-3 xl:hidden" aria-label="Menüyü aç">
            <img className="w-5" src={assets.menu_icon} alt="" />
          </button>
        </div>
      </div>

      <div className={`${showMenu ? "fixed inset-0" : "pointer-events-none fixed inset-0 translate-x-full"} z-50 bg-white transition-transform duration-300 xl:hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <img className="h-14 w-14 object-contain" src={logoImage} alt="Dector logo" />
          <button onClick={() => setShowMenu(false)} className="rounded-full border border-slate-200 p-3" aria-label="Menüyü kapat">
            <img className="w-5" src={assets.cross_icon} alt="" />
          </button>
        </div>
        <nav className="flex flex-col gap-3 p-5 text-xl font-semibold">
          {links.map((link) => (
            <NavLink key={link.to} onClick={() => setShowMenu(false)} to={link.to}>
              <p className="rounded-2xl px-5 py-4">{link.label}</p>
            </NavLink>
          ))}
          {token && (
            <>
              <NavLink onClick={() => setShowMenu(false)} to="/my-profile"><p className="rounded-2xl px-5 py-4">Profilim</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/my-appointments"><p className="rounded-2xl px-5 py-4">Randevularım</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/my-prescriptions"><p className="rounded-2xl px-5 py-4">Recetelerim</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/medical-record"><p className="rounded-2xl px-5 py-4">Sağlık kaydı</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/notifications">
                <p className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4">
                  <span>Bildirimler</span>
                  <NotificationBadge count={unreadNotifications} />
                </p>
              </NavLink>
              <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-2xl px-5 py-4 text-left">Tema: {darkMode ? "Light" : "Dark"}</button>
            </>
          )}
          {!token && (
            <button onClick={() => { setShowMenu(false); navigate("/login"); }} className="btn-primary mt-4">Giriş Yap</button>
          )}
        </nav>
      </div>
    </header>
  );
}

function NotificationBadge({ count }) {
  if (!count) return null;

  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

