import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const onSubmitHeader = async (event) => {
    event.preventDefault();
    try {
      const endpoint = mode === "register" ? "register" : "login";
      const payload = mode === "register" ? { name, email, password } : { email, password };
      const { data } = await axios.post(`${backendUrl}/api/user/${endpoint}`, payload);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <section className="grid min-h-[calc(100vh-5rem)] place-items-center py-12">
      <form onSubmit={onSubmitHeader} className="surface-card w-full max-w-md p-8">
        <p className="section-eyebrow">{mode === "register" ? "Yeni hesap" : "Hoş geldiniz"}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          {mode === "register" ? "Hesap Oluştur" : "Giriş Yap"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Randevu almak ve geçmiş işlemlerinizi takip etmek için devam edin.
        </p>

        <div className="mt-7 space-y-4">
          {mode === "register" && (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Ad Soyad</span>
              <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="form-input" required />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">E-posta</span>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-input" required />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Şifre</span>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="form-input" required />
          </label>
        </div>

        <button type="submit" className="btn-primary mt-7 w-full">
          {mode === "register" ? "Hesap Oluştur" : "Giriş Yap"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          {mode === "register" ? "Hesabınız var mı? " : "Yeni hesap mı oluşturacaksınız? "}
          <button
            type="button"
            className="font-semibold text-cyan-700 hover:text-cyan-900"
            onClick={() => setMode(mode === "register" ? "login" : "register")}
          >
            {mode === "register" ? "Giriş yapın" : "Kayıt olun"}
          </button>
        </p>
      </form>
    </section>
  );
}

