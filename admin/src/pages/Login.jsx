import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

export default function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendURL } = useContext(AdminContext);
  const { backendUrl, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendURL}/api/admin/login`, { email, password });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          navigate("/admin-dashboard");
        } else {
          toast.error("Giriş bilgileri doğrulanamadı");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          navigate("/doctor-dashboard");
        } else {
          toast.error("Giriş bilgileri doğrulanamadı");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Giriş yapılamadı");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="admin-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Dector panel</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">{state} Girişi</h1>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">E-posta</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" type="email" required placeholder="example@email.com" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Şifre</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" type="password" required placeholder="••••••••" />
          </label>
        </div>

        <button className="admin-button mt-6 w-full">Giriş Yap</button>

        <p className="mt-5 text-center text-sm text-slate-600">
          {state === "Admin" ? "Doktor girişi için " : "Admin girişi için "}
          <button type="button" className="font-bold text-cyan-700" onClick={() => setState(state === "Admin" ? "Doctor" : "Admin")}>
            buraya tıklayın
          </button>
        </p>
      </div>
    </form>
  );
}
