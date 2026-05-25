import { assets } from "../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

export default function Navbar() {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <img src={assets.admin_logo} alt="Admin logo" className="h-12 w-auto object-contain" />
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
            {aToken ? "Admin" : "Doktor"}
          </span>
        </div>
        <button onClick={logout} className="admin-button px-6 py-2">
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}
