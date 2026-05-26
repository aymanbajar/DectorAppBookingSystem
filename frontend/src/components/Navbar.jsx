import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import logoImage from "../assets/logo.png";
import profileLogo from "../assets/profileLogo.png";
import { assets } from "../assets/assets_frontend/assets.js";
import { AppContext } from "../context/AppContext.jsx";

const mainLinks = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/doctors", label: "Doktorlar" },
  { to: "/favorites", label: "Favoriler" },
  { to: "/compare", label: "Karsilastir" },
  { to: "/recent", label: "Son Bakilanlar" },
  { to: "/about", label: "Hakkimizda" },
  { to: "/contact", label: "Iletisim" },
];

const accountLinks = [
  { to: "/my-profile", label: "Profilim" },
  { to: "/my-appointments", label: "Randevularim" },
  { to: "/my-prescriptions", label: "Recetelerim" },
  { to: "/medical-record", label: "Saglik kaydi" },
  { to: "/notifications", label: "Bildirimler", hasBadge: true },
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

  const closeMenu = () => setShowMenu(false);

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const menuItemClass = "w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50 hover:text-slate-950";
  const mobileLinkClass = "rounded-2xl px-5 py-3 text-slate-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <button type="button" className="flex items-center gap-3" onClick={() => navigate("/")} aria-label="Ana sayfaya git">
          <img src={logoImage} alt="Dector logo" className="h-14 w-14 object-contain" />
          <span className="hidden text-lg font-bold text-slate-950 sm:block">Dector</span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm xl:flex">
          {mainLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {token && userData ? (
            <div className="group relative flex cursor-pointer items-center gap-2">
              <img className="h-11 w-11 rounded-full border border-slate-200 object-cover" src={userData.image || profileLogo} alt="Profil" />
              <img className="w-3 opacity-60" src={assets.dropdown_icon} alt="" />
              <div className="absolute right-0 top-10 hidden pt-4 group-hover:block">
                <div className="min-w-60 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-600 shadow-xl shadow-slate-900/10">
                  {accountLinks.map((link) => (
                    <button key={link.to} onClick={() => navigate(link.to)} className={`${menuItemClass} ${link.hasBadge ? "flex items-center justify-between gap-3" : ""}`}>
                      <span>{link.label}</span>
                      {link.hasBadge && <NotificationBadge count={unreadNotifications} />}
                    </button>
                  ))}
                  <button onClick={() => setDarkMode((prev) => !prev)} className={menuItemClass}>Tema: {darkMode ? "Light" : "Dark"}</button>
                  <button onClick={logout} className="w-full rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50">Cikis yap</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="btn-primary hidden md:inline-flex">Giris Yap</button>
          )}

          <button type="button" onClick={() => setShowMenu(true)} className="rounded-full border border-slate-200 p-3 xl:hidden" aria-label="Menuyu ac">
            <img className="w-5" src={assets.menu_icon} alt="" />
          </button>
        </div>
      </div>

      <div className={`${showMenu ? "fixed inset-0 translate-x-0" : "pointer-events-none fixed inset-0 translate-x-full"} z-[100] flex h-screen max-h-screen flex-col overflow-hidden bg-white transition-transform duration-300 xl:hidden`}>
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-5">
          <img className="h-14 w-14 object-contain" src={logoImage} alt="Dector logo" />
          <button onClick={closeMenu} className="rounded-full border border-slate-200 p-3" aria-label="Menuyu kapat">
            <img className="w-5" src={assets.cross_icon} alt="" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-28 text-base font-semibold">
          <div className="grid gap-1">
            {mainLinks.map((link) => (
              <NavLink key={link.to} onClick={closeMenu} to={link.to}>
                <p className={mobileLinkClass}>{link.label}</p>
              </NavLink>
            ))}
          </div>

          {token ? (
            <div className="mt-4 grid gap-1 border-t border-slate-100 pt-4">
              {accountLinks.map((link) => (
                <NavLink key={link.to} onClick={closeMenu} to={link.to}>
                  <p className={`${mobileLinkClass} ${link.hasBadge ? "flex items-center justify-between gap-3" : ""}`}>
                    <span>{link.label}</span>
                    {link.hasBadge && <NotificationBadge count={unreadNotifications} />}
                  </p>
                </NavLink>
              ))}
              <button onClick={() => setDarkMode((prev) => !prev)} className="w-full rounded-2xl px-5 py-3 text-left text-slate-700">Tema: {darkMode ? "Light" : "Dark"}</button>
              <button onClick={() => { closeMenu(); logout(); }} className="w-full rounded-2xl px-5 py-3 text-left text-red-600">Cikis yap</button>
            </div>
          ) : (
            <button onClick={() => { closeMenu(); navigate("/login"); }} className="btn-primary mt-4 w-full">Giris Yap</button>
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
